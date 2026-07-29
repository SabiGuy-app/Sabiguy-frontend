import {
  AlertTriangle,
  ArrowRight,
  Car,
  Check,
  CircleAlert,
  ClipboardList,
  FileText,
  Layers,
  LayoutDashboard,
  Map as LucideMap,
  Route,
  Settings,
  Star,
  Triangle,
  Users,
  WalletCards,
  X,
} from "lucide-react";

export const FleetOverviewIcon = LayoutDashboard;
export const FleetLiveMapIcon = LucideMap;
export const FleetDriversIcon = Users;
export const FleetVehiclesIcon = Car;
export const FleetTripsIcon = Route;
export const FleetGroupsIcon = Layers;
export const FleetPoliciesIcon = ClipboardList;
export const FleetEarningsIcon = WalletCards;
export const FleetPerformanceIcon = Star;
export const FleetDocumentsIcon = FileText;
export const FleetSettingsIcon = Settings;

export const FleetArrowRightIcon = ArrowRight;
export const FleetSuccessIcon = Check;
export const FleetCancelIcon = X;
export const FleetErrorIcon = CircleAlert;
export const FleetWarningIcon = AlertTriangle;

export function FleetTrendArrowIcon({ size = 16, className = "", direction = "up", ...props }) {
  const rotationClass = direction === "down" ? "rotate-180" : "";

  return (
    <Triangle
      aria-hidden="true"
      size={size}
      className={[rotationClass, className].filter(Boolean).join(" ")}
      fill="currentColor"
      strokeWidth={0}
      {...props}
    />
  );
}
