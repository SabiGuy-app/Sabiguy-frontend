import test from "node:test";
import assert from "node:assert/strict";
import { getDistanceFromLocation, isWithinRadius } from "./providerDistance.js";

const buyer = { latitude: 6.436418, longitude: 3.487742 };

test("nearby GeoJSON coordinates are measured in longitude-latitude order", () => {
  const provider = { currentLocation: { coordinates: [3.487733, 6.436026] } };
  const distance = getDistanceFromLocation(provider, buyer);
  assert.ok(distance > 0 && distance < 0.1);
  assert.equal(isWithinRadius({ distanceFromPickup: distance }, 10), true);
});

test("faraway and unlocated providers are not treated as nearby", () => {
  const faraway = { currentLocation: { coordinates: [3.91, 7.38] } };
  const distance = getDistanceFromLocation(faraway, buyer);
  assert.ok(distance > 10);
  assert.equal(isWithinRadius({ distanceFromPickup: distance }, 10), false);
  assert.equal(getDistanceFromLocation({}, buyer), null);
  assert.equal(isWithinRadius({ distanceFromPickup: null }, 10), false);
});
