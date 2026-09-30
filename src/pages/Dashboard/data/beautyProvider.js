// One sample provider until the beauty directory endpoints are connected.
export const beautyProvider = {
  id: "phil-crook", fullName: "Phil Crook", rating: 4.9, reviews: 25,
  price: 5000, city: "Lagos, Nigeria", profilePicture: "/beauty/phil-crook.png",
  job: [{ service: "Hair Stylist & Beauty Therapist" }],
  profilePath: "/dashboard/beauty/phil-crook",
  gallery: ["/beauty/hair-featured.png", "/beauty/hair-1.png", "/beauty/hair-2.png", "/beauty/hair-3.png"],
  about: "Phil is a hair stylist and beauty therapist offering haircuts, styling, lash treatments, and relaxing spa services. Each appointment is tailored to your preferred look and care needs.",
  services: [
    { name: "Hair Cut", price: 5000, description: "A consultation, precision cut, and finish tailored to your style." },
    { name: "Lash fixing", price: 5000, description: "Lash application with a choice of natural or fuller looks." },
    { name: "Spa", price: 20000, description: "A relaxing treatment designed around your personal care needs." },
    { name: "Hair styling", price: 7500, description: "Wash and styling for everyday wear or a special occasion." },
  ],
  recentReviews: [
    { id: 1, name: "John Waton", initial: "W", color: "bg-pink-600", text: "Phil listened to what I wanted and delivered a neat, well-finished haircut. The studio was clean and welcoming.", date: "2 days ago" },
    { id: 2, name: "John Waton", initial: "A", color: "bg-green-600", text: "Friendly service and great attention to detail. I was happy with the result and would visit again.", date: "2 days ago" },
  ],
};
