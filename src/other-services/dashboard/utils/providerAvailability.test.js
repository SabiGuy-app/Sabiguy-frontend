import test from "node:test";
import assert from "node:assert/strict";
import {
  isDiscoverableProvider,
  mergeProviderAvailability,
} from "./providerAvailability.js";

test("only explicitly available providers with fresh-enough locations are shown", () => {
  assert.equal(isDiscoverableProvider({ availability: { isAvailable: true } }), true);
  assert.equal(isDiscoverableProvider({ availability: { isAvailable: false } }), false);
  assert.equal(isDiscoverableProvider({ locationFresh: true }), false);
  assert.equal(
    isDiscoverableProvider({ availability: { isAvailable: true }, locationFresh: false }),
    false,
  );
});

test("nearby results cannot turn an explicitly offline directory provider online", () => {
  const merged = mergeProviderAvailability(
    { availability: { isAvailable: false } },
    { locationFresh: true },
  );
  assert.equal(isDiscoverableProvider(merged), false);
});

test("an online directory provider remains visible after a nearby merge", () => {
  const merged = mergeProviderAvailability(
    { availability: { isAvailable: true } },
    { locationFresh: true },
  );
  assert.equal(isDiscoverableProvider(merged), true);
});
