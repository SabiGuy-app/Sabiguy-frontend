import {
  DashboardGridIcon,
  MapIcon,
  DriversIcon,
  VehicleIcon,
  TripsIcon,
  GroupsIcon,
  PoliciesIcon,
  WalletIcon,
  StarOutlineIcon,
  DocumentIcon,
  SettingsGearIcon,
} from "../icons/FleetIcons";

const BASE = "/business-provider/dashboard";

// Mirrors the reference frame's grouping, including the repeated
// "FLEET MANAGEMENT" header across three visually distinct groups —
// confirmed against the live Figma frame (node 149:571).
export const fleetNavGroups = [
  {
    section: "OVERVIEW",
    items: [
      { name: "Fleet Overview", path: BASE, icon: DashboardGridIcon },
      { name: "Live Map", path: `${BASE}/live-map`, icon: MapIcon },
    ],
  },
  {
    section: "FLEET MANAGEMENT",
    items: [
      { name: "Drivers", path: `${BASE}/drivers`, icon: DriversIcon },
      { name: "Vehicles", path: `${BASE}/vehicles`, icon: VehicleIcon },
      { name: "Trips", path: `${BASE}/trips`, icon: TripsIcon },
      { name: "Groups", path: `${BASE}/groups`, icon: GroupsIcon },
      { name: "Policies", path: `${BASE}/policies`, icon: PoliciesIcon },
    ],
  },
  {
    section: "FLEET MANAGEMENT",
    items: [
      { name: "Earnings & Payouts", path: `${BASE}/earnings`, icon: WalletIcon },
      { name: "Performance & Ratings", path: `${BASE}/performance`, icon: StarOutlineIcon },
      { name: "Documents", path: `${BASE}/documents`, icon: DocumentIcon },
    ],
  },
  {
    section: "FLEET MANAGEMENT",
    items: [{ name: "Settings", path: `${BASE}/settings`, icon: SettingsGearIcon }],
  },
];

export default fleetNavGroups;
