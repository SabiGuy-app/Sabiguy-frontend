const normalizeCategoryValue = (value) =>
  String(value || "").trim().toLowerCase().replace(/[\s_-]+/g, " ");

// Search results span categories, so resolve them from explicit category fields
// first, then exact service names from the shared category catalog.
export const getCategoryForProvider = (exploreCategories, provider, fallback = null) => {
  const categories = exploreCategories.filter((category) => category.to);
  const categoryAliases = (category) =>
    [category.id, category.slug, category.backendId, category.label]
      .filter(Boolean)
      .map(normalizeCategoryValue);

  const explicitCategories = [
    provider?.category,
    provider?.categoryId,
    provider?.categorySlug,
    provider?.businessCategory,
    ...(Array.isArray(provider?.job)
      ? provider.job.flatMap((job) => [job?.category, job?.categoryId])
      : []),
  ]
    .map(normalizeCategoryValue)
    .filter(Boolean);
  const explicitMatches = categories.filter((category) =>
    explicitCategories.some((value) => categoryAliases(category).includes(value)),
  );
  if (explicitMatches.length === 1) return explicitMatches[0];

  const providerServices = [
    ...(Array.isArray(provider?.job) ? provider.job.map((job) => job?.service) : []),
    ...(Array.isArray(provider?.service)
      ? provider.service.map((service) => service?.serviceName || service?.name)
      : []),
    ...(Array.isArray(provider?.services)
      ? provider.services.map((service) => service?.serviceName || service?.name)
      : []),
  ]
    .map(normalizeCategoryValue)
    .filter(Boolean);
  const serviceMatches = categories.filter((category) => {
    const categoryServices = Array.isArray(category.services)
      ? category.services
          .map((service) => normalizeCategoryValue(service?.name))
          .filter(Boolean)
      : [];
    return providerServices.some(
      (providerService) =>
        categoryAliases(category).includes(providerService) ||
        categoryServices.includes(providerService),
    );
  });
  return serviceMatches.length === 1 ? serviceMatches[0] : fallback;
};
