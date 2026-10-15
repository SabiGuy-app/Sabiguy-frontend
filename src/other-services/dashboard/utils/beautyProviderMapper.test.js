import test from "node:test";
import assert from "node:assert/strict";
import { mergeBeautyServices, normalizeSearchBeautyProvider } from "./beautyProviderMapper.js";

test("detail services retain search prices when the detail response omits them", () => {
  const services = mergeBeautyServices(
    [{ serviceName: "Barbing", duration: "3 hours" }],
    [{ serviceName: "barbing", pricingModel: { walk_in: 10000, customer_address: 30000 } }],
  );
  const provider = normalizeSearchBeautyProvider({ id: "provider-1", service: services });

  assert.equal(provider.price, 10000);
  assert.equal(provider.services[0].pricingModel.walk_in, 10000);
  assert.equal(provider.services[0].pricingModel.customer_address, 30000);
  assert.equal(provider.services[0].duration, "3 hours");
});

test("detail prices win while missing pricing options come from search", () => {
  const [service] = mergeBeautyServices(
    [{ serviceName: "Spa", pricingModel: { walk_in: 12000 } }],
    [{ serviceName: "Spa", pricingModel: { walk_in: 10000, customer_address: 20000 } }],
  );

  assert.deepEqual(service.pricingModel, {
    walk_in: 12000,
    customer_address: 20000,
  });
});

test("beauty provider cards use the business address and real completed jobs", () => {
  const provider = normalizeSearchBeautyProvider({
    _id: "provider-1",
    fullName: "Bukunmi Atiba",
    businessAddress: "6A Odiyan Street, Ikate, Lagos",
    completedJobs: 7,
    yearsOfExperience: 5,
    service: [{ serviceName: "Barbing", fixedPrice: 10000 }],
  });

  assert.equal(provider.city, "6A Odiyan Street, Ikate, Lagos");
  assert.equal(provider.completedJobs, 7);
  assert.equal(provider.yearsOfExperience, 5);
  assert.deepEqual(provider.services.map((service) => service.name), ["Barbing"]);
});

test("work gallery contains only real work-visual pictures", () => {
  const provider = normalizeSearchBeautyProvider({
    id: "provider-2",
    profilePicture: "https://example.com/avatar.jpg",
    studioImages: [{ pictures: ["https://example.com/studio.jpg"] }],
    workVisuals: [{ pictures: ["https://example.com/work.jpg", "string"] }],
  });

  assert.equal(provider.profilePicture, "https://example.com/avatar.jpg");
  assert.deepEqual(provider.gallery, ["https://example.com/work.jpg"]);
});

test("missing profile fields remain unavailable instead of becoming sample data", () => {
  const provider = normalizeSearchBeautyProvider({
    id: "provider-3",
    service: [],
    services: [{ serviceName: "Spa", fixedPrice: 15000 }],
  });

  assert.equal(provider.city, "Business address not provided");
  assert.equal(provider.completedJobs, null);
  assert.equal(provider.about, "");
  assert.deepEqual(provider.gallery, []);
  assert.deepEqual(provider.services.map((service) => service.name), ["Spa"]);
});

test("provider detail placeholders do not become a business address or work photo", () => {
  const provider = normalizeSearchBeautyProvider({
    _id: "provider-4",
    city: "Lagos",
    BusinessName: "BKM",
    completedJobs: 10,
    yearsOfExperience: 5,
    rating: { average: 4.88, count: 9 },
    workVisuals: [{ pictures: ["string"], videos: ["string"] }],
    service: [
      { serviceName: "Barbing" },
      { serviceName: "Hair Dresser" },
      { serviceName: "Spa" },
      { serviceName: "Lash Tech." },
      { serviceName: "Pedicure" },
    ],
  });

  assert.equal(provider.city, "Business address not provided");
  assert.equal(provider.completedJobs, 10);
  assert.equal(provider.rating, 4.88);
  assert.equal(provider.reviews, 9);
  assert.deepEqual(provider.gallery, []);
  assert.equal(provider.services.length, 5);
});
