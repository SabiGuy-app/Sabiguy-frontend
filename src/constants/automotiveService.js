export const AUTOMOTIVE_SERVICE_OPTIONS = [
  { id: "auto-mechanic", name: "Auto Mechanic" },
  { id: "auto-electrician", name: "Auto Electrician" },
  { id: "auto-diagnostics", name: "Auto Diagnostics" },
  { id: "car-wash", name: "Car Wash" },
  { id: "towing", name: "Towing" },
  { id: "jump-start", name: "Jump Start." },
  { id: "vulcanizer", name: "Vulcanizer" },
  { id: "rewire", name: "Rewire" },
  { id: "battery-replacement", name: "Battery Replacement" }, 
];

export const AUTOMOTIVE_SERVICE_NAMES = AUTOMOTIVE_SERVICE_OPTIONS.map(
  (service) => service.name,
);

export const AUTOMOTIVE_PROVIDER_SEARCH_NAMES = [
  ...AUTOMOTIVE_SERVICE_NAMES,
  "Mechanic",
];
