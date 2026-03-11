import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { convertKraName } from "./convert-kra-name.ts";

describe("convertKraName (unit)", () => {
	it('should return EXPERT_RA for АО "Эксперт РА"', () => {
		assert.equal(convertKraName('АО "Эксперт РА"'), "EXPERT_RA");
	});

	it("should return AKRA for АКРА (АО)", () => {
		assert.equal(convertKraName("АКРА (АО)"), "AKRA");
	});

	it('should return NKR for ООО "НКР"', () => {
		assert.equal(convertKraName('ООО "НКР"'), "NKR");
	});

	it('should return NRA for ООО "НРА"', () => {
		assert.equal(convertKraName('ООО "НРА"'), "NRA");
	});

	it("should return UNKNOWN for unknown value", () => {
		assert.equal(convertKraName("Unknown"), "UNKNOWN");
	});
});
