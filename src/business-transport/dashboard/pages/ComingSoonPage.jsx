import { Clock } from "lucide-react";
import FleetDashboardLayout from "../layout/FleetDashboardLayout";

export default function ComingSoonPage({ title = "This section" }) {
  return (
    <FleetDashboardLayout>
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <div className="mb-4 rounded-full bg-green-50 p-4">
          <Clock className="h-10 w-10 text-[#005823]" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        <div className="mt-3 w-fit rounded-full bg-[#F6821F1A] px-3 py-1 text-xs font-medium text-[#F6821F]">
          Coming Soon
        </div>
        <p className="mt-4 max-w-sm text-sm text-gray-500">
          {title} is being built out. Check back soon for updates.
        </p>
      </div>
    </FleetDashboardLayout>
  );
}
