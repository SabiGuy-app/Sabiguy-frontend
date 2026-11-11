import { useEffect, useMemo, useRef, useState } from "react";
import SettingsTabCard, {
  EditableSettingsSection,
  SettingsEditDialog,
  SettingsRow,
} from "./SettingsTabCard";
import {
  getBanks,
  updateBusinessProfile,
  verifyBankAccount,
  updateBusinessBankInfo,
} from "../../../api/businessess";

const payoutDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function BusinessSettingsTab({
  business,
  loading,
  error,
  onBusinessUpdate,
}) {
  const [payout, setPayout] = useState({
    accountName: business?.payoutAccount.accountName ?? "",
    accountNumber: business?.payoutAccount.accountNumber ?? "",
    bankName: business?.payoutAccount.bankName ?? "",
    bankCode: business?.payoutAccount.bankCode ?? "",
  });
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [bankDraft, setBankDraft] = useState(payout);
  const [banks, setBanks] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [bankSearchTerm, setBankSearchTerm] = useState("");
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [verifyingBank, setVerifyingBank] = useState(false);
  const [bankError, setBankError] = useState("");
  const bankDropdownRef = useRef(null);
  const [isSavingBank, setIsSavingBank] = useState(false);
  const [payoutSchedule, setPayoutSchedule] = useState(() => ({
    automatic: business?.payoutSchedule?.automatic ?? false,
    day: business?.payoutSchedule?.day ?? "Friday",
    minimumThreshold: String(business?.payoutSchedule?.minimumThreshold ?? 0),
  }));
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [profileSaveError, setProfileSaveError] = useState("");

  useEffect(() => {
    setPayout({
      accountName: business?.payoutAccount.accountName ?? "",
      accountNumber: business?.payoutAccount.accountNumber ?? "",
      bankName: business?.payoutAccount.bankName ?? "",
      bankCode: business?.payoutAccount.bankCode ?? "",
    });
  }, [
    business?.payoutAccount.accountName,
    business?.payoutAccount.accountNumber,
    business?.payoutAccount.bankName,
    business?.payoutAccount.bankCode,
  ]);

  useEffect(() => {
    if (!business?.payoutSchedule) return;
    setPayoutSchedule({
      automatic: business.payoutSchedule.automatic ?? false,
      day: business.payoutSchedule.day ?? "Friday",
      minimumThreshold: String(business.payoutSchedule.minimumThreshold ?? 0),
    });
  }, [
    business?._id,
    business?.payoutSchedule,
    business?.payoutSchedule?.automatic,
    business?.payoutSchedule?.day,
    business?.payoutSchedule?.minimumThreshold,
  ]);

  const filteredBanks = useMemo(() => {
    const trimmedQuery = bankSearchTerm.trim().toLowerCase();

    if (!trimmedQuery) return banks;

    return banks.filter((bank) =>
      bank.name.toLowerCase().includes(trimmedQuery),
    );
  }, [bankSearchTerm, banks]);

  useEffect(() => {
    if (!payoutOpen) return;

    let cancelled = false;
    setBankError("");
    setLoadingBanks(true);
    getBanks()
      .then((result) => {
        const bankList = Array.isArray(result) ? result : result?.banks;
        if (!Array.isArray(bankList)) {
          throw new Error("The bank list response was invalid.");
        }
        if (!cancelled) setBanks(bankList);
      })
      .catch((loadError) => {
        if (!cancelled) {
          setBankError(
            loadError?.response?.data?.message ||
              loadError?.message ||
              "Unable to load banks. Please try again.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingBanks(false);
      });

    return () => {
      cancelled = true;
    };
  }, [payoutOpen]);

  useEffect(() => {
    if (!showBankDropdown) return undefined;

    const handleClickOutside = (event) => {
      if (
        bankDropdownRef.current &&
        !bankDropdownRef.current.contains(event.target)
      ) {
        setShowBankDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showBankDropdown]);

  const verifyPayoutAccount = async () => {
    setBankError("");
    if (!bankDraft.bankCode) {
      setBankError("Select your bank first.");
      return;
    }
    if (!/^\d{10}$/.test(bankDraft.accountNumber)) {
      setBankError("Enter a valid 10-digit account number.");
      return;
    }

    setVerifyingBank(true);
    try {
      const result = await verifyBankAccount({
        accountNumber: bankDraft.accountNumber,
        bankCode: bankDraft.bankCode,
      });
      const accountName = result?.accountName ?? result?.data?.accountName;
      if (!accountName) {
        throw new Error("Account verification did not return an account name.");
      }
      setBankDraft((current) => ({ ...current, accountName }));
    } catch (verificationError) {
      setBankDraft((current) => ({ ...current, accountName: "" }));
      setBankError(
        verificationError?.response?.data?.message ||
          verificationError?.message ||
          "Unable to verify this account. Please check the details and retry.",
      );
    } finally {
      setVerifyingBank(false);
    }
  };

  const handleSavePayout = async () => {
    if (isSavingBank || verifyingBank) return;

    setBankError("");
    if (
      !bankDraft.bankName ||
      !bankDraft.bankCode ||
      !bankDraft.accountNumber ||
      !bankDraft.accountName
    ) {
      setBankError("Please verify and complete all bank details.");
      return;
    }

    setIsSavingBank(true);

    try {
      const payload = {
        accountName: bankDraft.accountName,
        accountNumber: bankDraft.accountNumber,
        bankName: bankDraft.bankName,
        bankCode: bankDraft.bankCode,
      };

      const result = await updateBusinessBankInfo(payload);

      setPayout(bankDraft);
      setPayoutOpen(false);

      console.log("Business bank information updated:", result);
    } catch (saveError) {
      console.error("Failed to update business bank information:", saveError);

      setBankError(
        saveError?.response?.data?.message ||
          "Failed to update bank information. Please try again.",
      );
    } finally {
      setIsSavingBank(false);
    }
  };

  const saveBusinessProfile = async (values) => {
    setProfileSaveError("");

    const ninUrl = business?.ninUrl || business?.ninSlip || business?.NINUrl;
    if (!ninUrl) {
      setProfileSaveError(
        "This business has no saved NIN document. Upload it again before updating the profile.",
      );
      return false;
    }

    const latitude = Number(business?.latitude);
    const longitude = Number(business?.longitude);
    const payload = {
      ...(business?.businessCategory
        ? { businessCategory: business.businessCategory }
        : {}),
      ...(values.businessName !== "__"
        ? { businessName: values.businessName }
        : {}),
      ...(values.address !== "__" ? { businessAddress: values.address } : {}),
      ...(values.city !== "__" ? { cityOfOperation: values.city } : {}),
      ...(Number.isFinite(latitude) ? { latitude } : {}),
      ...(Number.isFinite(longitude) ? { longitude } : {}),
      ninUrl,
    };

    try {
      const result = await updateBusinessProfile(payload);
      onBusinessUpdate?.({
        ...result,
        ...(payload.businessName ? { BusinessName: payload.businessName } : {}),
        ...(payload.businessAddress
          ? { BusinessAddress: payload.businessAddress }
          : {}),
        ...(payload.cityOfOperation
          ? { cityOfOperation: payload.cityOfOperation }
          : {}),
      });
      return true;
    } catch (saveError) {
      setProfileSaveError(
        saveError?.response?.data?.message ||
          saveError?.message ||
          "Unable to save the business profile. Please try again.",
      );
      return false;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 p-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-[#E9E9E9] bg-white p-4"
          >
            <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-3 w-24 bg-gray-100 rounded" />
                <div className="h-3 w-40 bg-gray-100 rounded" />
              </div>
              <div className="flex justify-between items-center">
                <div className="h-3 w-20 bg-gray-100 rounded" />
                <div className="h-3 w-28 bg-gray-100 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-4 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="py-1">
      <EditableSettingsSection
        title="Business profile"
        onSave={saveBusinessProfile}
        initialValues={{
          businessName: business?.BusinessName || "__",
          owner: business?.fullName || "__",
          city: business?.cityOfOperation || "__",
          address: business?.BusinessAddress || "__",
        }}
        fields={[
          { key: "businessName", label: "Business name" },
          { key: "owner", label: "Owner" },
          { key: "city", label: "City" },
          { key: "address", label: "Business address" },
        ]}
        rows={[
          { key: "businessName", label: "Business name" },
          { key: "owner", label: "Owner" },
          { key: "city", label: "City" },
          { key: "address", label: "Business address" },
        ]}
      />
      {profileSaveError && (
        <p
          role="alert"
          className="mx-3 my-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600"
        >
          {profileSaveError}
        </p>
      )}
      <EditableSettingsSection
        title="Operating defaults"
        initialValues={{
          city: business?.cityOfOperation || "__",
          currency: business?.currency || "__",
          timezone: business?.timezone || "__",
          weekStarts: business?.weekStarts || "__",
        }}
        fields={[
          { key: "city", label: "City" },
          {
            key: "currency",
            label: "Currency",
            type: "select",
            options: ["NGN (₦)", "USD ($)", "GBP (£)"],
          },
          {
            key: "timezone",
            label: "Timezone",
            type: "select",
            options: ["WAT (GMT+1)", "UTC (GMT+0)"],
          },
          {
            key: "weekStarts",
            label: "Week starts",
            type: "select",
            options: ["Monday", "Sunday"],
          },
        ]}
        rows={[
          { key: "city", label: "City" },
          { key: "currency", label: "Currency" },
          { key: "timezone", label: "Timezone" },
          { key: "weekStarts", label: "Week starts" },
        ]}
      />

      <SettingsTabCard
        title="Company payout account"
        onEdit={() => {
          setBankDraft(payout);
          setBankSearchTerm(payout.bankName || "");
          setPayoutOpen(true);
        }}
      >
        <SettingsRow
          label="Account name"
          value={payout.accountName || "Not verified"}
        />
        <SettingsRow
          label="Account number"
          value={
            payout.accountNumber
              ? `****${payout.accountNumber.slice(-4)}`
              : "Not provided"
          }
        />
        <SettingsRow label="Bank" value={payout.bankName || "Not selected"} />
        <SettingsRow
          label="Verification"
          valueNode={
            <span className="rounded-full border border-[#B8DEC2] bg-[#F0FAF2] px-2 py-0.5 text-[9px] font-medium text-[#347B54]">
              {payout.accountName ? "Verified" : "Not verified"}
            </span>
          }
        />
      </SettingsTabCard>
      {payoutOpen && (
        <div
          className="fixed inset-0 z-80 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) =>
            event.target === event.currentTarget &&
            !verifyingBank &&
            setPayoutOpen(false)
          }
        >
          <form
            className="w-full max-w-md rounded-lg bg-white p-5 shadow-2xl sm:p-6"
            onSubmit={(event) => {
              event.preventDefault();
              handleSavePayout();
            }}
          >
            <h2 className="text-base font-semibold text-[#242424]">
              Edit company payout account
            </h2>
            <div className="mt-5 space-y-3">
              <label className="block text-xs font-medium text-[#555555]">
                Bank
                <div ref={bankDropdownRef} className="relative mt-1.5">
                  <input
                    type="text"
                    value={bankSearchTerm}
                    disabled={loadingBanks || verifyingBank}
                    placeholder={
                      loadingBanks ? "Loading banks..." : "Search for your bank"
                    }
                    onFocus={() => setShowBankDropdown(true)}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      setBankSearchTerm(nextValue);
                      setShowBankDropdown(true);

                      const selectedBank = banks.find(
                        (bank) =>
                          bank.name.toLowerCase() ===
                          nextValue.trim().toLowerCase(),
                      );

                      if (selectedBank) {
                        setBankDraft((current) => ({
                          ...current,
                          bankName: selectedBank.name,
                          bankCode: selectedBank.code,
                          accountName: "",
                        }));
                      }
                    }}
                    className="h-10 w-full rounded-md border border-[#D8D8D8] bg-white px-3 text-sm outline-none focus:border-[#347B54] disabled:opacity-60"
                  />

                  {showBankDropdown && filteredBanks.length > 0 && (
                    <div className="absolute z-10 mt-1 max-h-52 w-full overflow-y-auto rounded-md border border-[#E2E2E2] bg-white shadow-lg">
                      {filteredBanks.map((bank) => (
                        <button
                          key={bank.code}
                          type="button"
                          onClick={() => {
                            setBankSearchTerm(bank.name);
                            setBankDraft((current) => ({
                              ...current,
                              bankName: bank.name,
                              bankCode: bank.code,
                              accountName: "",
                            }));
                            setShowBankDropdown(false);
                          }}
                          className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-[#333333] hover:bg-[#F5F7F5]"
                        >
                          <span>{bank.name}</span>
                          {bankDraft.bankCode === bank.code && (
                            <span className="text-[10px] font-medium uppercase tracking-wide text-[#347B54]">
                              Selected
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </label>
              <label className="block text-xs font-medium text-[#555555]">
                Account number
                <input
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={10}
                  value={bankDraft.accountNumber}
                  disabled={verifyingBank}
                  onChange={(event) => {
                    const accountNumber = event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);
                    setBankDraft((current) => ({
                      ...current,
                      accountNumber,
                      accountName: "",
                    }));
                  }}
                  className="mt-1.5 h-10 w-full rounded-md border border-[#D8D8D8] px-3 text-sm outline-none focus:border-[#347B54] disabled:opacity-60"
                  placeholder="Enter 10-digit account number"
                />
              </label>
              <div>
                <p className="text-xs font-medium text-[#555555]">
                  Account name
                </p>
                <p className="mt-1.5 min-h-10 rounded-md border border-[#D8D8D8] bg-gray-50 px-3 py-2 text-sm text-[#444444]">
                  {bankDraft.accountName || "Verify account to retrieve name"}
                </p>
              </div>
            </div>
            {bankError && (
              <p role="alert" className="mt-3 text-xs text-red-600">
                {bankError}
              </p>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                disabled={verifyingBank}
                onClick={() => setPayoutOpen(false)}
                className="h-9 rounded-md border border-[#D8D8D8] px-3 text-xs text-[#555555] hover:bg-[#F7F7F7] disabled:opacity-60"
              >
                Cancel
              </button>
              {!bankDraft.accountName ? (
                <button
                  type="button"
                  disabled={loadingBanks || verifyingBank}
                  onClick={verifyPayoutAccount}
                  className="h-9 rounded-md bg-[#347B54] px-4 text-xs font-medium text-white hover:bg-[#286642] disabled:cursor-wait disabled:opacity-60"
                >
                  {verifyingBank ? "Verifying..." : "Verify account"}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSavingBank}
                  className="h-9 rounded-md bg-[#347B54] px-4 text-xs font-medium text-white hover:bg-[#286642]"
                >
                  {isSavingBank ? "Saving..." : "Save"}
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <SettingsTabCard
        title="Default payout schedule"
        onEdit={() => setScheduleOpen(true)}
      >
        <SettingsRow
          label="Automatic payouts"
          note={
            payoutSchedule.automatic
              ? `Runs every ${payoutSchedule.day}`
              : "Automatic payouts are turned off"
          }
          valueNode={
            <button
              type="button"
              role="switch"
              aria-checked={payoutSchedule.automatic}
              aria-label="Toggle automatic payouts"
              onClick={() =>
                setPayoutSchedule((current) => ({
                  ...current,
                  automatic: !current.automatic,
                }))
              }
              className={`relative h-5 w-10 shrink-0 rounded-full transition-colors ${payoutSchedule.automatic ? "bg-[#347B54]" : "bg-[#D4D4D4]"}`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${payoutSchedule.automatic ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
          }
        />
        <SettingsRow
          label="Minimum payout threshold"
          value={`₦${Number(payoutSchedule.minimumThreshold).toLocaleString("en-NG")}`}
          note="Balances below the threshold roll over to the next run."
        />
      </SettingsTabCard>
      <SettingsEditDialog
        isOpen={scheduleOpen}
        title="Edit default payout schedule"
        fields={[
          {
            key: "day",
            label: "Payout day",
            type: "select",
            options: payoutDays,
          },
          {
            key: "minimumThreshold",
            label: "Minimum payout threshold (₦)",
            type: "number",
          },
        ]}
        values={payoutSchedule}
        onClose={() => setScheduleOpen(false)}
        onSave={(values) => {
          setPayoutSchedule((current) => ({
            ...current,
            day: values.day,
            minimumThreshold: values.minimumThreshold,
          }));
          setScheduleOpen(false);
        }}
      />
    </div>
  );
}
