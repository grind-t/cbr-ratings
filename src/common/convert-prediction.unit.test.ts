import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { convertPrediction } from "./convert-prediction.ts";

describe("convertPrediction (unit)", () => {
  it("should convert known prediction codes", () => {
    assert.equal(convertPrediction("STA - стабильный"), "STA");
    assert.equal(convertPrediction("STA – стабильный"), "STA");
    assert.equal(convertPrediction("POS - позитивный"), "POS");
    assert.equal(convertPrediction("POS – позитивный"), "POS");
    assert.equal(convertPrediction("NEG - негативный"), "NEG");
    assert.equal(convertPrediction("NEG – негативный"), "NEG");
    assert.equal(convertPrediction("DEV - развивающийся"), "DEV");
    assert.equal(convertPrediction("DEV – развивающийся"), "DEV");
  });

  it("should return null for unsupported or empty values", () => {
    assert.equal(convertPrediction(""), null);
    assert.equal(convertPrediction("NA – не предусмотрен методологией"), null);
    assert.equal(convertPrediction("UNW – неопределенный"), null);
    assert.equal(
      convertPrediction("OP – иной(«рейтинг на пересмотре с возможностью понижения»)"),
      null,
    );
  });
});
