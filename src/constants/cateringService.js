export const CATERING_SERVICE_OPTIONS = [
  { id: "chef", name: "Chef" },
  { id: "baking", name: "Baking" },
  { id: "catering", name: "Catering" }, 
];

export const CATERING_SERVICE_NAMES = CATERING_SERVICE_OPTIONS.map(
  (service) => service.name,
);

export const CATERING_PROVIDER_SEARCH_NAMES = [
  ...CATERING_SERVICE_NAMES,
  "Caterer",
];
