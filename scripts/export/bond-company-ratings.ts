import { resolve } from "node:path";
import { env, exit } from "node:process";
import { getMoexBondSecurities } from "@grind-t/moex";
import { toRecord } from "@grind-t/toolkit/array";
import dayjs from "dayjs";
import { TinkoffInvestApi } from "tinkoff-invest-api";
import z from "zod";
import { fs, sleep } from "zx";
import { latestRating } from "../../src/common/latest-rating.ts";
import { latestRatingsByKra } from "../../src/common/latest-ratings-by-kra.ts";
import { searchRatings } from "../../src/rating-search/index.ts";
import { SearchRatingResponseSchema } from "../../src/rating-search/schema/output.ts";

const tInvestApi = new TinkoffInvestApi({
	token: env.T_INVEST_READONLY_TOKEN as string,
});

const [bonds, moexSecurities] = await Promise.all([
	tInvestApi.instruments.bonds({}).then((v) => v.instruments),
	getMoexBondSecurities().then((v) => toRecord(v, (v) => v.isin)),
]);

const emitentInns = bonds.reduce((acc, v) => {
	const moexSecurity = moexSecurities[v.isin];
	const emitentInn = moexSecurity?.emitent_inn;

	if (!emitentInn) {
		console.warn(`Missing emitent inn for bond with isin ${v.isin}`);
		return acc;
	}

	acc.add(emitentInn);
	return acc;
}, new Set<string>());

const ratings = new Map<string, object>();

for (const inn of emitentInns) {
	await sleep(250);

	const response = await searchRatings({
		fields: {
			formSearh: "advanced",
			inn,
			dateFrom: dayjs().subtract(1, "year").format("DD.MM.YYYY"),
			typeGroup: [
				"Негосударственные пенсионные фонды",
				"Страховые организации",
				"Прочие организации",
				"Лизинговые компании",
				"Кредитные организации",
				"Микрофинансовые организации",
				"Объекты суверенного кредитного рейтинга",
			],
		},
	});

	const { data, error } = z.safeParse(SearchRatingResponseSchema, response);

	if (error) {
		console.error(z.prettifyError(error));
		exit(1);
	}

	const companyRatings = data.data?.itemList;

	if (!companyRatings?.length) {
		console.info(`Missing ratings for company with inn ${inn}`);
		continue;
	}

	const latestRatings = latestRatingsByKra(companyRatings);

	if (Object.keys(latestRatings).length) {
		ratings.set(inn, latestRating);
	}
}

fs.outputJSON(
	resolve(
		import.meta.dirname,
		"..",
		"..",
		"exports",
		"bond-company-ratings.json",
	),
	Object.fromEntries(ratings),
	{ spaces: "\t" },
);
