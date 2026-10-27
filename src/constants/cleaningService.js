export const CLEANING_SERVICE_OPTIONS = [
  { id: "home-cleaning", name: "Home Cleaning" },
  { id: "office-cleaning", name: "Office Cleaning" },
  { id: "estate-cleaning", name: "Estate Cleaning" },
  { id: "deep-cleaning", name: "Deep Cleaning" },
  { id: "post-construction", name: "Post Construction" },
  { id: "move-out-cleaning", name: "Move-out Cleaning." },
  { id: "move-in-cleaning", name: "Move-in Cleaning" },
  
  
];

export const CLEANING_SERVICE_NAMES = CLEANING_SERVICE_OPTIONS.map(
  (service) => service.name,
);

export const CLEANING_PROVIDER_SEARCH_NAMES = [
  ...CLEANING_SERVICE_NAMES,
  "Home Cleaning",
];
