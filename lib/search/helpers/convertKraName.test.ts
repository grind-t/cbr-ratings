import assert from "node:assert/strict";
import { it } from "node:test";
import { converKraName } from "./convertKraName.ts";

it('should return EXPERT_RA for АО "Эксперт РА"', () => {
	assert.strictEqual(converKraName('АО "Эксперт РА"'), "EXPERT_RA");
});

it("should return AKRA for АКРА (АО)", () => {
	assert.strictEqual(converKraName("АКРА (АО)"), "AKRA");
});

it('should return NKR for ООО "НКР"', () => {
	assert.strictEqual(converKraName('ООО "НКР"'), "NKR");
});

it('should return NRA for ООО "НРА"', () => {
	assert.strictEqual(converKraName('ООО "НРА"'), "NRA");
});

it("should return undefined for unknown value", () => {
	assert.strictEqual(converKraName("Unknown"), undefined);
});
