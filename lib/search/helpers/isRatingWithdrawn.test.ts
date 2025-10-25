import assert from "node:assert/strict";
import { it } from "node:test";
import { isRatingWithdrawn } from "./isRatingWithdrawn.ts";

it("should return true for withdrawn rating value", () => {
  assert.strictEqual(
    isRatingWithdrawn(
      "Рейтинг отозван",
      "WD - отзыв кредитного рейтинга, WDP – отозван прогноз по кредитному рейтингу"
    ),
    true
  );
});


it("should handle undefined action", () => {
  assert.strictEqual(isRatingWithdrawn("Рейтинг отозван"), true);
  assert.strictEqual(isRatingWithdrawn("AAA"), false);
});
