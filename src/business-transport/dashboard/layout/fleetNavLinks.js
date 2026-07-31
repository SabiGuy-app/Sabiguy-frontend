import {
  FleetDocumentsIcon,
  FleetDriversIcon,
  FleetEarningsIcon,
  FleetGroupsIcon,
  FleetLiveMapIcon,
  FleetOverviewIcon,
  FleetPerformanceIcon,
  FleetPoliciesIcon,
  FleetSettingsIcon,
  FleetTripsIcon,
  FleetVehiclesIcon,
} from "./icons";

const BASE = "/business-provider/dashboard";

// Mirrors the reference frame's grouping, including the repeated
// "FLEET MANAGEMENT" header across three visually distinct groups —
// confirmed against the live Figma frame (node 149:571).
export const fleetNavGroups = [
  {
    section: "OVERVIEW",
    items: [
      { name: "Fleet Overview", path: BASE, icon: FleetOverviewIcon },
      { name: "Live Map", path: `${BASE}/live-map`, icon: FleetLiveMapIcon },
    ],
  },
  {
    section: "FLEET MANAGEMENT",
    items: [
      { name: "Drivers", path: `${BASE}/drivers`, icon: FleetDriversIcon },
      { name: "Vehicles", path: `${BASE}/vehicles`, icon: FleetVehiclesIcon },
      { name: "Trips", path: `${BASE}/trips`, icon: FleetTripsIcon },
      { name: "Groups", path: `${BASE}/groups`, icon: FleetGroupsIcon },
      { name: "Policies", path: `${BASE}/policies`, icon: FleetPoliciesIcon },
    ],
  },
  {
    section: "FLEET MANAGEMENT",
    items: [
      {
        name: "Earnings & Payouts",
        path: `${BASE}/earnings`,
        icon: FleetEarningsIcon,
      },
      {
        name: "Performance & Ratings",
        path: `${BASE}/performance`,
        icon: FleetPerformanceIcon,
      },
      {
        name: "Documents",
        path: `${BASE}/documents`,
        icon: FleetDocumentsIcon,
      },
    ],
  },
  {
    section: "FLEET MANAGEMENT",
    items: [
      { name: "Settings", path: `${BASE}/settings`, icon: FleetSettingsIcon },
    ],
  },
];

export default fleetNavGroups;
