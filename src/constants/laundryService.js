export const LAUNDRY_SERVICE_OPTIONS = [
  { id: "wash-iron-fold", name: "Wash, Iron & Fold" },
  { id: "ironing", name: "Ironing" },
  { id: "suit-dry-cleaning", name: "Suit Dry Cleaning" },
  { id: "native-wear-cleaning", name: "Native Wear Cleaning" },
  { id: "curtains-dry-cleaning", name: "Curtains Dry Cleaning" },
  { id: "stains-removal", name: "Stain Removal" },
  { id: "fabric-restoration", name: "Fabric Restoration" },
  { id: "garment-repair", name: "Garment Repair" },
  { id: "hand-washing", name: "Hand Washing" },
  
];

export const LAUNDRY_SERVICE_NAMES = LAUNDRY_SERVICE_OPTIONS.map(
  (service) => service.name,
);

export const LAUNDRY_PROVIDER_SEARCH_NAMES = [
  ...LAUNDRY_SERVICE_NAMES,
  "Dry cleaner",
  "Dry cleaning"
];
