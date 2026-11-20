export const unwrapProductOrders = (response) => {
  const orders = [
    response,
    response?.orders,
    response?.data?.orders,
    response?.data?.data?.orders,
    response?.data?.data,
    response?.data,
  ].find(Array.isArray);
  if (!Array.isArray(orders)) {
    throw new Error("The orders response did not contain an order list.");
  }
  return orders.map((order) => ({ ...order, id: order.id ?? order._id }));
};

export const formatProductOrderStatus = (status = "pending_payment") =>
  String(status).replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export const formatProductOrderPrice = (amount) => new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 2,
}).format(Number(amount) || 0);

export const getProductOrderItems = (order) =>
  Array.isArray(order.items) ? order.items : Array.isArray(order.products) ? order.products : [];

export const getProductOrderId = (notification) => {
  const queue = [{ value: notification, isOrder: false }];
  const visited = new Set();
  const orderIdKeys = [
    "orderId",
    "order_id",
    "productOrderId",
    "product_order_id",
  ];
  const orderContainerKeys = [
    "order",
    "productOrder",
    "product_order",
    "orderDetails",
    "order_details",
  ];
  const wrapperKeys = [
    { key: "data", isOrder: true },
    { key: "payload", isOrder: true },
    { key: "notification", isOrder: false },
  ];

  while (queue.length) {
    const { value, isOrder } = queue.shift();
    if (typeof value === "string") {
      const trimmedValue = value.trim();
      if (isOrder && /^[{[]/.test(trimmedValue)) {
        try {
          queue.push({ value: JSON.parse(trimmedValue), isOrder: true });
          continue;
        } catch {
          // A non-JSON string in an order field can itself be the order ID.
        }
      }
      if (isOrder && trimmedValue) return trimmedValue;
      continue;
    }
    if (!value || typeof value !== "object" || visited.has(value)) continue;
    visited.add(value);

    for (const key of orderIdKeys) {
      if (typeof value[key] === "string" && value[key].trim()) {
        return value[key].trim();
      }
    }
    if (isOrder) {
      const id = value._id ?? value.id;
      if (typeof id === "string" && id.trim()) return id.trim();
    }

    for (const key of orderContainerKeys) {
      if (value[key] !== undefined && value[key] !== null) {
        queue.push({ value: value[key], isOrder: true });
      }
    }
    for (const { key, isOrder: childIsOrder } of wrapperKeys) {
      if (value[key] !== undefined && value[key] !== null) {
        queue.push({ value: value[key], isOrder: childIsOrder });
      }
    }
  }

  return null;
};
