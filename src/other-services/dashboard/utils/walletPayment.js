export function getAvailableWalletBalance(response) {
  const value = response?.data?.walletBalance?.available ??
    response?.data?.available ?? response?.walletBalance?.available ?? response?.available;
  if (value == null || String(value).trim() === "") return null;
  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0 ? amount : null;
}

export function getWalletPaymentError(balance, total) {
  if (!Number.isFinite(total) || total <= 0) {
    return "Unable to verify the booking total. Please refresh your bookings.";
  }
  if (balance == null || !Number.isFinite(balance)) {
    return "Unable to verify your wallet balance. Please try again or choose Pay Online.";
  }
  if (balance < total) {
    return "Insufficient wallet balance. Please fund your wallet.";
  }
  return "";
}
