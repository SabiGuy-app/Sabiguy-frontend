export const getUserRecord = (user) => user?.data || user?.user || user;

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
  const status = getBuyerKycStatus(user);
  const actionPath = getBuyerKycActionPath(status);

  if (status === "approved" || status === "not_buyer") {
    return {
      actionPath: null,
      canCreateBooking: true,
      message: "",
      status,
    };
  }

  const messages = {
    needs_email_verification:
      "Please verify your email before creating a booking.",
    needs_nin_upload:
      "Please complete your KYC verification before creating a booking.",
    kyc_pending:
      "Your KYC verification is under review. You can create a booking once it is approved.",
    kyc_rejected:
      "Your KYC verification was rejected. Please resubmit your NIN before creating a booking.",
    unknown: "We are checking your KYC status. Please wait a moment.",
  };

  return {
    actionPath,
    canCreateBooking: false,
    message:
      messages[status] ||
      "Please complete your KYC verification before creating a booking.",
    status,
  };
};
