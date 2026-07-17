import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { env, exit } from "node:process";
import { setTimeout } from "node:timers/promises";

import { TInvestApi } from "@grind-t/t-invest";
import z from "zod";

import { latestRatingsByKra } from "../../src/common/latest-ratings-by-kra.ts";
import { searchRatings } from "../../src/rating-search/index.ts";
import { SearchRatingResponseSchema } from "../../src/rating-search/schema/output.ts";

const tInvestApi = new TInvestApi(env.T_INVEST_READONLY_TOKEN);
const bonds = await tInvestApi.instruments.bonds({}).then((v) => v.instruments);
const ratings = new Map<string, object>();

for (const bond of bonds) {
  await setTimeout(250);

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

writeFileSync(
  resolve(import.meta.dirname, "..", "..", "exports", "bonds.json"),
  JSON.stringify(Object.fromEntries(ratings)),
);
