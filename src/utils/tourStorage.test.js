import assert from "node:assert/strict";
import test from "node:test";
import { claimFirstTourVisit, clearStoragePreservingTours } from "./tourStorage.js";

function createStorage() {
  const storage = {};
  Object.defineProperties(storage, {
    getItem: { value: (key) => storage[key] ?? null },
    setItem: { value: (key, value) => { storage[key] = String(value); } },
    clear: { value: () => Object.keys(storage).forEach((key) => delete storage[key]) },
  });
  return storage;
}

test("leaving an unfinished tour does not make it eligible on the next login", () => {
  const storage = createStorage();
  assert.equal(claimFirstTourVisit(storage, "tourSeen_buyer1"), true);
  clearStoragePreservingTours(storage);
  assert.equal(claimFirstTourVisit(storage, "tourSeen_buyer1"), false);
});

test("session cleanup removes credentials and preserves both tour histories", () => {
  const storage = createStorage();
  storage.setItem("token", "access-token");
  storage.setItem("sabiguy-auth", "user-data");
  storage.setItem("email", "buyer@example.com");
  storage.setItem("tourSeen_buyer1", "true");
  storage.setItem("bookingTourSeen_buyer1", "true");
  clearStoragePreservingTours(storage);
  assert.deepEqual(Object.keys(storage).sort(), ["bookingTourSeen_buyer1", "tourSeen_buyer1"]);
  assert.equal(claimFirstTourVisit(storage, "tourSeen_buyer1"), false);
  assert.equal(claimFirstTourVisit(storage, "bookingTourSeen_buyer1"), false);
});

test("tour history is separate for different accounts and pages", () => {
  const storage = createStorage();
  storage.setItem("tourSeen_buyer1", "true");
  assert.equal(claimFirstTourVisit(storage, "tourSeen_buyer1"), false);
  assert.equal(claimFirstTourVisit(storage, "tourSeen_buyer2"), true);
  assert.equal(claimFirstTourVisit(storage, "bookingTourSeen_buyer1"), true);
});
