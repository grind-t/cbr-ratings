import assert from "node:assert/strict";
import { it } from "node:test";
import { serializeFields } from "./serializeFields.ts";

it("should serialize simple fields", () => {
	const input = { foo: "bar", baz: 42 };
	const result = serializeFields(input);
	assert.equal(result, "fields[foo]=bar&fields[baz]=42");
});

it("should serialize array field", () => {
	const input = { arr: [1, 2, 3] };
	const result = serializeFields(input);
	assert.equal(result, "fields[arr][0]=1&fields[arr][1]=2&fields[arr][2]=3");
});

it("should skip undefined values", () => {
	const input = { foo: undefined, bar: "baz" };
	const result = serializeFields(input);
	assert.equal(result, "fields[bar]=baz");
});

it("should serialize empty object", () => {
	const input = {};
	const result = serializeFields(input);
	assert.equal(result, "");
});

it("should serialize special characters", () => {
	const input = { a: "c&d", b: "g h" };
	const result = serializeFields(input);
	assert.equal(result, "fields[a]=c%26d&fields[b]=g%20h");
});

it("should serialize with custom prefix", () => {
	const input = { foo: "bar" };
	const result = serializeFields(input, "custom");
	assert.equal(result, "custom[foo]=bar");
});
