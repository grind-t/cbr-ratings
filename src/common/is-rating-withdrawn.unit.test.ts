import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isRatingWithdrawn } from "./is-rating-withdrawn.ts";

describe("isRatingWithdrawn (unit)", () => {
	it("should return true for withdrawn rating value", () => {
		assert.equal(
			isRatingWithdrawn(
				"Рейтинг отозван",
				"WD - отзыв кредитного рейтинга, WDP – отозван прогноз по кредитному рейтингу",
			),
			true,
		);
	});

	it("should handle undefined action", () => {
		assert.equal(isRatingWithdrawn("Рейтинг отозван"), true);
		assert.equal(isRatingWithdrawn("AAA"), false);
	});
});
