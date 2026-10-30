import { useMemo } from "react";
import { useServiceCategories } from "../../../stores/serviceCategories.store";

// Dashboard-only presentation for the shared service categories.
const CATEGORY_DISPLAY = {
  transport: {
    image: "/categories/transport.png",
    imageIncludesTitle: true,
    tasks: ["Book a Ride", "Package Delivery"],
  },
  beauty: {
    description: "Beauty, grooming, and personal care services tailored to your needs.",
    image: "/categories/beauty.png",
    imageIncludesTitle: true,
  },
  automotive: { image: "/Towing.jpg" },
  "home-repair": { image: "/hand-tools.png" },
};

const FEATURED_TASK_COUNT = 3;

export const buildExploreCategories = (categories) =>
  [
    ...categories.filter((category) => category.id === "transport"),
    ...categories.filter((category) => category.id !== "transport"),
  ].map((category) => {
    const display = CATEGORY_DISPLAY[category.id] || {};
    const serviceNames = (category.services || []).map((service) => service.name);
    const slug = category.slug || category.id;
    return {
      ...category,
      ...display,
      title: category.label,
      slug,
      serviceNames,
      tasks: display.tasks || serviceNames.slice(0, FEATURED_TASK_COUNT),
      ...(category.services && { to: `/dashboard/categories/${slug}` }),
    };
  });

// Categories come from /categories; loading/error let pages hold off on
// "not found" states until the list has arrived.
export function useExploreCategories() {
  const { categories, loading, error, retry } = useServiceCategories();
  const exploreCategories = useMemo(() => buildExploreCategories(categories), [categories]);
  return { exploreCategories, loading, error, retry };
}

export const getExploreCategoryBySlug = (exploreCategories, slug) =>
  exploreCategories.find((category) => category.to && category.slug === slug);

const normalizeCategoryValue = (value) =>
  String(value || "").trim().toLowerCase().replace(/[\s_-]+/g, " ");

// Search results span categories, so read each provider's from its job service.
export const getCategoryForProvider = (exploreCategories, provider, fallback = null) => {
  const jobServices = (Array.isArray(provider?.job) ? provider.job : [])
    .map((job) => normalizeCategoryValue(job?.service))
    .filter(Boolean);
  return (
    exploreCategories.find(
      (category) =>
        category.to &&
        [category.id, category.slug, category.backendId, category.label]
          .filter(Boolean)
          .some((value) => jobServices.includes(normalizeCategoryValue(value))),
    ) || fallback
  );
};

export const getProviderProfilePath = (category, providerId) =>
  category?.id === "beauty" || !category?.slug
    ? `/dashboard/beauty/${providerId}`
    : `/dashboard/categories/${category.slug}/providers/${providerId}`;

export function getCategoryDestination(category, task) {
  if (!category) return null;
  if (category.id === "transport")
    return `/bookings?service=${encodeURIComponent(task === "Package Delivery" ? "package delivery" : "book a ride")}`;
  if (!category.to) return null;
  return task ? `${category.to}?service=${encodeURIComponent(task)}` : category.to;
}
