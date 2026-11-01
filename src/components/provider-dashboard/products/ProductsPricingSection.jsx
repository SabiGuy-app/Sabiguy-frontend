import { useEffect, useState } from "react";
import { Check, Clock3, Pencil, Plus, Trash2, X } from "lucide-react";
import Button from "../../button";
import ProductDetailsModal from "./ProductDetailsModal";
import ProductReviewModal from "./ProductReviewModal";
import { getProducts, submitProduct, updateProduct } from "../../../api/products";
import toast from "react-hot-toast";

const formatPrice = (price) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 2 }).format(price);

const getProductStatus = (product) => {
  const raw = String(product.status ?? product.approvalStatus ?? product.reviewStatus ?? "pending").toLowerCase();
  if (raw === "approved") return { label: "Approved", className: "bg-green-50 text-green-700", Icon: Check };
  if (raw === "rejected") return { label: "Rejected", className: "bg-red-50 text-red-700", Icon: X };
  return { label: "Pending", className: "bg-amber-50 text-amber-700", Icon: Clock3 };
};

export default function ProductsPricingSection() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialog, setDialog] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    getProducts()
      .then((response) => {
        const list = Array.isArray(response)
          ? response
          : response?.data?.products ?? response?.products ?? response?.data;
        if (active && Array.isArray(list)) {
          setProducts(list.map((product) => ({ ...product, id: product.id ?? product._id })));
        }
      })
      .catch((error) => {
        if (active) toast.error(error?.response?.data?.message || "Failed to load products");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, []);
  const closeDialog = () => {
    if (isSubmitting) return;
    setDialog(null);
    setEditingProduct(null);
  };

  const saveProduct = async (product) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        const response = await updateProduct(editingProduct.id, product);
        const savedProduct = response?.data?.product ?? response?.product ?? response?.data ?? response;
        setProducts((previous) => previous.map((item) => item.id === editingProduct.id
          ? { ...item, ...savedProduct, ...product, id: editingProduct.id }
          : item));
        setEditingProduct(null);
        setDialog(null);
        toast.success("Product updated");
        return;
      }
      const response = await submitProduct(product);
      const savedProduct = response?.data?.product ?? response?.product ?? response?.data;
      if (!savedProduct || !(savedProduct?._id || savedProduct?.id)) throw new Error("The server did not return the submitted product. Check your products before retrying.");
      setProducts((previous) => [...previous, { ...savedProduct, id: savedProduct.id ?? savedProduct._id }]);
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
      {isLoading ? <p className="text-sm text-gray-500">Loading products...</p> : products.length ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <article key={product.id} className="rounded-lg border border-gray-200 p-2.5">
              <div className="flex items-center gap-2">
                {product.productImage && (
                  <img src={product.productImage} alt={product.name} className="h-12 w-12 shrink-0 rounded-md object-cover" />
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-semibold text-gray-900">{product.name}</h4>
                  <p className="truncate text-sm font-semibold text-[#005823]">{formatPrice(product.price)}</p>
                </div>
                <div className="flex shrink-0 items-center">
                  <button type="button" aria-label={`Edit ${product.name}`} onClick={() => { setEditingProduct(product); setDialog("edit"); }}
                    className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900"><Pencil size={14} /></button>
                  <button type="button" aria-label={`Delete ${product.name}`} disabled title="Product deletion is not available yet"
                    className="cursor-not-allowed rounded-md p-1.5 text-gray-400 opacity-50"><Trash2 size={14} /></button>
                </div>
              </div>
              {(() => { const status = getProductStatus(product); const StatusIcon = status.Icon; return (
                <p className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${status.className}`}>
                  <StatusIcon size={12} />{status.label}
                </p>
              ); })()}
            </article>
          ))}
        </div>
      ) : <p className="text-sm text-gray-500">Add a product to configure pricing.</p>}
      {(dialog === "add" || dialog === "edit") && <ProductDetailsModal key={editingProduct?.id ?? "new"} onClose={closeDialog} onSave={saveProduct} editingProduct={editingProduct} isSubmitting={isSubmitting} />}
      {dialog === "review" && <ProductReviewModal onClose={closeDialog} />}
    </section>
  );
}
