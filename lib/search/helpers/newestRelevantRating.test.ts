import assert from "node:assert/strict";
import { it } from "node:test";
import type { RatingItem } from "../types/output.ts";
import { newestRelevantRating } from "./newestRelevantRating.ts";

const makeItem = (overrides: Partial<RatingItem>): RatingItem => ({
	ratingAction: overrides.ratingAction ?? "",
	country: overrides.country ?? "RU",
	koNumber: overrides.koNumber ?? "",
	releaseDate: overrides.releaseDate ?? "01-01-2000",
	inn: overrides.inn ?? "",
	objectType: overrides.objectType ?? "",
	ratingValue: overrides.ratingValue ?? "",
	prediction: overrides.prediction ?? "",
	objectName: overrides.objectName ?? "",
	kraName: overrides.kraName ?? "",
	releaseUrl: overrides.releaseUrl ?? "",
	objectId: overrides.objectId ?? "",
	isin: overrides.isin ?? "",
	subjectName: overrides.subjectName ?? "",
});

it("returns the newest non-withdrawn rating", () => {
	const older = makeItem({ releaseDate: "01-01-2020", ratingValue: "BBB" });
	const newer = makeItem({ releaseDate: "02-02-2021", ratingValue: "AA" });

	const res = newestRelevantRating([older, newer]);

	assert.strictEqual(res?.releaseDate, "02-02-2021");
	assert.strictEqual(res?.ratingValue, "AA");
});

it("ignores withdrawn ratings and returns the newest remaining", () => {
	const withdrawnNewest = makeItem({
		releaseDate: "10-10-2022",
		ratingValue: "Рейтинг отозван",
	});
	const older = makeItem({ releaseDate: "01-01-2021", ratingValue: "B" });

	const res = newestRelevantRating([withdrawnNewest, older]);

	assert.strictEqual(res?.releaseDate, "01-01-2021");
	assert.strictEqual(res?.ratingValue, "B");
});

it("returns undefined when all ratings are withdrawn", () => {
	const a = makeItem({
		releaseDate: "01-01-2020",
		ratingValue: "рейтинг отозван",
	});
	const b = makeItem({
		releaseDate: "02-02-2021",
		ratingValue: "",
		ratingAction: "WD",
	});

	const res = newestRelevantRating([a, b]);

	assert.strictEqual(res, undefined);
});
