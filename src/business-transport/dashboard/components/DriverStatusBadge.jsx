const STATUS_STYLES = {
  online: "bg-[#06C755] text-white",
  offline: "bg-[#CAC6C6] text-white",
  pending: "border border-[#F3D58A] bg-[#FFF4D6] text-[#A75B16]",
};

export default function DriverStatusBadge({ status }) {
  const label =
    status === "pending" ? "Pending signup" : `${status.charAt(0).toUpperCase()}${status.slice(1)}`;

  return (
    <span
      className={`inline-flex min-w-[74px] shrink-0 whitespace-nowrap justify-center rounded-lg px-3 py-1.5 text-xs font-medium sm:text-sm ${
        STATUS_STYLES[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {label}
    </span>
  );
}
