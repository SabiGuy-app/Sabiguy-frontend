import test from "node:test";
import assert from "node:assert/strict";
import { getCategoryForProvider } from "./categoryMatcher.js";

const categories = [
  {
    id: "events",
    slug: "events",
    label: "Events",
    to: "/dashboard/categories/events",
    services: [{ name: "Event photography" }],
  },
  {
    id: "photography-videography",
    slug: "photography-videography",
    label: "Photography & Videography",
    to: "/dashboard/categories/photography-videography",
    services: [{ name: "Photography" }, { name: "Wedding Photography" }],
  },
];

test("provider service names do not match a category by partial text", () => {
  const category = getCategoryForProvider(categories, {
    service: [{ serviceName: "Photography" }],
  });

  assert.equal(category?.slug, "photography-videography");
});

test("explicit provider category takes precedence over service-name matching", () => {
  const category = getCategoryForProvider(categories, {
    categorySlug: "photography-videography",
    service: [{ serviceName: "Event photography" }],
  });

  assert.equal(category?.slug, "photography-videography");
});
