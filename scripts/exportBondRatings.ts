import { resolve } from "node:path";
import { env } from "node:process";
import { TinkoffInvestApi } from "tinkoff-invest-api";
import { fs, sleep } from "zx";
import { searchRatings } from "../lib/index.ts";
import { converKraName } from "../lib/search/helpers/convertKraName.ts";
import { newestRelevantRating } from "../lib/search/helpers/newestRelevantRating.ts";

const tInvestApi = new TinkoffInvestApi({
	token: env.T_INVEST_READONLY_TOKEN,
});
const bonds = await tInvestApi.instruments.bonds({}).then((v) => v.instruments);
const ratings = new Map<string, object>();

for (const bond of bonds) {
	await sleep(500);

	const response = await searchRatings({
		fields: {
			formSearh: "advanced",
			isin: bond.isin,
			typeGroup: ["Финансовые инструменты"],
		},
	});

	const bondRatings = response.data?.itemList;

	if (!bondRatings) {
		console.warn(`Missing ratings for bond with isin ${bond.isin}`);
		continue;
	}

	const bondRatingsByKra = Object.groupBy(bondRatings, (v) =>
		converKraName(v.kraName),
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
	resolve(import.meta.dirname, "..", "exports", "bondRatings.json"),
	Object.fromEntries(ratings),
	{ spaces: "\t" },
);
