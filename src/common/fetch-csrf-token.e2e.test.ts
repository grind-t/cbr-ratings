import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { fetchCsrfToken } from "./fetch-csrf-token.ts";

describe("fetchCsrfToken (e2e)", () => {
	it("should fetch CSRF token from CBR ratings website", async () => {
		const token = await fetchCsrfToken(fetch);

		assert.ok(token);
		assert.equal(typeof token, "string");
		assert.equal(token.length, 32);
		assert.ok(
			/^[a-zA-Z0-9_-]+$/.test(token),
			"Token should contain only valid characters",
		);
	});
});
