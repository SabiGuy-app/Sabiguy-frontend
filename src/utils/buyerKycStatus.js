export const getUserRecord = (user) => user?.data || user?.user || user;

export const isBuyerIdentityComplete = (user) => {
  const record = getUserRecord(user);
  return (
    record?.ninVerified === true &&
    Boolean(record?.facialCapture || record?.facialCaptureUrl)
  );
};

export const getBuyerKycStatus = (user) => {
  const record = getUserRecord(user);

  if (!record) return "unknown";
  if (record.role !== "buyer") return "not_buyer";
  if (record.emailVerified === false) return "needs_email_verification";
  if (record.kycRejected) return "kyc_rejected";

  const kycCompleted =
    record.kycCompleted ?? Boolean(record.ninSlip || record.nin);

  if (!kycCompleted) return "needs_nin_upload";
  if (!record.kycVerified) return "kyc_pending";

  return "approved";
};

export const getBuyerKycActionPath = (status) => {
  if (status === "needs_email_verification") return "/signup";
  if (status === "needs_nin_upload" || status === "kyc_rejected") {
    return "/kyc/nin";
  }
  if (status === "kyc_pending") return "/kyc/pending";
  return null;
};

export const getBuyerBookingGate = (user) => {
  const canCreateBooking = isBuyerIdentityComplete(user);

  return {
    actionPath: null,
    canCreateBooking,
    message: canCreateBooking
      ? ""
      : "Verify your NIN and complete facial capture to continue.",
    status: canCreateBooking ? "approved" : "identity_required",
  };
};

export const assertBuyerIdentityComplete = (user) => {
  const gate = getBuyerBookingGate(user);
  if (gate.canCreateBooking) return gate;

  const error = new Error(gate.message);
  error.code = "BUYER_KYC_REQUIRED";
  error.kycGate = gate;
  throw error;
};
