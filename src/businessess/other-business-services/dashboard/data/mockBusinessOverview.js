import tundeAvatar from "../../../../assets/tunde.png";

// One booking, staff member, and activity. The seven chart points describe one week.
export const mockBusinessOverview = {
  business: { name: "Sharp Edge" },
  wallet: { balance: 16500, owedToStaff: 14440 },
  stats: [
    { label: "Earned today", value: 75000, currency: true, note: "+10% vs yesterday", trend: true },
    { label: "Bookings today", value: 36, note: "30 completed · 6 scheduled" },
    { label: "Active bookings", value: 7, note: "3 waiting on you" },
    { label: "Active staff", value: 3, note: "1 on the road · 2 on site" },
    { label: "Rating", value: 4.8, note: "779 reviews" },
  ],
  booking: {
    id: "business-booking-1",
    status: "pending",
    responseWindowSeconds: 180,
    assignedStaff: null,
    serviceLocation: "customer_address",
    service: "Face + Beard Trim",
    location: "Customer’s Address",
    customer: "Daniel Okon",
    date: "Oct 18, 2025",
    time: "10 AM",
    address: "Ajah, 10.0 km from shop",
    amount: 10000,
    requestedStaff: "Chidi Okafor",
  },
  staff: {
    id: "business-staff-1",
    name: "Tunde Adeyemi",
    avatar: tundeAvatar,
    service: "Haircut + Beard Trim",
    customer: "Daniel Okon",
    status: "available",
    skills: ["Haircut", "Fade", "Beard trim"],
  },
  earnings: {
    total: 1023500,
    days: [
      { label: "Thu, 2 Jul", date: "Thursday, 2 July", amount: 42000 },
      { label: "Fri, 3 Jul", date: "Friday, 3 July", amount: 55000 },
      { label: "Sat, 4 Jul", date: "Saturday, 4 July", amount: 45000 },
      { label: "Sun, 5 Jul", date: "Sunday, 5 July", amount: 61000 },
      { label: "Mon, 6 Jul", date: "Monday, 6 July", amount: 44000 },
      { label: "Tue, 7 Jul", date: "Tuesday, 7 July", amount: 45000 },
      { label: "Wed, 8 Jul", date: "Wednesday, 8 July", amount: 55100 },
    ],
  },
  activity: {
    id: "business-activity-1",
    type: "service_completed",
    staffName: "Chidi",
    service: "haircut + beard trim",
    customer: "Tolu Adebayo",
    amount: 12000,
    occurredAt: "2026-10-01T14:24:00.000Z",
  },
};
