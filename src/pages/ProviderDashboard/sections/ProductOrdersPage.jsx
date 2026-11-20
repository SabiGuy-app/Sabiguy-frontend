import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProviderDashboardLayout from "../../../components/layouts/ProviderDashboardLayout";
import BusinessDashboardLayout from "../../../businessess/other-business-services/dashboard/layout/BusinessDashboardLayout";
import { getProductOrders, updateProductOrderFulfillment } from "../../../api/products";
import {
  formatProductOrderPrice,
  formatProductOrderStatus,
  getProductOrderItems,
  unwrapProductOrders,
} from "../../../utils/productOrders";

const orderStatuses = [
  "pending_payment",
  "paid",
  "processing",
  "shipped",
  "ready_for_pickup",
  "delivered",
  "completed",
];
const fulfillmentStatuses = ["processing", "shipped", "delivered", "ready_for_pickup"];
const totalAmount = (order) => order.subtotal + (order.deliveryFee || 0);
const getCustomerName = (order) =>
  order.customer?.fullName ?? order.customer?.name ?? order.buyer?.fullName ??
  order.buyer?.name ?? order.customerName ?? "Customer";

export default function ProductOrdersPage({ business = false }) {
  const Layout = business ? BusinessDashboardLayout : ProviderDashboardLayout;
  const [activeStatus, setActiveStatus] = useState("all");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [fulfillment, setFulfillment] = useState({
    status: "processing",
    trackingNumber: "",
    note: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setLoadError("");
    getProductOrders(activeStatus === "all" ? undefined : activeStatus)
      .then((response) => {
        const loadedOrders = unwrapProductOrders(response);
        if (active) setOrders(loadedOrders);
      })
      .catch((error) => {
        if (!active) return;
        const message = error?.response?.data?.message || error.message || "Failed to load orders.";
        setLoadError(message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, [activeStatus]);

  const startEditing = (order) => {
    setEditingOrderId(order.id);
    setFulfillment({
      status: fulfillmentStatuses.includes(order.status) ? order.status : "processing",
      trackingNumber: order.trackingNumber ?? "",
      note: "",
    });
  };

  const saveFulfillment = async (event, order) => {
    event.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    try {
      const response = await updateProductOrderFulfillment(order.id, fulfillment);
      const savedOrder = response?.order ?? response?.data?.order ?? response?.data;
      setOrders((current) => current.flatMap((item) => {
        if (item.id !== order.id) return [item];
        const updatedOrder = {
          ...item,
          ...(savedOrder && typeof savedOrder === "object" ? savedOrder : {}),
          ...fulfillment,
        };
        return activeStatus !== "all" && updatedOrder.status !== activeStatus ? [] : [updatedOrder];
      }));
      setEditingOrderId(null);
      toast.success("Order fulfillment updated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to update order fulfillment.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <div className={business ? "business-card p-5 sm:p-7" : "rounded-xl bg-white p-5 shadow-sm sm:p-7"}>
        <div className="mb-5">
          <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
          <p className="mt-1 text-sm text-gray-500">Review customer orders and update their status.</p>
        </div>
        <div role="tablist" aria-label="Filter orders by status" className="mb-5 flex gap-2 overflow-x-auto border-b border-gray-200">
          {["all", ...orderStatuses].map((status) => (
            <button
              key={status}
              type="button"
              role="tab"
              aria-selected={activeStatus === status}
              onClick={() => setActiveStatus(status)}
              className={`shrink-0 border-b-2 px-3 py-2 text-sm font-medium ${
                activeStatus === status
                  ? "border-[#005823] text-[#005823]"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {formatProductOrderStatus(status)}
            </button>
          ))}
        </div>
        {isLoading ? (
          <p role="status" className="py-8 text-center text-sm text-gray-500">Loading orders...</p>
        ) : loadError ? (
          <p role="alert" className="py-8 text-center text-sm text-red-600">{loadError}</p>
        ) : orders.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">No orders found for this status.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                  <th scope="col" className="px-3 py-3 font-medium">Order</th>
                  <th scope="col" className="px-3 py-3 font-medium">Customer</th>
                  <th scope="col" className="px-3 py-3 font-medium">Products</th>
                  <th scope="col" className="px-3 py-3 font-medium">Total</th>
                  <th scope="col" className="px-3 py-3 font-medium">Status</th>
                  <th scope="col" className="px-3 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <Fragment key={order.id ?? order.orderNumber}>
                    <tr className="align-top text-gray-700">
                      <th scope="row" className="px-3 py-4 font-medium text-gray-900">
                        {order.orderNumber ?? order.id ?? "—"}
                      </th>
                      <td className="px-3 py-4">{getCustomerName(order)}</td>
                      <td className="max-w-sm px-3 py-4">
                        {getProductOrderItems(order).length
                          ? getProductOrderItems(order).map((item) => {
                            const name = item.product?.name ?? item.name ?? item.productName ?? "Product";
                            return `${name}${item.quantity ? ` x ${item.quantity}` : ""}`;
                          }).join(", ")
                          : "—"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4">
                        {formatProductOrderPrice(totalAmount(order))}
                      </td>
                      <td className="px-3 py-4">
                        <span className="inline-flex whitespace-nowrap rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                          {formatProductOrderStatus(order.status)}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        {!["pending_payment", "completed"].includes(order.status) && order.id && (
                          <button
                            type="button"
                            onClick={() => startEditing(order)}
                            className="whitespace-nowrap rounded-lg border border-[#005823] px-3 py-2 text-sm font-medium text-[#005823] hover:bg-[#005823]/5"
                          >
                            Update order
                          </button>
                        )}
                      </td>
                    </tr>
                    {editingOrderId === order.id && (
                      <tr>
                        <td colSpan={6} className="bg-gray-50 px-3 py-4">
                          <form onSubmit={(event) => saveFulfillment(event, order)} className="grid gap-3 sm:grid-cols-2">
                            <label className="text-sm font-medium text-gray-700">
                              Order status
                              <select
                                value={fulfillment.status}
                                onChange={(event) => setFulfillment((current) => ({ ...current, status: event.target.value }))}
                                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
                              >
                                {fulfillmentStatuses.map((status) => (
                                  <option key={status} value={status}>{formatProductOrderStatus(status)}</option>
                                ))}
                              </select>
                            </label>
                            <label className="text-sm font-medium text-gray-700">
                              Tracking number
                              <input
                                value={fulfillment.trackingNumber}
                                onChange={(event) => setFulfillment((current) => ({ ...current, trackingNumber: event.target.value }))}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                              />
                            </label>
                            <label className="text-sm font-medium text-gray-700 sm:col-span-2">
                              Note
                              <textarea
                                value={fulfillment.note}
                                onChange={(event) => setFulfillment((current) => ({ ...current, note: event.target.value }))}
                                rows={2}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                              />
                            </label>
                            <div className="flex gap-2 sm:col-span-2">
                              <button type="submit" disabled={isSaving} className="rounded-lg bg-[#005823] px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                                {isSaving ? "Saving..." : "Save update"}
                              </button>
                              <button type="button" disabled={isSaving} onClick={() => setEditingOrderId(null)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 disabled:opacity-60">
                                Cancel
                              </button>
                            </div>
                          </form>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
