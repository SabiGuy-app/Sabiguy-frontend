import { FleetArrowLeftIcon } from "../layout/icons";
import FleetDashboardLayout from "../layout/FleetDashboardLayout";
import AddVehicle from "../../components/AddVehicle";

const FleetVehicle = ({ title }) => {
  return (
    <FleetDashboardLayout>
      <div className="w-full h-full flex gap-10 max-lg:gap-5">
        <button className="flex justify-center mt-6">
          <FleetArrowLeftIcon /> Back
        </button>

        <div className="mt-5 w-full flex justify-center items-center">
          <AddVehicle title={title} />
        </div>
      </div>
    </FleetDashboardLayout>
  );
};

export default FleetVehicle;
