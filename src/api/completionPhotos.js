import api from "./axios";

export const uploadCompletionPhoto = async (email, file) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post(`/file/${encodeURIComponent(email)}/work_visuals`, formData);
  if (!data?.file?.url) throw new Error("The photo upload did not return a URL.");
  return data.file.url;
};
