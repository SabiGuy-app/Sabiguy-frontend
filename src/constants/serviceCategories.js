import { AUTOMOTIVE_SERVICE_OPTIONS } from "./automotiveService";
import { BEAUTY_SERVICE_OPTIONS } from "./beautyServices";
import { CATERING_SERVICE_OPTIONS } from "./cateringService";
import { CLEANING_SERVICE_OPTIONS } from "./cleaningService";
import { DOMESTIC_SERVICE_OPTIONS } from "./domesticService";
import { EDUCATION_SERVICE_OPTIONS } from "./educationService";
import { EVENT_SERVICE_OPTIONS } from "./eventsServices";
import { FASHION_SERVICE_OPTIONS } from "./fashionService";
import { HOME_REPAIR_SERVICE_OPTIONS } from "./home-repairServices";
import { LAUNDRY_SERVICE_OPTIONS } from "./laundryService";
import { PHOTOGRAPHY_VIDEOGRAPHY_SERVICE_OPTIONS } from "./photography-videographyService";

// Shared by business and individual-provider onboarding.
export const SERVICE_CATEGORIES = [
  { id: "automotive", label: "Automotive Services", services: AUTOMOTIVE_SERVICE_OPTIONS },
  { id: "beauty", label: "Beauty & Personal Care", services: BEAUTY_SERVICE_OPTIONS },
  { id: "catering", label: "Catering & Food", services: CATERING_SERVICE_OPTIONS },
  { id: "cleaning", label: "Cleaning Service", services: CLEANING_SERVICE_OPTIONS },
  { id: "domestic", label: "Domestic Services", services: DOMESTIC_SERVICE_OPTIONS },
  { id: "education", label: "Education & Tutoring", services: EDUCATION_SERVICE_OPTIONS },
  { id: "events", label: "Events & Entertainment", services: EVENT_SERVICE_OPTIONS },
  { id: "fashion", label: "Fashion & Tailoring", services: FASHION_SERVICE_OPTIONS },
  { id: "home-repair", label: "Home Repair", services: HOME_REPAIR_SERVICE_OPTIONS },
  { id: "laundry", label: "Laundry Service", services: LAUNDRY_SERVICE_OPTIONS },
  { id: "photography-videography", label: "Photography & Videography", services: PHOTOGRAPHY_VIDEOGRAPHY_SERVICE_OPTIONS },
  { id: "transport", label: "Transport & Logistics" },
];

export const SERVICE_CATEGORY_OPTIONS = SERVICE_CATEGORIES.map(({ id, label }) => ({ value: id, label }));
