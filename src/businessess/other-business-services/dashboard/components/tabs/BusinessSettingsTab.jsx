import { useEffect, useState } from "react";
import SettingsTabCard, {
  EditableSettingsSection,
  SettingsEditDialog,
  SettingsRow,
} from "./SettingsTabCard";
import {
  getBanks,
  updateServiceDetails,
  verifyBankAccount,
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
    accountName: business?.accountName ?? "",
    accountNumber: business?.accountNumber ?? "",
    bankName: business?.bankName ?? "",
    bankCode: business?.bankCode ?? "",
  });
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [bankDraft, setBankDraft] = useState(payout);
  const [banks, setBanks] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [verifyingBank, setVerifyingBank] = useState(false);
  const [bankError, setBankError] = useState("");
  const [payoutSchedule, setPayoutSchedule] = useState(() => ({
    automatic: business?.payoutSchedule?.automatic ?? false,
    day: business?.payoutSchedule?.day ?? "Friday",
    minimumThreshold: String(business?.payoutSchedule?.minimumThreshold ?? 0),
  }));
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [profileSaveError, setProfileSaveError] = useState("");

  useEffect(() => {
    setPayout({
      accountName: business?.accountName ?? "",
      accountNumber: business?.accountNumber ?? "",
      bankName: business?.bankName ?? "",
      bankCode: business?.bankCode ?? "",
    });
  }, [
    business?.accountName,
    business?.accountNumber,
    business?.bankName,
    business?.bankCode,
  ]);

  useEffect(() => {
    if (!business?.payoutSchedule) return;
    setPayoutSchedule({
      automatic: business.payoutSchedule.automatic ?? false,
      day: business.payoutSchedule.day ?? "Friday",
      minimumThreshold: String(
        business.payoutSchedule.minimumThreshold ?? 0,
      ),
    });
  }, [
    business?._id,
    business?.payoutSchedule,
    business?.payoutSchedule?.automatic,
    business?.payoutSchedule?.day,
    business?.payoutSchedule?.minimumThreshold,
  ]);

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

  const saveBusinessProfile = async (values) => {
    setProfileSaveError("");
    const payload = {
      service: business?.service ?? [],
      availableDays: business?.availableDays ?? [],
      businessHours: business?.businessHours ?? { start: "", end: "" },
      servicePlace: business?.servicePlace ?? [],
      studioImages: business?.studioImages ?? [],
      ...(business?.businessCategory
        ? { businessCategory: business.businessCategory }
        : {}),
      ...(values.businessName !== "__"
        ? { businessName: values.businessName }
        : {}),
      ...(values.address !== "__" ? { businessAddress: values.address } : {}),
    };

    try {
      const result = await updateServiceDetails(payload);
      onBusinessUpdate?.({
        ...result,
        ...(payload.businessName
          ? { BusinessName: payload.businessName }
          : {}),
        ...(payload.businessAddress
          ? { BusinessAddress: payload.businessAddress }
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
      <p className="mx-3 text-[9px] text-[#777777]">
        This endpoint saves the business name and address. Owner and city,
        operating defaults, and payout settings are not included in its update
        contract.
      </p>
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
              if (!bankDraft.accountName) {
                setBankError("Verify the account before saving.");
                return;
              }
              setPayout(bankDraft);
              setPayoutOpen(false);
            }}
          >
            <h2 className="text-base font-semibold text-[#242424]">
              Edit company payout account
            </h2>
            <div className="mt-5 space-y-3">
              <label className="block text-xs font-medium text-[#555555]">
                Bank
                <select
                  value={bankDraft.bankCode}
                  disabled={loadingBanks || verifyingBank}
                  onChange={(event) => {
                    const selectedBank = banks.find(
                      (bank) => bank.code === event.target.value,
                    );
                    setBankDraft((current) => ({
                      ...current,
                      bankName: selectedBank?.name ?? "",
                      bankCode: selectedBank?.code ?? "",
                      accountName: "",
                    }));
                  }}
                  className="mt-1.5 h-10 w-full rounded-md border border-[#D8D8D8] bg-white px-3 text-sm outline-none focus:border-[#347B54] disabled:opacity-60"
                >
                  <option value="">
                    {loadingBanks ? "Loading banks..." : "Select your bank"}
                  </option>
                  {banks.map((bank) => (
                    <option key={bank.code} value={bank.code}>
                      {bank.name}
                    </option>
                  ))}
                </select>
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
                  className="h-9 rounded-md bg-[#347B54] px-4 text-xs font-medium text-white hover:bg-[#286642]"
                >
                  Save
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
