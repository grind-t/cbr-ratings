import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { fetchCSRFToken } from "./fetch-csrf-token.ts";

describe("fetchCSRFToken (e2e)", () => {
	it("should fetch CSRF token from CBR ratings website", async () => {
		const token = await fetchCSRFToken(fetch);

		assert.ok(token);
		assert.equal(typeof token, "string");
		assert.equal(token.length, 32);
		assert.ok(
			/^[a-zA-Z0-9_-]+$/.test(token),
			"Token should contain only valid characters",
		);
	});
});
