import { resolve } from "node:path";
import { env, exit } from "node:process";
import { TinkoffInvestApi } from "tinkoff-invest-api";
import z from "zod";
import { fs, sleep } from "zx";
import { latestRatingsByKra } from "../../src/common/latest-ratings-by-kra.ts";
import { searchRatings } from "../../src/rating-search/index.ts";
import { SearchRatingResponseSchema } from "../../src/rating-search/schema/output.ts";

const tInvestApi = new TinkoffInvestApi({
	token: env.T_INVEST_READONLY_TOKEN as string,
});
const bonds = await tInvestApi.instruments.bonds({}).then((v) => v.instruments);
const ratings = new Map<string, object>();

for (const bond of bonds) {
	await sleep(250);

	const response = await searchRatings({
		fields: {
			formSearh: "advanced",
			isin: bond.isin,
			typeGroup: ["Финансовые инструменты"],
		},
	});

	const { data, error } = z.safeParse(SearchRatingResponseSchema, response);

	if (error) {
		console.error(z.prettifyError(error));
		exit(1);
	}

	const bondRatings = data?.data?.itemList;

	if (!bondRatings?.length) {
		console.info(`Missing ratings for bond with isin ${bond.isin}`);
		continue;
	}

	const latestRatings = latestRatingsByKra(bondRatings);

	if (Object.keys(latestRatings).length) {
		ratings.set(bond.isin, latestRatings);
	}
}

fs.outputJSON(
	resolve(import.meta.dirname, "..", "..", "exports", "bond-ratings.json"),
	Object.fromEntries(ratings),
	{ spaces: "\t" },
);
