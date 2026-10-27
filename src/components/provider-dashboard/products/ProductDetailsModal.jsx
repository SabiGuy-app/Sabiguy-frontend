import { useState } from "react";
import { X } from "lucide-react";
import Modal from "../../Modal";
import Button from "../../button";
import { validateProduct } from "./productValidation";

export default function ProductDetailsModal({ onClose, onSave, editingProduct }) {
  const [product, setProduct] = useState(() => ({ name: editingProduct?.name ?? "", price: editingProduct ? String(editingProduct.price) : "" }));
  const [error, setError] = useState("");
  const invalid = validateProduct(product);

  const updateProduct = (event) => {
    setProduct((previous) => ({ ...previous, [event.target.name]: event.target.value }));
    setError("");
  };

  const submit = (event) => {
    event.preventDefault();
    if (invalid) { setError(invalid); return; }
    onSave({ name: product.name.trim(), price: Number(product.price) });
  };

  return (
    <Modal isOpen onClose={onClose} showCloseButton={false}
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
      panelClassName="relative max-h-[calc(100dvh_-_2rem)] w-full max-w-[700px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-7">
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <h2 className="text-xl font-semibold text-[#231F20]">Product Details</h2>
        <button type="button" onClick={onClose} aria-label="Close product details"
          className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"><X size={22} /></button>
      </div>
      <form onSubmit={submit} className="flex flex-col gap-5 pt-5">
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
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-between">
          <Button type="button" variant="outline" size="md" onClick={onClose} className="w-full sm:w-auto">Cancel</Button>
          <Button type="submit" size="md" disabled={Boolean(invalid)} className="w-full disabled:cursor-not-allowed sm:w-auto">{editingProduct ? "Update" : "Save"}</Button>
        </div>
      </form>
    </Modal>
  );
}
