import { useEffect } from "react";
import { create } from "zustand";
import { getServiceCategories } from "../api/categories";

// Shared by business and individual-provider onboarding and the buyer dashboard.
// Transport keeps its own vehicle/ride flow, so it isn't served by /categories.
const TRANSPORT_CATEGORY = { id: "transport", slug: "transport", label: "Transport & Logistics" };

// App ids and job-service values (backendId) that predate /categories; saved
// provider data and in-app checks still rely on them.
const LEGACY_CATEGORY_IDS = {
  "beauty-personal-care": { id: "beauty", backendId: "beauty_personal_care" },
  "home-repair": { backendId: "home_repair" },
};

const toCategory = ({ slug, name, services = [] }) => ({
  id: slug,
  slug,
  label: name,
  services: services.map(({ id, name: serviceName }) => ({ id, name: serviceName })),
  ...LEGACY_CATEGORY_IDS[slug],
});

let pendingRequest = null;

export const useServiceCategoriesStore = create((set, get) => ({
  categories: [],
  status: "idle",
  fetchCategories: () => {
    if (get().status === "ready") return Promise.resolve();
    if (!pendingRequest) {
      set({ status: "loading" });
      pendingRequest = getServiceCategories()
        .then((data) =>
          set({ categories: [...data.map(toCategory), TRANSPORT_CATEGORY], status: "ready" }),
        )
        .catch(() => set({ status: "error" }))
        .finally(() => {
          pendingRequest = null;
        });
    }
    return pendingRequest;
  },
}));

export function useServiceCategories() {
  const categories = useServiceCategoriesStore((state) => state.categories);
  const status = useServiceCategoriesStore((state) => state.status);
  const fetchCategories = useServiceCategoriesStore((state) => state.fetchCategories);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading: status === "idle" || status === "loading",
    error: status === "error",
    retry: fetchCategories,
  };
}

export const getServiceCategoryBackendId = (category) => category?.backendId || category?.id;

const normalizeLabel = (value) => String(value || "").trim().toLowerCase();

// Businesses store their category label; older labels were longer
// ("Automotive Services"), so match either way round.
export const findServiceCategoryByLabel = (categories, label) => {
  const target = normalizeLabel(label);
  if (!target) return null;
  return (
    categories.find((category) => normalizeLabel(category.label) === target) ||
    categories.find((category) => {
      const name = normalizeLabel(category.label);
      return target.includes(name) || name.includes(target);
    }) ||
    null
  );
};
