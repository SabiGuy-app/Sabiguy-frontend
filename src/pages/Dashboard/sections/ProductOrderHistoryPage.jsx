import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import {
  confirmProductOrderDelivery,
  disputeProductOrderDelivery,
  getProductOrders,
} from "../../../api/products";
import DisputeProductDeliveryModal from "../../../components/DisputeProductDeliveryModal";
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
  "disputed",
  "completed",
];

const getOrderDate = (order) => {
  const value = order.createdAt ?? order.created_at ?? order.orderDate;
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
};

export default function ProductOrderHistoryPage() {
  const [activeStatus, setActiveStatus] = useState("all");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [confirmingOrderId, setConfirmingOrderId] = useState(null);
  const [disputeOrder, setDisputeOrder] = useState(null);
  const [disputingOrderId, setDisputingOrderId] = useState(null);
  const [disputeError, setDisputeError] = useState("");

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
        setLoadError(error?.response?.data?.message || error.message || "Failed to load your orders.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, [activeStatus]);

  const handleConfirmDelivery = async (order) => {
    if (!order.id || confirmingOrderId || disputingOrderId) return;
    setConfirmingOrderId(order.id);
    try {
      const response = await confirmProductOrderDelivery(order.id);
      const confirmedOrder =
        response?.order ??
        response?.data?.order ??
        response?.data?.data?.order ??
        response?.data?.data;
      setOrders((current) =>
        current.flatMap((item) => {
          if (item.id !== order.id) return [item];
          const updatedOrder = {
            ...item,
            ...(confirmedOrder && typeof confirmedOrder === "object"
              ? confirmedOrder
              : {}),
            status: confirmedOrder?.status || "completed",
          };
          return activeStatus !== "all" &&
            updatedOrder.status !== activeStatus
            ? []
            : [updatedOrder];
        }),
      );
      toast.success("Delivery confirmed");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to confirm delivery. Please try again.",
      );
    } finally {
      setConfirmingOrderId(null);
    }
  };

  const handleDisputeDelivery = async (reason) => {
    if (!disputeOrder?.id || confirmingOrderId || disputingOrderId) return;
    setDisputingOrderId(disputeOrder.id);
    setDisputeError("");
    try {
      const response = await disputeProductOrderDelivery(disputeOrder.id, reason);
      const disputedOrder =
        response?.order ??
        response?.data?.order ??
        response?.data?.data?.order ??
        response?.data?.data;
      setOrders((current) =>
        current.flatMap((item) => {
          if (item.id !== disputeOrder.id) return [item];
          const updatedOrder = {
            ...item,
            ...(disputedOrder && typeof disputedOrder === "object"
              ? disputedOrder
              : {}),
            status: disputedOrder?.status || "disputed",
          };
          return activeStatus !== "all" &&
            updatedOrder.status !== activeStatus
            ? []
            : [updatedOrder];
        }),
      );
      setDisputeOrder(null);
      toast.success("Delivery dispute submitted");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to submit the delivery dispute. Please try again.";
      setDisputeError(message);
      toast.error(message);
    } finally {
      setDisputingOrderId(null);
    }
  };

  return (
    <DashboardLayout>
      <section className="rounded-xl bg-white p-4 shadow-sm sm:p-6" aria-labelledby="order-history-heading">
        <div className="mb-5">
          <h1 id="order-history-heading" className="text-xl font-semibold text-gray-900">My Orders</h1>
          <p className="mt-1 text-sm text-gray-500">View the status and details of your product orders.</p>
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
          <p className="py-8 text-center text-sm text-gray-500">You have no orders for this status.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                  <th scope="col" className="px-3 py-3 font-medium">Order</th>
                  <th scope="col" className="px-3 py-3 font-medium">Products</th>
                  <th scope="col" className="px-3 py-3 font-medium">Date</th>
                  <th scope="col" className="px-3 py-3 font-medium">Total</th>
                  <th scope="col" className="px-3 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id ?? order.orderNumber} className="text-gray-700">
                    <th scope="row" className="px-3 py-4 font-medium text-gray-900">
                      {order.orderNumber ?? order.id ?? "—"}
                    </th>
                    <td className="max-w-sm px-3 py-4">
                      {getProductOrderItems(order).length
                        ? getProductOrderItems(order).map((item) => {
                          const name = item.product?.name ?? item.name ?? item.productName ?? "Product";
                          return `${name}${item.quantity ? ` × ${item.quantity}` : ""}`;
                        }).join(", ")
                        : "—"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4">{getOrderDate(order)}</td>
                    <td className="whitespace-nowrap px-3 py-4">
                      {formatProductOrderPrice(order.totalAmount ?? order.total ?? order.amount)}
                    </td>
                    <td className="px-3 py-4">
                      <span className="inline-flex whitespace-nowrap rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                        {formatProductOrderStatus(order.status)}
                      </span>
                      {String(order.status).toLowerCase() === "delivered" &&
                        order.id && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleConfirmDelivery(order)}
                              disabled={
                                confirmingOrderId !== null ||
                                disputingOrderId !== null
                              }
                              className="whitespace-nowrap rounded-lg bg-[#005823] px-3 py-2 text-sm font-medium text-white hover:bg-[#00461d] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {confirmingOrderId === order.id
                                ? "Confirming..."
                                : "Confirm Delivery"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setDisputeError("");
                                setDisputeOrder(order);
                              }}
                              disabled={
                                confirmingOrderId !== null ||
                                disputingOrderId !== null
                              }
                              className="whitespace-nowrap rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              Dispute Delivery
                            </button>
                          </div>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <DisputeProductDeliveryModal
        isOpen={Boolean(disputeOrder)}
        order={disputeOrder}
        submitting={disputingOrderId !== null}
        error={disputeError}
        onClose={() => {
          if (disputingOrderId !== null) return;
          setDisputeOrder(null);
          setDisputeError("");
        }}
        onSubmit={handleDisputeDelivery}
      />
    </DashboardLayout>
  );
}
