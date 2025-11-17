import DashboardLayout from "../../../components/layouts/DashboardLayout";
import InputField from "../../../components/InputField";
import Button from "../../../components/button";

export default function Bookings() {
    return (
        <DashboardLayout>

<div className="bg-g">
    <div className="font-bold text-2xl m-4">
        My Bookings
    </div>
    <div className="bg-white mt-5 ">
    <InputField
    label="name"
    placeholder="name"
    size="medium"
    />

     <InputField
    label="name"
    placeholder="name"
    />
    </div>
</div>

        </DashboardLayout>

    )
}