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

const productStatuses = ["all", "pending", "approved", "rejected"];

export default function ProductsPricingSection() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("all");
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

  const visibleProducts = activeStatus === "all"
    ? products
    : products.filter((product) => getProductStatus(product).label.toLowerCase() === activeStatus);

  return (
    <section aria-labelledby="products-pricing-heading">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 id="products-pricing-heading" className="font-semibold text-lg text-gray-900">Products</h2>
          <p className="mt-1 text-sm text-gray-500">Manage your catalog, pricing, and product approval status.</p>
        </div>
        <Button type="button" size="sm" onClick={() => { setEditingProduct(null); setDialog("add"); }} aria-label="Add product"
          className="inline-flex shrink-0 items-center gap-2"><Plus size={17} /><span className="hidden sm:inline">Add product</span></Button>
      </div>
      <div role="tablist" aria-label="Filter products by approval status" className="mb-5 flex gap-2 overflow-x-auto border-b border-gray-200">
        {productStatuses.map((status) => (
          <button
            key={status}
            type="button"
            role="tab"
            aria-selected={activeStatus === status}
            onClick={() => setActiveStatus(status)}
            className={`shrink-0 border-b-2 px-3 py-2 text-sm font-medium capitalize ${
              activeStatus === status
                ? "border-[#005823] text-[#005823]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {status}
            <span className="ml-1.5 text-xs text-gray-400">
              {status === "all"
                ? products.length
                : products.filter((product) => getProductStatus(product).label.toLowerCase() === status).length}
            </span>
          </button>
        ))}
      </div>
      {isLoading ? <p className="text-sm text-gray-500">Loading products...</p> : products.length ? (
        visibleProducts.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                  <th scope="col" className="px-3 py-3 font-medium">Product</th>
                  <th scope="col" className="px-3 py-3 font-medium">Price</th>
                  <th scope="col" className="px-3 py-3 font-medium">Approval status</th>
                  <th scope="col" className="px-3 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visibleProducts.map((product) => {
                  const status = getProductStatus(product);
                  const StatusIcon = status.Icon;
                  return (
                    <tr key={product.id} className="text-gray-700">
                      <th scope="row" className="px-3 py-3 font-medium text-gray-900">
                        <div className="flex min-w-0 items-center gap-3">
                          {product.productImage && (
                            <img src={product.productImage} alt="" className="h-12 w-12 shrink-0 rounded-md object-cover" />
                          )}
                          <span className="min-w-0">
                            <span className="block truncate">{product.name}</span>
                            {product.description && <span className="mt-0.5 block max-w-xs truncate text-xs font-normal text-gray-500">{product.description}</span>}
                          </span>
                        </div>
                      </th>
                      <td className="whitespace-nowrap px-3 py-3 font-medium text-[#005823]">{formatPrice(product.price)}</td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}>
                          <StatusIcon size={13} />{status.label}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1">
                          <button type="button" aria-label={`Edit ${product.name}`} onClick={() => { setEditingProduct(product); setDialog("edit"); }}
                            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"><Pencil size={15} /></button>
                          <button type="button" aria-label={`Delete ${product.name}`} disabled title="Product deletion is not available yet"
                            className="cursor-not-allowed rounded-md p-2 text-gray-400 opacity-50"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : <p className="text-sm text-gray-500">No {activeStatus} products yet.</p>
      ) : <p className="text-sm text-gray-500">Add a product to configure pricing.</p>}
      {(dialog === "add" || dialog === "edit") && <ProductDetailsModal key={editingProduct?.id ?? "new"} onClose={closeDialog} onSave={saveProduct} editingProduct={editingProduct} isSubmitting={isSubmitting} />}
      {dialog === "review" && <ProductReviewModal onClose={closeDialog} />}
    </section>
  );
}
