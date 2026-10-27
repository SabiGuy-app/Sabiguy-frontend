export const EDUCATION_SERVICE_OPTIONS = [
  { id: "home-tutor", name: "Home Tutor" },
  { id: "online-tutor", name: "Online Tutor" },
  { id: "exam-coaching", name: "Exam Coaching" },
  { id: "coding-tutor", name: "Coding tutor" },
  { id: "data-analysis-tutor", name: "Data Analysis tutor" },
  { id: "ui-ux-design-tutor", name: "UI/UX Design tutor" },
  { id: "digital-marketing-tutor", name: "Digital Marketing tutor" },
  { id: "music-lessons", name: "Music Lessons" },
  { id: "dance-lessons", name: "Dance Lessons" },
  { id: "art-lessons", name: "Art Lessons" },
  { id: "french-tutor", name: "French tutor" },
  { id: "spanish-tutor", name: "Spanish tutor" },
  { id: "yoruba-tutor", name: "Yoruba tutor" },
  { id: "hausa-tutor", name: "Hausa tutor" },
  { id: "igbo-tutor", name: "Igbo tutor" },

  
];

export const EDUCATION_SERVICE_NAMES = EDUCATION_SERVICE_OPTIONS.map(
  (service) => service.name,
);

export const EDUCATION_PROVIDER_SEARCH_NAMES = [
  ...EDUCATION_SERVICE_NAMES,
  "Tutor",
];
