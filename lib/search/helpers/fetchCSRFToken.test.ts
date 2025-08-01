import assert from "node:assert/strict";
import { it } from "node:test";
import { fetchCSRFToken } from "./fetchCSRFToken.ts";

it("should fetch CSRF token from CBR ratings website", async () => {
	const token = await fetchCSRFToken(fetch);

	assert.strictEqual(typeof token, "string", "Token should be a string");
	assert.ok(token.length >= 32, "Token should be at least 32 characters long");
	assert.ok(
		/^[a-zA-Z0-9_-]+$/.test(token),
		"Token should contain only valid characters",
	);
});
