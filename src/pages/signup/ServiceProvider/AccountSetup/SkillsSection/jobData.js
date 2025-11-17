// data.js
export const jobTitles = [
  { label: "Select Job Title", value: "" },
  { label: "Emergency Services", value: "emergency" },
  { label: "Home & Repair Services", value: "home_repair" },
  { label: "Domestic & Lifestyle Services", value: "domestic" },
  { label: "Transport & Logistics Services", value: "transport" },
  { label: "Professional Services", value: "professional" },
  { label: "Freelance & Creative Services", value: "freelance" },
];

export const allServices = {
  emergency: [
    { label: "Ambulance Services", value: "ambulance" },
    { label: "Towing & Roadside", value: "towing" },
    { label: "Locksmiths", value: "locksmith" },
    { label: "Security Services", value: "security" },
  ],
  home_repair: [
    { label: "Plumbing & Electrical", value: "plumbing" },
    { label: "Carpentry & Welding", value: "carpentry" },
    { label: "Finishing & Aesthetics", value: "finishing" },
  ],
  domestic: [
    { label: "Household Support", value: "support" },
    { label: "Childcare & Education", value: "childcare" },
    { label: "Peronal & Beauty Services", value: "beauty" },
  ],
  transport: [
    { label: "Car driver", value: "car" },
    { label: "Motorbike driver", value: "motorbike" },
    { label: "Tricyle", value: "tricycle" },
  ],
  professional: [
    { label: "Legal & Financial", value: "legal_financial" },
    { label: "Real Estate & Construction", value: "real_estate" },
    { label: "Healthcare & Technology", value: "healthcare_tech" },
  ],
  freelance: [
    { label: "Digital Creation", value: "digital" },
    { label: "Content Creation", value: "content" },
    { label: "Media Production", value: "media" },
  ],
};
