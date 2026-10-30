import api from "./axios";

export const uploadProductImage = async (email, file) => {
  if (!email) throw new Error("Your account email is unavailable for the product image upload.");
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post(
    `/file/${encodeURIComponent(email)}/products`,
    formData,
  );
  if (!data?.file?.url) throw new Error("The upload did not return an image URL. Please try again.");
  return data.file.url;
};

export const submitProduct = async (product) => {
  const { data } = await api.post("/products", product);
  return data;
};
