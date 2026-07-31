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
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8"
      viewBox="0 0 24 24"
    >
      <g fill="none">
        <path
          fill="url(#SVGskxbwd9h)"
          d="M10.03 3.659c.856-1.548 3.081-1.548 3.937 0l7.746 14.001c.83 1.5-.255 3.34-1.969 3.34H4.254c-1.715 0-2.8-1.84-1.97-3.34z"
        ></path>
        <path
          fill="url(#SVGYnStacUU)"
          d="M12.997 17A.999.999 0 1 0 11 17a.999.999 0 0 0 1.997 0m-.259-7.852a.75.75 0 0 0-1.493.103l.004 4.501l.007.102a.75.75 0 0 0 1.493-.103l-.004-4.502z"
        ></path>
        <defs>
          <linearGradient
            id="SVGskxbwd9h"
            x1={5.125}
            x2={16.719}
            y1={-0.393}
            y2={23.477}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#ffcd0f"></stop>
            <stop offset={1} stopColor="#fe8401"></stop>
          </linearGradient>
          <linearGradient
            id="SVGYnStacUU"
            x1={9.336}
            x2={13.752}
            y1={8.5}
            y2={18.405}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#4a4a4a"></stop>
            <stop offset={1} stopColor="#212121"></stop>
          </linearGradient>
        </defs>
      </g>
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
