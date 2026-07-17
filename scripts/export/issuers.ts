import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { env, exit } from "node:process";
import { setTimeout } from "node:timers/promises";

import { getMoexBondSecurities } from "@grind-t/moex";
import { TInvestApi } from "@grind-t/t-invest";
import { toRecord } from "@grind-t/toolkit/array";
import dayjs from "dayjs";
import z from "zod";

import { latestRatingsByKra } from "../../src/common/latest-ratings-by-kra.ts";
import { searchRatings } from "../../src/rating-search/index.ts";
import { SearchRatingResponseSchema } from "../../src/rating-search/schema/output.ts";

const tInvestApi = new TInvestApi(env.T_INVEST_READONLY_TOKEN);

const [bonds, moexSecurities] = await Promise.all([
  tInvestApi.instruments.bonds({}).then((v) => v.instruments),
  getMoexBondSecurities().then((v) => toRecord(v, (v) => v.isin)),
]);

const inns = bonds.reduce((acc, v) => {
  const moexSecurity = moexSecurities[v.isin];
  const inn = moexSecurity?.emitent_inn;

  if (!inn) {
    console.warn(`Missing issuer inn for bond with isin ${v.isin}`);
    return acc;
  }

  acc.add(inn);
  return acc;
}, new Set<string>());

const ratings = new Map<string, object>();

for (const inn of inns) {
  await setTimeout(250);

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
    ratings.set(inn, latestRatings);
  }
}

writeFileSync(
  resolve(import.meta.dirname, "..", "..", "exports", "issuers.json"),
  JSON.stringify(Object.fromEntries(ratings)),
);
