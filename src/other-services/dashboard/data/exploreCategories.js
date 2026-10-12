export const exploreCategories = [
  {
    id: "transport",
    title: "Transport & Logistics",
    image: "/categories/transport.png",
    imageIncludesTitle: true,
    tasks: ["Book a Ride", "Package Delivery"],
  },
  {
    id: "beauty",
    title: "Beauty & Personal Care",
    image: "/categories/beauty.png",
    imageIncludesTitle: true,
    tasks: ["Barbing Services", "Spa", "Lash Tech"],
    to: "/dashboard/categories/beauty-personal-care",
  },
  {
    id: "home",
    title: "Home & Repair Services",
    image: "/hand-tools.png",
    tasks: [
      "Plumbing & Electrical",
      "Carpentry & Welding",
      "Finishing & Aesthetics",
    ],
    comingSoon: true,
  },
  {
    id: "emergency",
    title: "Emergency Services",
    image: "/siren.png",
    tasks: [
      "Ambulance Services",
      "Towing & Roadside",
      "Locksmiths",
      "Security Services",
    ],
    comingSoon: true,
  },
  {
    id: "professional",
    title: "Professional Services",
    image: "/family.png",
    tasks: [
      "Legal & Financial",
      "Real Estate & Construction",
      "Healthcare & Technology",
    ],
    comingSoon: true,
  },
  {
    id: "creative",
    title: "Freelance & Creative Services",
    image: "/family.png",
    tasks: ["Digital Design", "Content Creation", "Media Production"],
    comingSoon: true,
  },
];

export function getCategoryDestination(category, task) {
  if (category.id === "beauty" && task) {
    const serviceNames = {
      "Barbing Services": "Barbing",
      "Lash Tech": "Lash Tech.",
    };
    return `${category.to}?service=${encodeURIComponent(serviceNames[task] || task)}`;
  }
  if (category.to) return category.to;
  if (category.id === "transport")
    return `/bookings?service=${encodeURIComponent(task === "Package Delivery" ? "package delivery" : "book a ride")}`;
  return null;
}
