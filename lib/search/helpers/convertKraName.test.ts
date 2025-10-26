import assert from "node:assert/strict";
import { it } from "node:test";
import { convertKraName } from "./convertKraName.ts";

it('should return EXPERT_RA for АО "Эксперт РА"', () => {
	assert.strictEqual(convertKraName('АО "Эксперт РА"'), "EXPERT_RA");
});

it("should return AKRA for АКРА (АО)", () => {
	assert.strictEqual(convertKraName("АКРА (АО)"), "AKRA");
});

it('should return NKR for ООО "НКР"', () => {
	assert.strictEqual(convertKraName('ООО "НКР"'), "NKR");
});

it('should return NRA for ООО "НРА"', () => {
	assert.strictEqual(convertKraName('ООО "НРА"'), "NRA");
});

it("should return undefined for unknown value", () => {
	assert.strictEqual(convertKraName("Unknown"), undefined);
});
