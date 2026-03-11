import { resolve } from "node:path";
import { env, exit } from "node:process";
import { TinkoffInvestApi } from "tinkoff-invest-api";
import z from "zod";
import { fs, sleep } from "zx";
import { convertKraName } from "../../src/common/convert-kra-name.ts";
import { newestRelevantRating } from "../../src/common/newest-relevant-rating.ts";
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

	const bondRatings = data?.data?.itemList ?? [];

	if (!bondRatings) {
		console.debug(`Missing ratings for bond with isin ${bond.isin}`);
		continue;
	}

	const bondRatingsByKra = Object.groupBy(bondRatings, (v) =>
		convertKraName(v.kraName),
	);

	const rating = Object.fromEntries(
		Object.entries(bondRatingsByKra)
			.map(([k, v]) => [k, newestRelevantRating(v)])
			.filter(([, v]) => !!v),
	);

	if (Object.keys(rating).length) {
		ratings.set(bond.isin, rating);
	}
}

fs.outputJSON(
	resolve(import.meta.dirname, "..", "..", "exports", "bond-ratings.json"),
	Object.fromEntries(ratings),
	{ spaces: "\t" },
);
