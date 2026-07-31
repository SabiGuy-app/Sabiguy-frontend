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
  ArrowLeft,
  CloudUpload,
  Plus,
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

export const ArrowLeftIcon = ArrowLeft;
export const AddIcon = Plus;
export const CloudUploadIcon = CloudUpload;
export function TriangleAlertIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path
        d="M10.2285 2.96794C10.1064 2.74963 9.92832 2.56784 9.71258 2.4413C9.49683 2.31476 9.25124 2.24805 9.00112 2.24805C8.751 2.24805 8.50541 2.31476 8.28966 2.4413C8.07391 2.56784 7.89582 2.74963 7.77374 2.96794L2.42662 12.5327C2.30701 12.7466 2.24539 12.9881 2.24788 13.2332C2.25036 13.4783 2.31686 13.7185 2.44079 13.9299C2.56471 14.1414 2.74175 14.3168 2.95436 14.4388C3.16697 14.5607 3.40776 14.625 3.65287 14.6252H14.3449C14.5901 14.6252 14.831 14.5611 15.0438 14.4392C15.2565 14.3173 15.4337 14.1419 15.5578 13.9304C15.6818 13.7189 15.7484 13.4787 15.751 13.2335C15.7535 12.9883 15.6919 12.7467 15.5722 12.5327L10.2285 2.96794Z"
        fill="#FFCD0F"
      />

      <path
        d="M9.84375 11.5312C9.84375 11.755 9.75485 11.9696 9.59662 12.1279C9.43839 12.2861 9.22378 12.375 9 12.375C8.77622 12.375 8.56161 12.2861 8.40338 12.1279C8.24514 11.9696 8.15625 11.755 8.15625 11.5312C8.15625 11.3075 8.24514 11.0929 8.40338 10.9346C8.56161 10.7764 8.77622 10.6875 9 10.6875C9.22378 10.6875 9.43839 10.7764 9.59662 10.9346C9.75485 11.0929 9.84375 11.3075 9.84375 11.5312ZM8.4375 9V6.1875C8.4375 6.03832 8.49676 5.89524 8.60225 5.78975C8.70774 5.68426 8.85082 5.625 9 5.625C9.14918 5.625 9.29226 5.68426 9.39775 5.78975C9.50324 5.89524 9.5625 5.625 9.5625 6.1875V9C9.5625 9.14918 9.50324 9.29226 9.39775 9.39775C9.29226 9.50324 9.14918 9.5625 9 9.5625C8.85082 9.5625 8.70774 9.50324 8.60225 9.39775C8.49676 9.29226 8.4375 9.14918 8.4375 9Z"
        fill="#212121"
      />
    </svg>
  );
}

export function FleetTrendArrowIcon({
  size = 16,
  className = "",
  direction = "up",
  ...props
}) {
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
