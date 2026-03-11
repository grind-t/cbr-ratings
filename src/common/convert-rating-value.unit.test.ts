import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ratingValueToNumber } from "./convert-rating-value.ts";

describe("ratingValueToNumber (unit)", () => {
	it("should convert international ratings to numbers", () => {
		assert.equal(ratingValueToNumber("AAA"), 23);
		assert.equal(ratingValueToNumber("AA+"), 22);
		assert.equal(ratingValueToNumber("AA"), 21);
		assert.equal(ratingValueToNumber("AA-"), 20);
		assert.equal(ratingValueToNumber("A+"), 19);
		assert.equal(ratingValueToNumber("A"), 18);
		assert.equal(ratingValueToNumber("A-"), 17);
		assert.equal(ratingValueToNumber("BBB+"), 16);
		assert.equal(ratingValueToNumber("BBB"), 15);
		assert.equal(ratingValueToNumber("BBB-"), 14);
		assert.equal(ratingValueToNumber("BB+"), 13);
		assert.equal(ratingValueToNumber("BB"), 12);
		assert.equal(ratingValueToNumber("BB-"), 11);
		assert.equal(ratingValueToNumber("B+"), 10);
		assert.equal(ratingValueToNumber("B"), 9);
		assert.equal(ratingValueToNumber("B-"), 8);
		assert.equal(ratingValueToNumber("CCC+"), 7);
		assert.equal(ratingValueToNumber("CCC"), 6);
		assert.equal(ratingValueToNumber("CCC-"), 5);
		assert.equal(ratingValueToNumber("CC+"), 4);
		assert.equal(ratingValueToNumber("CC"), 3);
		assert.equal(ratingValueToNumber("CC-"), 2);
		assert.equal(ratingValueToNumber("C"), 1);
		assert.equal(ratingValueToNumber("D"), 0);
	});

	it("should convert Russian ratings to numbers", () => {
		assert.equal(ratingValueToNumber("ruAAA"), 23);
		assert.equal(ratingValueToNumber("ruAA+"), 22);
		assert.equal(ratingValueToNumber("ruAA"), 21);
		assert.equal(ratingValueToNumber("ruAA-"), 20);
		assert.equal(ratingValueToNumber("ruA+"), 19);
		assert.equal(ratingValueToNumber("ruA"), 18);
		assert.equal(ratingValueToNumber("ruA-"), 17);
		assert.equal(ratingValueToNumber("ruBBB+"), 16);
		assert.equal(ratingValueToNumber("ruBBB"), 15);
		assert.equal(ratingValueToNumber("ruBBB-"), 14);
		assert.equal(ratingValueToNumber("ruBB+"), 13);
		assert.equal(ratingValueToNumber("ruBB"), 12);
		assert.equal(ratingValueToNumber("ruBB-"), 11);
		assert.equal(ratingValueToNumber("ruB+"), 10);
		assert.equal(ratingValueToNumber("ruB"), 9);
		assert.equal(ratingValueToNumber("ruB-"), 8);
		assert.equal(ratingValueToNumber("ruCCC+"), 7);
		assert.equal(ratingValueToNumber("ruCCC"), 6);
		assert.equal(ratingValueToNumber("ruCCC-"), 5);
		assert.equal(ratingValueToNumber("ruCC+"), 4);
		assert.equal(ratingValueToNumber("ruCC"), 3);
		assert.equal(ratingValueToNumber("ruCC-"), 2);
		assert.equal(ratingValueToNumber("ruC"), 1);
		assert.equal(ratingValueToNumber("ruD"), 0);
	});

	it("should return undefined for withdrawn ratings", () => {
		assert.equal(ratingValueToNumber("Rating withdrawn"), undefined);
		assert.equal(ratingValueToNumber("Рейтинг отозван"), undefined);
	});
});
