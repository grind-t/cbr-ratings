import { it } from "node:test";
import assert from "node:assert/strict";
import { ratingValueToNumber } from "./convertRatingValue.ts";

it("should convert international ratings to numbers", () => {
  assert.strictEqual(ratingValueToNumber("AAA"), 23);
  assert.strictEqual(ratingValueToNumber("AA+"), 22);
  assert.strictEqual(ratingValueToNumber("AA"), 21);
  assert.strictEqual(ratingValueToNumber("AA-"), 20);
  assert.strictEqual(ratingValueToNumber("A+"), 19);
  assert.strictEqual(ratingValueToNumber("A"), 18);
  assert.strictEqual(ratingValueToNumber("A-"), 17);
  assert.strictEqual(ratingValueToNumber("BBB+"), 16);
  assert.strictEqual(ratingValueToNumber("BBB"), 15);
  assert.strictEqual(ratingValueToNumber("BBB-"), 14);
  assert.strictEqual(ratingValueToNumber("BB+"), 13);
  assert.strictEqual(ratingValueToNumber("BB"), 12);
  assert.strictEqual(ratingValueToNumber("BB-"), 11);
  assert.strictEqual(ratingValueToNumber("B+"), 10);
  assert.strictEqual(ratingValueToNumber("B"), 9);
  assert.strictEqual(ratingValueToNumber("B-"), 8);
  assert.strictEqual(ratingValueToNumber("CCC+"), 7);
  assert.strictEqual(ratingValueToNumber("CCC"), 6);
  assert.strictEqual(ratingValueToNumber("CCC-"), 5);
  assert.strictEqual(ratingValueToNumber("CC+"), 4);
  assert.strictEqual(ratingValueToNumber("CC"), 3);
  assert.strictEqual(ratingValueToNumber("CC-"), 2);
  assert.strictEqual(ratingValueToNumber("C"), 1);
  assert.strictEqual(ratingValueToNumber("D"), 0);
});

it("should convert Russian ratings to numbers", () => {
  assert.strictEqual(ratingValueToNumber("ruAAA"), 23);
  assert.strictEqual(ratingValueToNumber("ruAA+"), 22);
  assert.strictEqual(ratingValueToNumber("ruAA"), 21);
  assert.strictEqual(ratingValueToNumber("ruAA-"), 20);
  assert.strictEqual(ratingValueToNumber("ruA+"), 19);
  assert.strictEqual(ratingValueToNumber("ruA"), 18);
  assert.strictEqual(ratingValueToNumber("ruA-"), 17);
  assert.strictEqual(ratingValueToNumber("ruBBB+"), 16);
  assert.strictEqual(ratingValueToNumber("ruBBB"), 15);
  assert.strictEqual(ratingValueToNumber("ruBBB-"), 14);
  assert.strictEqual(ratingValueToNumber("ruBB+"), 13);
  assert.strictEqual(ratingValueToNumber("ruBB"), 12);
  assert.strictEqual(ratingValueToNumber("ruBB-"), 11);
  assert.strictEqual(ratingValueToNumber("ruB+"), 10);
  assert.strictEqual(ratingValueToNumber("ruB"), 9);
  assert.strictEqual(ratingValueToNumber("ruB-"), 8);
  assert.strictEqual(ratingValueToNumber("ruCCC+"), 7);
  assert.strictEqual(ratingValueToNumber("ruCCC"), 6);
  assert.strictEqual(ratingValueToNumber("ruCCC-"), 5);
  assert.strictEqual(ratingValueToNumber("ruCC+"), 4);
  assert.strictEqual(ratingValueToNumber("ruCC"), 3);
  assert.strictEqual(ratingValueToNumber("ruCC-"), 2);
  assert.strictEqual(ratingValueToNumber("ruC"), 1);
  assert.strictEqual(ratingValueToNumber("ruD"), 0);
});

it("should return undefined for withdrawn ratings", () => {
  assert.strictEqual(ratingValueToNumber("Rating withdrawn"), undefined);
  assert.strictEqual(ratingValueToNumber("Рейтинг отозван"), undefined);
});
