import api from "./axios";
import { useAuthStore } from "../stores/auth.store";
import { assertBuyerIdentityComplete } from "../utils/buyerKycStatus";

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

export const getProducts = async () => {
  const { data } = await api.get("/products");
  return data;
};

export const updateProduct = async (id, product) => {
  const { data } = await api.put(`/products/${encodeURIComponent(id)}`, product);
  return data;
};

export const getProductDeliveryQuote = async (payload) => {
  const { data } = await api.post("/products/delivery/quote", payload);
  return data;
};

export const checkoutProductOrder = async (payload) => {
  assertBuyerIdentityComplete(useAuthStore.getState().user);
  const { data } = await api.post("/products/orders/checkout", payload);
  return data;
};

export const verifyProductOrder = async (id) => {
  const { data } = await api.post(
    `/products/orders/${encodeURIComponent(id)}/verify`,
  );
  return data;
};

export const getProductOrders = async (status) => {
  const { data } = await api.get("/products/orders", {
    params: status ? { status } : undefined,
  });
  return data;
};

export const updateProductOrderFulfillment = async (id, fulfillment) => {
  const { data } = await api.patch(
    `/products/orders/${encodeURIComponent(id)}/fulfillment`,
    fulfillment,
  );
  return data;
};

export const confirmProductOrderDelivery = async (id) => {
  const { data } = await api.post(
    `/products/orders/${encodeURIComponent(id)}/confirm-delivery`,
  );
  return data;
};

export const disputeProductOrderDelivery = async (id, reason) => {
  const { data } = await api.post(
    `/products/orders/${encodeURIComponent(id)}/dispute-delivery`,
    { reason },
  );
  return data;
};
