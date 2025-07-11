import test from "node:test";
import assert from "node:assert/strict";
import { serializeFields } from "./serializeFields.ts";

test("serializeFields: simple fields", () => {
  const input = { foo: "bar", baz: 42 };
  const result = serializeFields(input);
  assert.equal(result, "fields[foo]=bar&fields[baz]=42");
});

test("serializeFields: array field", () => {
  const input = { arr: [1, 2, 3] };
  const result = serializeFields(input);
  assert.equal(result, "fields[arr][0]=1&fields[arr][1]=2&fields[arr][2]=3");
});

test("serializeFields: undefined values are skipped", () => {
  const input = { foo: undefined, bar: "baz" };
  const result = serializeFields(input);
  assert.equal(result, "fields[bar]=baz");
});

test("serializeFields: empty object", () => {
  const input = {};
  const result = serializeFields(input);
  assert.equal(result, "");
});

test("serializeFields: special characters", () => {
  const input = { a: "c&d", b: "g h" };
  const result = serializeFields(input);
  assert.equal(result, "fields[a]=c%26d&fields[b]=g%20h");
});

test("serializeFields: custom prefix", () => {
  const input = { foo: "bar" };
  const result = serializeFields(input, "custom");
  assert.equal(result, "custom[foo]=bar");
});
