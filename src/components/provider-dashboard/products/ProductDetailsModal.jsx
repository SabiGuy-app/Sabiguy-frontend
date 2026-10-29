import { useState } from "react";
import { X } from "lucide-react";
import Modal from "../../Modal";
import Button from "../../button";
import { validateProduct } from "./productValidation";
import ImageUploadField from "../../ImageUploadField";
import { uploadProductImage } from "../../../api/products";
import { useAuthStore } from "../../../stores/auth.store";

export default function ProductDetailsModal({ onClose, onSave, editingProduct, isSubmitting = false }) {
  const [product, setProduct] = useState(() => ({
    name: editingProduct?.name ?? "",
    price: editingProduct ? String(editingProduct.price) : "",
    description: editingProduct?.description ?? "",
    productImage: editingProduct?.productImage ?? "",
  }));
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const user = useAuthStore((state) => state.user);
  const email = user?.email || user?.data?.email || user?.user?.email ||
    user?.data?.user?.email || localStorage.getItem("email");
  const invalid = validateProduct(product) || (!product.productImage && "Upload a product image.");
  const isBusy = isSubmitting || isUploading;
  const close = () => {
    if (!isBusy) onClose();
  };

  const updateProduct = (event) => {
    setProduct((previous) => ({ ...previous, [event.target.name]: event.target.value }));
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    if (isBusy) return;
    if (invalid) { setError(invalid); return; }
    setError("");
    try {
      await onSave({
        name: product.name.trim(),
        price: Number(product.price),
        description: product.description.trim(),
        productImage: product.productImage,
        currency: "NGN",
      });
    } catch (error) {
      const fallbackMessages = {
        400: "Check the product name and price, then try again.",
        401: "Please sign in to submit a product.",
        403: "A provider or business account is required to submit products.",
      };
      const message = error.response?.data?.message;
      setError(
        (typeof message === "string" && message) ||
        fallbackMessages[error.response?.status] ||
        (error.response || error.request
          ? "Unable to submit the product. Please try again."
          : error.message) || "Unable to submit the product. Please try again.",
      );
    }
  };

  return (
    <Modal isOpen onClose={close} showCloseButton={false}
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
      panelClassName="relative max-h-[calc(100dvh_-_2rem)] w-full max-w-[700px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-7">
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <h2 className="text-xl font-semibold text-[#231F20]">Product Details</h2>
        <button type="button" onClick={close} disabled={isBusy} aria-label="Close product details"
          className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"><X size={22} /></button>
      </div>
      <form onSubmit={submit} aria-busy={isBusy} className="flex flex-col gap-5 pt-5">
        <fieldset disabled={isSubmitting} className="flex min-w-0 flex-col gap-5">
        <div>
          <label htmlFor="productName" className="mb-2 block text-sm font-medium text-[#231F20]">
            Product name
          </label>
          <input id="productName" name="name" value={product.name} onChange={updateProduct}
            placeholder="e.g. Hair cream" autoFocus required maxLength={160}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#388659] focus:ring-2 focus:ring-[#388659]/15" />
        </div>
        <div>
          <label htmlFor="productPrice" className="mb-2 block text-sm font-medium text-[#231F20]">
            Price (₦)
          </label>
          <input id="productPrice" name="price" type="number" value={product.price} onChange={updateProduct}
            placeholder="0.00" min="0" step="0.01" inputMode="decimal" required
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#388659] focus:ring-2 focus:ring-[#388659]/15" />
        </div>
        <div>
          <label htmlFor="productDescription" className="mb-2 block text-sm font-medium text-[#231F20]">
            Description
          </label>
          <textarea
            id="productDescription"
            name="description"
            value={product.description}
            onChange={updateProduct}
            placeholder="Describe the product you sell"
            rows={3}
            className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#388659] focus:ring-2 focus:ring-[#388659]/15"
          />
        </div>
        <ImageUploadField
          label="Product image"
          prompt="Drop a product image here or"
          required
          value={product.productImage}
          onChange={(url) => {
            setProduct((previous) => ({ ...previous, productImage: url }));
            setError("");
          }}
          uploadFile={(file) => uploadProductImage(email, file)}
          onUploadingChange={setIsUploading}
          disabled={isBusy}
        />
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-between">
          <Button type="button" variant="outline" size="md" onClick={close} disabled={isBusy} className="w-full sm:w-auto">Cancel</Button>
          <Button type="submit" size="md" disabled={isBusy || Boolean(invalid)} className="w-full disabled:cursor-not-allowed sm:w-auto">{isUploading ? "Uploading image..." : isSubmitting ? "Submitting..." : editingProduct ? "Update" : "Save"}</Button>
        </div>
        </fieldset>
      </form>
    </Modal>
  );
}
