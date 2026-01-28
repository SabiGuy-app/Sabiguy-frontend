import BookingSummaryScreen from "../../../../components/dashboard/BookingSummary";
import Navbar from "../../../../components/dashboard/Navbar";

export default function BookingSummary() {

const bookingData = {
    service: "Electrical Installation",
    provider: {
      name: "Phil Crook",
      avatar: 'https://i.pravatar.cc/80'
    },
    status: "Pending Confirmation",
    startDate: "Oct 18, 2025 - 10 AM",
    endDate: "Oct 20, 2025 - 10 AM",
    location: "24 Main Avenue, Lagos",
    serviceCost: 50000,
    serviceCharge: 1000,
    totalAmount: 51000,
    walletBalance: 40000
  };

  return(
    <>
    <Navbar/>

    <div className="">
        <BookingSummaryScreen
        bookingData={bookingData}

        
        />
    </div>
    
    </>
  )
}
