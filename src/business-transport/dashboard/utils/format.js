export const formatNaira = (amount) => {
  const value = Number(amount) || 0;
  return `₦${value.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
};

export const formatNairaCompact = (amount) => {
  const value = Number(amount) || 0;
  const abs = Math.abs(value);

  if (abs >= 1_000_000) {
    return `₦${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}m`;
  }
  if (abs >= 1_000) {
    return `₦${(value / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return `₦${value.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
};

export const formatNairaTrip = (amount) => {
  if (amount >= 1_000_000) {
    return `₦${(amount / 1_000_000).toFixed(1)}m`;
  }
  if (amount >= 1_000) {
    return `₦${(amount / 1_000).toFixed(1)}k`;
  }
  return `₦${amount.toLocaleString("en-NG")}`;
};
