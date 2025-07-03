import assert from "node:assert";
import { it } from "node:test";
import { add } from "./index.ts";

it("adds two numbers", () => {
	assert.strictEqual(add(1, 2), 3);
});
