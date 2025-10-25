import { resolve } from "node:path";
import { env } from "node:process";
import { getMoexBondSecurities } from "@grind-t/moex";
import { toRecord } from "@grind-t/toolkit/array";
import dayjs from "dayjs";
import { TinkoffInvestApi } from "tinkoff-invest-api";
import { fs, sleep } from "zx";
import { searchRatings } from "../lib/index.ts";
import { converKraName } from "../lib/search/helpers/convertKraName.ts";
import { newestRelevantRating } from "../lib/search/helpers/newestRelevantRating.ts";

const tInvestApi = new TinkoffInvestApi({
	token: env.T_INVEST_READONLY_TOKEN,
});

const [bonds, moexSecurities] = await Promise.all([
	tInvestApi.instruments.bonds({}).then((v) => v.instruments),
	getMoexBondSecurities().then((v) => toRecord(v, (v) => v.isin)),
]);

const emitentInns = bonds.reduce((acc, v) => {
	if (!v.buyAvailableFlag || !v.apiTradeAvailableFlag) {
		return acc;
	}

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
	await sleep(500);

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

	const companyRatings = response.data?.itemList;

	if (!companyRatings) {
		console.warn(`Missing ratings for company with inn ${inn}`);
		continue;
	}

	const companyRatingsByKra = Object.groupBy(companyRatings, (v) =>
		converKraName(v.kraName),
	);

	const rating = Object.fromEntries(
		Object.entries(companyRatingsByKra)
			.map(([k, v]) => [k, newestRelevantRating(v)])
			.filter(([, v]) => !!v),
	);

	if (Object.keys(rating).length) {
		ratings.set(inn, rating);
	}
}

fs.outputJSON(
	resolve(import.meta.dirname, "..", "exports", "bondCompanyRatings.json"),
	Object.fromEntries(ratings),
	{ spaces: "\t" },
);
