import axios from "axios";

function providerHeaders() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Your session has expired. Please sign in again.");
  return { Authorization: `Bearer ${token}` };
}

// Individual-provider endpoints only. The shared form supplies the UI values.
export async function saveProviderOnboardingServices(category, details) {
  const headers = providerHeaders();
  const providerCategory = category === "beauty" ? "beauty_personal_care"
    : category === "home-repair" ? "home_repair" : category;
  await axios.post(`${import.meta.env.VITE_BASE_URL}/provider/job-service`, {
    job: [{ service: providerCategory, ...(category === "beauty" ? {} : { title: details.service[0]?.serviceName, tagLine: "" }) }],
  }, { headers });
  await axios.post(`${import.meta.env.VITE_BASE_URL}/provider/service-details`, {
    service: details.service,
    ...(details.yearsOfExperience !== undefined ? { yearsOfExperience: details.yearsOfExperience } : {}),
    availableDays: details.availableDays,
    businessHours: details.businessHours,
    servicePlace: details.servicePlace.map((place) => place === "Customer Address" ? "customer_address" : place),
    workVisuals: details.studioImages,
    businessName: details.businessName || "",
    businessAddress: details.businessAddress || "",
    cacFile: details.cacFile || "",
  }, { headers });
}

export async function uploadProviderWorkVisual(email, file, folder = "work_visuals") {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/file/${encodeURIComponent(email)}/${encodeURIComponent(folder)}`,
    formData,
    { headers: providerHeaders() },
  );
  if (!data?.file?.url) throw new Error("The upload did not return a photo URL. Please try again.");
  return data.file.url;
}
