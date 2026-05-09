import React from "react";
import OfferCard from "../../../../components/dashboard/OfferCard";
import Navbar from "../../../../components/dashboard/Navbar";
import DashboardLayout from "../../../../components/layouts/DashboardLayout";

export default function AvailableProviders () {

const mockProvider = {
    name: "Phil Crook",
    avatar: null,
    coverImage: "https://images.unsplash.com/photo-1621905251918-48416bd8c9d7",
    rating: 4.3,
    reviewCount: 120,
    distance: 2.3,
    location: "Lagos, Nigeria",
    services: ["Plumbing", "Pipe repair"],
    profession: "Electrician",
    description: "Trusted electrician for home and office wiring, maintenance, and lighting.",
    startingPrice: 50000,
    isAvailable: true,
  };

  return (
    <DashboardLayout>
    <div className="py-4 bg-gray-50 min-h-screen">
              <h1 className="text-2xl font-bold mb-3">Available Providers</h1>

              <h3 className="text-lg mb-2">2 Providers are available</h3>


 <div className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
          <OfferCard
            provider={mockProvider}
            offerType="your"
            offerAmount={40000}
            onViewProfile={() => console.log("View profile")}
            onAccept={() => console.log("Accept offer")}
          />
          <OfferCard
            provider={mockProvider}
            offerType="counter"
            offerAmount={50000}
            onViewProfile={() => console.log("View profile")}
            onAccept={() => console.log("Accept offer")}
            isSelected={true}
          />
        </div>
      </div>

    </div>
    </DashboardLayout>
  )

}
