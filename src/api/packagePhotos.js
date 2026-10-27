import api from "./axios";

export const uploadPackagePhoto = async (email, file) => {
  if (!email) throw new Error("Your account email is unavailable for the package photo upload. Please refresh and try again.");
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post(
    `/file/${encodeURIComponent(email)}/package_images`,
    formData,
  );
  if (!data?.file?.url) throw new Error("The photo upload did not return a URL. Please try again.");
  return data.file.url;
};
