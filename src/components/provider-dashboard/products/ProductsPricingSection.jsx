import { useRef, useState } from "react";
import { Clock3, Pencil, Plus, Trash2 } from "lucide-react";
import Button from "../../button";
import ProductDetailsModal from "./ProductDetailsModal";
import ProductReviewModal from "./ProductReviewModal";

const formatPrice = (price) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 2 }).format(price);

export default function ProductsPricingSection() {
  // Local UI state until a product-review endpoint is available.
  const [products, setProducts] = useState([]);
  const [dialog, setDialog] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const nextId = useRef(0);
  const closeDialog = () => { setDialog(null); setEditingProduct(null); };

  const saveProduct = (product) => {
    if (editingProduct) {
      setProducts((previous) => previous.map((item) => item.id === editingProduct.id ? { ...item, ...product, status: "pending" } : item));
    } else {
      const id = ++nextId.current;
      setProducts((previous) => [...previous, { ...product, id, status: "pending" }]);
    }
    setEditingProduct(null);
    setDialog("review");
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
                  <h4 className="break-words font-semibold text-gray-900">{product.name}</h4>
                  <p className="mt-1 font-semibold text-[#005823]">{formatPrice(product.price)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button type="button" aria-label={`Edit ${product.name}`} onClick={() => { setEditingProduct(product); setDialog("edit"); }}
                    className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900"><Pencil size={16} /></button>
                  <button type="button" aria-label={`Delete ${product.name}`} onClick={() => setProducts((previous) => previous.filter((item) => item.id !== product.id))}
                    className="p-2 rounded-md text-gray-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              </div>
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700"><Clock3 size={13} />Under review</p>
            </article>
          ))}
        </div>
      ) : <p className="text-sm text-gray-500">Add a product to configure pricing.</p>}
      {(dialog === "add" || dialog === "edit") && <ProductDetailsModal key={editingProduct?.id ?? "new"} onClose={closeDialog} onSave={saveProduct} editingProduct={editingProduct} />}
      {dialog === "review" && <ProductReviewModal onClose={closeDialog} />}
    </section>
  );
}
