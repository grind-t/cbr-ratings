import assert from "node:assert/strict";
import { it } from "node:test";
import { searchRatings } from "./index.ts";
import { SearchRatingResponseSchema } from "./types/output.ts";

it("should return valid ratings for 'Sber'", async () => {
	try {
		const response = await searchRatings({
			fields: {
				formSearh: "advanced",
				ratingName: "Сбер",
			},
		});

		const validationResult = SearchRatingResponseSchema.safeParse(response);
		assert.ok(validationResult.success);
	} catch (error) {
		assert.fail(`Request failed with error: ${error}`);
	}
});

it("should return valid ratings for 'VIS Finance' inn", async () => {
	try {
		const response = await searchRatings({
			fields: {
				formSearh: "advanced",
				inn: "4705081944",
			},
		});

		const validationResult = SearchRatingResponseSchema.safeParse(response);
		assert.ok(validationResult.success);
	} catch (error) {
		assert.fail(`Request failed with error: ${error}`);
	}
});
