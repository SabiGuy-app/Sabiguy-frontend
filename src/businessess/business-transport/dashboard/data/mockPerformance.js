export const mockPerformance = {
  targets: [
    { key: "trips", label: "Trips", current: 98, target: 150, display: "98/150", tone: "amber" },
    {
      key: "earnings",
      label: "Earnings",
      current: 77202,
      target: 120000,
      display: "₦77,202 / ₦120,000",
      tone: "amber",
    },
    {
      key: "rating",
      label: "Avg rating",
      current: 4.73,
      target: 4.8,
      display: "4.73 / 4.8 ⭐",
      tone: "green",
    },
  ],
  drivers: [
    {
      id: "driver-002",
      name: "Samuel Cutti",
      completion: 81,
      trips: 48,
      rating: 4.6,
      earnings: 3273,
      suspended: true,
      avatar: "/avatar.png",
    },
    {
      id: "driver-001",
      name: "Tunde Adeyemi",
      completion: 79,
      trips: 48,
      rating: 4.6,
      earnings: 3273,
      avatar: "/avatar.png",
    },
    {
      id: "driver-003",
      name: "Jackson Joe",
      completion: 79,
      trips: 43,
      rating: 4.5,
      earnings: 3010,
      avatar: "/avatar.png",
    },
  ],
  quality: {
    average: 4.7,
    reviewCount: 33,
    distribution: [
      { stars: 5, count: 19 },
      { stars: 4, count: 12 },
      { stars: 3, count: 1 },
      { stars: 2, count: 1 },
      { stars: 1, count: 0 },
    ],
    alerts: [
      {
        id: "alert-1",
        rating: 3.8,
        driver: "Tunde Adeyemi",
        route: "Agodi  →  UI Gate",
        time: "10:56",
        avatar: "/avatar.png",
      },
      {
        id: "alert-2",
        rating: 3.3,
        driver: "Emeka Obi",
        route: "Challenge  →  UI Gate",
        time: "10:41",
        avatar: "/avatar.png",
      },
    ],
  },
};

export default mockPerformance;
