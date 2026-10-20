export const DOMESTIC_SERVICE_OPTIONS = [
  { id: "house-keepers", name: "House Keepers" },
  { id: "home-cooks", name: "Home Cooks" },
  { id: "nannies", name: "Nannies" },
  { id: "baby-sitters", name: "Baby Sitters." },
  { id: "elderly-caregivers", name: "Elderly Caregivers" },
  { id: "live-in-domestic-staff", name: "Live-in Domestic Staff" },
  { id: "drivers", name: "Drivers" },
  { id: "gardeners", name: "Gardeners" },
  { id: "house-managers", name: "House Managers" },


  
];

export const DOMESTIC_SERVICE_NAMES = DOMESTIC_SERVICE_OPTIONS.map(
  (service) => service.name,
);

export const DOMESTIC_PROVIDER_SEARCH_NAMES = [
  ...DOMESTIC_SERVICE_NAMES,
  "house help",
];
