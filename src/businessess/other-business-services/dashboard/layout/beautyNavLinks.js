import {
  BookOpen, ClipboardList, FileText, LayoutGrid, Map, MoneyBag,
  Settings, Shapes, Star, UsersRound,
} from "../icons";

export const beautyDashboardPath = "/other-business-services/dashboard";

export const beautyNavGroups = [
  {
    section: "Overview",
    items: [
      { name: "Overview", path: "", icon: LayoutGrid },
      { name: "Live Map", path: "live-map", icon: Map },
    ],
  },
  {
    section: "Fleet management",
    items: [
      { name: "Bookings", path: "bookings", icon: BookOpen },
      { name: "Staff", path: "staff", icon: UsersRound },
      { name: "Groups", path: "groups", icon: Shapes },
      { name: "Policies", path: "policies", icon: ClipboardList },
    ],
  },
  {
    section: "Fleet management",
    items: [
      { name: "Earnings & Payouts", path: "earnings", icon: MoneyBag },
      { name: "Performance & Ratings", path: "performance", icon: Star },
      { name: "Documents", path: "documents", icon: FileText },
    ],
  },
  {
    section: "Fleet management",
    items: [{ name: "Settings", path: "settings", icon: Settings }],
  },
];
