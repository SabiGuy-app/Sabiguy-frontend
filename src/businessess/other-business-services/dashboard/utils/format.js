export function formatNaira(amount) {
  return `₦${Number(amount).toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}

export function formatNairaCompact(amount) {
  return `₦${(amount / 1000).toLocaleString("en-NG", { maximumFractionDigits: 1 })}k`;
}
