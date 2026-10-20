const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function getProviderServiceInitialValues(category, serviceOptions) {
  let draft;
  try {
    draft = JSON.parse(localStorage.getItem(`provider-service-details-draft-${category}`) || "null");
  } catch { /* Ignore invalid saved drafts. */ }
  if (draft?.individualForm) return draft.individualForm;
  const services = draft?.services || serviceOptions;
  const selectedIds = draft?.selectedServices || serviceOptions.slice(0, 5).map((item) => item.id);
  return {
    selectedServices: services.filter((item) => selectedIds.includes(item.id)).map((item) => item.name),
    customServices: services.filter((item) => !serviceOptions.some((option) => option.name === item.name)).map((item) => item.name),
    experience: "",
    yearsOfExperience: "",
    availableDays: draft?.selectedDays || DAYS.slice(0, 6),
    businessHours: { start: draft?.openingTime || "09:00 AM", end: draft?.closingTime || "06:00 PM" },
    servicePlace: draft?.selectedLocations || ["Customer Address", "Office / Commercial Space"],
    workPhotos: draft?.studioPictures || [],
    isRegistered: null, BusinessName: "", BusinessAddress: "", cacFile: "", cacFileName: "",
    ...draft?.registration,
  };
}

export function isProviderServiceComplete(values) {
  return values.selectedServices.length > 0 && values.yearsOfExperience !== "" &&
    values.availableDays.length > 0 && Boolean(values.businessHours.start) &&
    Boolean(values.businessHours.end) && values.servicePlace.length > 0;
}

function timeTo24Hour(time) {
  const [clock, period] = time.split(" ");
  let [hours, minutes] = clock.split(":").map(Number);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function buildProviderServiceDetails(values) {
  return {
    service: values.selectedServices.map((serviceName) => ({ serviceName })),
    yearsOfExperience: Number(values.yearsOfExperience),
    availableDays: values.availableDays.map((day) => DAY_NAMES[DAYS.indexOf(day)] || day),
    businessHours: { start: timeTo24Hour(values.businessHours.start), end: timeTo24Hour(values.businessHours.end) },
    servicePlace: values.servicePlace,
    studioImages: [{ pictures: values.workPhotos, videos: [] }],
    businessName: values.isRegistered === true ? values.BusinessName : "",
    businessAddress: values.isRegistered === true ? values.BusinessAddress : "",
    cacFile: values.isRegistered === true ? values.cacFile : "",
  };
}
