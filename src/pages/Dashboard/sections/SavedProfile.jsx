import DashboardLayout from "../../../components/layouts/DashboardLayout";
import ProviderCard from "../../../components/dashboard/ProviderCard";


export default function SavedProfile () {
    const providers = [
  {
    image: "/provider.jpg",
    name: "John Doe",
    skill: "Plumber",
    rating: "4.7",
    reviews: "102",
    price: "5,000",
    location: "Ikeja, Lagos",
  },
]


return (
    <DashboardLayout>
        <div className="flex flex-col  md:flex-row md:items-center md:justify-between mb-6">

            <h1 className="font-bold text-2xl">Saved Profile</h1>
            </div>
            <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {providers.map((pro, idx) => (
                        <ProviderCard key={idx} {...pro} />
                      ))}
                    </div>
                    </div>





    </DashboardLayout>
)
}