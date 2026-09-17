// import {
//   FleetDocumentsIcon,
//   FleetDriversIcon,
//   FleetEarningsIcon,
//   FleetGroupsIcon,
//   FleetLiveMapIcon,
//   FleetOverviewIcon,
//   FleetPerformanceIcon,
//   FleetPoliciesIcon,
//   FleetSettingsIcon,
//   FleetTripsIcon,
//   FleetVehiclesIcon,
// } from "../icons";

const BASE = "/beauty/dashboard";

// Mirrors the reference frame's grouping, including the repeated
// "FLEET MANAGEMENT" header across three visually distinct groups —
// confirmed against the live Figma frame (node 149:571).
export const BeautyNavGroups = [
  {
    section: "OVERVIEW",
    items: [
      { name: "Fleet Overview", path: BASE, },
      { name: "Live Map", path: `${BASE}/live-map`, },
    ],
  },
  {
    section: "FLEET MANAGEMENT",
    items: [
      { name: "Drivers", path: `${BASE}/drivers`, },
      { name: "Vehicles", path: `${BASE}/vehicles`, },
      { name: "Trips", path: `${BASE}/trips`, },
      { name: "Groups", path: `${BASE}/groups`, },
      { name: "Policies", path: `${BASE}/policies`,  },
    ],
  },
  {
    section: "FLEET MANAGEMENT",
    items: [
      { name: "Earnings & Payouts", path: `${BASE}/earnings`, },
      { name: "Performance & Ratings", path: `${BASE}/performance`, },
      { name: "Documents", path: `${BASE}/documents`, },
    ],
  },
  {
    section: "FLEET MANAGEMENT",
    items: [{ name: "Settings", path: `${BASE}/settings`, }],
  },
];

export default BeautyNavGroups;
