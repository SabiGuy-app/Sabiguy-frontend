
export const mockBusiness = {
  name: "Adewale Fleet Services",
  mode: "live simulation",
  policyNote: "policies enforced in real time",
};

export const mockWallet = {
  balance: 16500,
  owedToDrivers: 14440,
};

export const mockAlert = {
  message: "Demand rising in UI Gate — 0 drivers available to reposition.",
  actionLabel: "View map",
  actionPath: "/business-provider/dashboard/live-map",
};

export const mockStats = [
  {
    id: "utilization",
    label: "Fleet Utilization",
    value: "88%",
    trendLabel: "healthy",
    trendDirection: "up",
    trendTone: "green",
  },
  {
    id: "availability",
    label: "Availability",
    value: "60%",
    trendLabel: "1 off-road",
    trendDirection: "down",
    trendTone: "amber",
  },
  {
    id: "cancellation",
    label: "Cancellation Rate",
    value: "0%",
    trendLabel: "within 10% target",
    trendDirection: "up",
    trendTone: "green",
  },
  {
    id: "revPerVehicle",
    label: "Rev/Vehicle Today",
    value: "₦4,133",
    trendLabel: "18 trips",
    trendDirection: "up",
    trendTone: "green",
  },
  {
    id: "docCompliance",
    label: "Doc Compliance",
    value: "57%",
    trendLabel: "action needed",
    trendDirection: "down",
    trendTone: "red",
  },
];

export const mockEarnings7Day = [
  { label: "Thu, 2 Jul", value: 38000 },
  { label: "Fri, 3 Jul", value: 44000 },
  { label: "Sat, 4 Jul", value: 36000 },
  { label: "Sun, 5 Jul", value: 41000 },
  { label: "Mon, 6 Jul", value: 32000 },
  { label: "Tue, 7 Jul", value: 33000 },
  { label: "Wed, 8 Jul", value: 55100, isToday: true },
];

export const mockEarningsSummary = {
  avgPerDay: 43404,
  total: 303829,
};

export const mockFleetSnapshot = {
  available: 8,
  onTrip: 0,
  offline: 3,
  suspended: 0,
  offRoad: 2,
  todayEarnings: 32142,
  completed: 40,
  cancelled: 16,
  owed: 14449,
  liveMapPath: "/business-provider/dashboard/live-map",
};

export const mockActivities = [
  {
    id: "act-1",
    type: "info",
    message: "Demand rising in Ojoo",
    time: "15:24",
  },
  {
    id: "act-2",
    type: "completed",
    message: "Tunde completed a trip · Ojoo → Agodi — ₦960 · ★4.8",
    time: "15:24",
  },
  {
    id: "act-3",
    type: "cancelled",
    message: "Samson's trip Ring Road → Dugbe cancelled (driver)",
    time: "11:24",
  },
  {
    id: "act-4",
    type: "policy",
    message: "POLICY: Tunde Adeyemi SUSPENDED — 5 cancellations today",
    time: "11:54",
  },
  {
    id: "act-5",
    type: "warning",
    message: "Low rating 2.3★ for Emeka — UI Gate → Bodija",
    time: "15:24",
  },
];

export const mockFleetOverview = {
  business: mockBusiness,
  wallet: mockWallet,
  alert: mockAlert,
  stats: mockStats,
  earnings7Day: mockEarnings7Day,
  earningsSummary: mockEarningsSummary,
  fleetSnapshot: mockFleetSnapshot,
  activities: mockActivities,
};

export default mockFleetOverview;
