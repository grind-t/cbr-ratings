import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { RatingItem } from "../rating-search/schema/output.ts";
import { latestRatingsByKra } from "./latest-ratings-by-kra.ts";

const makeItem = (overrides: Partial<RatingItem>): RatingItem => ({
	ratingAction: overrides.ratingAction ?? "",
	country: overrides.country ?? "RU",
	koNumber: overrides.koNumber ?? "",
	releaseDate: overrides.releaseDate ?? "01-01-2000",
	inn: overrides.inn ?? "",
	objectType: overrides.objectType ?? "",
	ratingValue: overrides.ratingValue ?? "BBB",
	prediction: overrides.prediction ?? "",
	objectName: overrides.objectName ?? "",
	kraName: overrides.kraName ?? "",
	releaseUrl: overrides.releaseUrl ?? "",
	objectId: overrides.objectId ?? "",
	isin: overrides.isin ?? "",
	subjectName: overrides.subjectName ?? "",
});

describe("latestRatingsByKra (unit)", () => {
	it("returns empty object for empty input", () => {
		const res = latestRatingsByKra([]);
		assert.deepEqual(res, {});
	});

	it("returns single kra key for single item", () => {
		const item = makeItem({
			kraName: "АКРА",
			ratingValue: "AA",
			releaseDate: "01-01-2023",
		});
		const res = latestRatingsByKra([item]);
		assert.equal(res.AKRA, item);
		assert.equal(Object.keys(res).length, 1);
	});

	it("returns the newest item when multiple items belong to same kra", () => {
		const older = makeItem({
			kraName: "АКРА",
			ratingValue: "BBB",
			releaseDate: "01-01-2020",
		});
		const newer = makeItem({
			kraName: "АКРА",
			ratingValue: "AA",
			releaseDate: "05-05-2023",
		});
		const res = latestRatingsByKra([older, newer]);
		assert.equal(res.AKRA, newer);
		assert.equal(Object.keys(res).length, 1);
	});

	it("groups items by different kra keys", () => {
		const akra = makeItem({
			kraName: "АКРА",
			ratingValue: "AA",
			releaseDate: "01-01-2023",
		});
		const nkr = makeItem({
			kraName: "НКР",
			ratingValue: "BBB",
			releaseDate: "02-02-2022",
		});
		const expert = makeItem({
			kraName: "Эксперт РА",
			ratingValue: "A",
			releaseDate: "03-03-2021",
		});
		const nra = makeItem({
			kraName: "НРА",
			ratingValue: "BB",
			releaseDate: "04-04-2020",
		});

		const res = latestRatingsByKra([akra, nkr, expert, nra]);

		assert.equal(res.AKRA, akra);
		assert.equal(res.NKR, nkr);
		assert.equal(res.EXPERT_RA, expert);
		assert.equal(res.NRA, nra);
		assert.equal(Object.keys(res).length, 4);
	});

	it("keeps kra with valid ratings and omits kra where all are withdrawn", () => {
		const withdrawnAkra = makeItem({
			kraName: "АКРА",
			ratingValue: "Рейтинг отозван",
			releaseDate: "10-10-2023",
		});
		const validNkr = makeItem({
			kraName: "НКР",
			ratingValue: "A",
			releaseDate: "01-01-2022",
		});
		const res = latestRatingsByKra([withdrawnAkra, validNkr]);
		assert.equal(res.NKR, validNkr);
		assert.equal(Object.keys(res).length, 1);
	});
});
