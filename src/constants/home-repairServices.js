export const HOME_REPAIR_SERVICE_OPTIONS = [
  { id: "electrician", name: "Electrician" },
  { id: "plumber", name: "Plumber" },
  { id: "carpenter", name: "Carpenter" },
  { id: "welder", name: "Welder" },
  { id: "painter", name: "Painter" },
  { id: "pop-installation", name: "POP Installation" },
  { id: "tiler", name: "Tiler" },
  { id: "mason", name: "Mason" },
  { id: "roofer", name: "Roofer" },
  { id: "handyman", name: "Handyman" },
  { id: "furniture-repair", name: "Furniture Repair" },
  { id: "ac-installation", name: "AC Installation" },
  { id: "ac-repair", name: "AC Repair" },
  { id: "refrigerator-repair", name: "Refrigerator Repair" },
  { id: "washing-machine-repair", name: "Washing Machine Repair" },
  { id: "generator-repair", name: "Generator Repair" },
  { id: "tv-repair", name: "TV Repair" },
  { id: "microwave-repair", name: "Microwave Repair" },
  { id: "water-heater-repair", name: "Water Heater Repair" },
  { id: "curtain-installation", name: "Curtain Installation" },
  { id: "blinds-installation", name: "Blinds Installation" },
  { id: "tv-mounting", name: "TV Mounting" },
  { id: "furniture-assembly", name: "Furniture Assembly" },
  { id: "kitchen-cabinet-installation", name: "Kitchen Cabinet Installation" },
];

export const HOME_REPAIR_SERVICE_NAMES = HOME_REPAIR_SERVICE_OPTIONS.map(
  (service) => service.name,
);

export const HOME_REPAIR_PROVIDER_SEARCH_NAMES = [
  ...HOME_REPAIR_SERVICE_NAMES,
  "Handyman",
];
