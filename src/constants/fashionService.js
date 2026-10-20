export const FASHION_SERVICE_OPTIONS = [
  { id: "fashion-designer", name: "Fashion Designer" },
  { id: "tailor", name: "Tailor" },
  { id: "bespoke-tailoring", name: "Bespoke Tailoring" },
  { id: "bridal-wear", name: "Bridal Wear Designers." },
  { id: "native-wear", name: "Native Wear Specialists" },
  { id: "clothing-alteration", name: "Clothing Alteration" },
  { id: "embroidery", name: "Embroidery Services" },
  { id: "personal-stylist", name: "Personal Stylist" },
  { id: "fashion-stylist", name: "Fashion Stylist" },

  
];

export const FASHION_SERVICE_NAMES = FASHION_SERVICE_OPTIONS.map(
  (service) => service.name,
);

export const FASHION_PROVIDER_SEARCH_NAMES = [
  ...FASHION_SERVICE_NAMES,
  "Tailor",
];
