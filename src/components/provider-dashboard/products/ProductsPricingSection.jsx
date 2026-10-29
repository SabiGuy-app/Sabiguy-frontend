import { useState } from "react";
import { Clock3, Pencil, Plus, Trash2 } from "lucide-react";
import Button from "../../button";
import ProductDetailsModal from "./ProductDetailsModal";
import ProductReviewModal from "./ProductReviewModal";
import { submitProduct } from "../../../api/products";

const formatPrice = (price) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 2 }).format(price);

export default function ProductsPricingSection() {
  // Display submissions from this session until a product-list endpoint is connected.
  const [products, setProducts] = useState([]);
  const [dialog, setDialog] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const closeDialog = () => {
    if (isSubmitting) return;
    setDialog(null);
    setEditingProduct(null);
  };

  const saveProduct = async (product) => {
    if (isSubmitting) return;
    if (editingProduct) {
      throw new Error("Product updates are not available yet.");
    }
    setIsSubmitting(true);
    try {
      const response = await submitProduct(product);
      const savedProduct = response?.data;
      if (!savedProduct?._id) throw new Error("The server did not return the submitted product. Check your products before retrying.");
      setProducts((previous) => [...previous, { ...savedProduct, id: savedProduct._id }]);
      setEditingProduct(null);
      setDialog("review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section aria-labelledby="products-pricing-heading" className="border-t border-gray-200 pt-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 id="products-pricing-heading" className="font-semibold text-lg text-gray-900">Products &amp; pricing</h3>
          <p className="mt-1 text-sm text-gray-500">Add the products you sell and their prices.</p>
        </div>
        <Button type="button" size="sm" onClick={() => { setEditingProduct(null); setDialog("add"); }} aria-label="Add product"
          className="inline-flex shrink-0 items-center gap-2"><Plus size={17} /><span className="hidden sm:inline">Add product</span></Button>
      </div>
      {products.length ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {products.map((product) => (
            <article key={product.id} className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {product.productImage && (
                    <img src={product.productImage} alt={product.name} className="mb-3 h-24 w-24 rounded-lg object-cover" />
                  )}
                  <h4 className="break-words font-semibold text-gray-900">{product.name}</h4>
                  <p className="mt-1 font-semibold text-[#005823]">{formatPrice(product.price)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button type="button" aria-label={`Edit ${product.name}`} disabled title="Product updates are not available yet"
                    className="cursor-not-allowed p-2 rounded-md text-gray-400 opacity-50"><Pencil size={16} /></button>
                  <button type="button" aria-label={`Delete ${product.name}`} disabled title="Product deletion is not available yet"
                    className="cursor-not-allowed p-2 rounded-md text-gray-400 opacity-50"><Trash2 size={16} /></button>
                </div>
              </div>
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700"><Clock3 size={13} />Under review</p>
            </article>
          ))}
        </div>
      ) : <p className="text-sm text-gray-500">Add a product to configure pricing.</p>}
      {(dialog === "add" || dialog === "edit") && <ProductDetailsModal key={editingProduct?.id ?? "new"} onClose={closeDialog} onSave={saveProduct} editingProduct={editingProduct} isSubmitting={isSubmitting} />}
      {dialog === "review" && <ProductReviewModal onClose={closeDialog} />}
    </section>
  );
}
