export const BEAUTY_SERVICE_OPTIONS = [
  { id: "barbing", name: "Barbing" },
  { id: "hair-dresser", name: "Hair Dresser" },
  { id: "spa", name: "Spa" },
  { id: "lash-tech", name: "Lash Tech." },
  { id: "pedicure", name: "Pedicure" },
  { id: "nails-tech", name: "Nails Tech." },
];

export const BEAUTY_SERVICE_NAMES = BEAUTY_SERVICE_OPTIONS.map(
  (service) => service.name,
);

export const BEAUTY_PROVIDER_SEARCH_NAMES = [
  ...BEAUTY_SERVICE_NAMES,
  "Braiding",
];
