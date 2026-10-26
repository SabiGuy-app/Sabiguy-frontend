import { useEffect, useRef, useState } from "react";
import { Save } from "lucide-react";
import toast from "react-hot-toast";
import { updateProviderBankInfo } from "../../api/provider";
import { useAuthStore } from "../../stores/auth.store";

// Payout account management lives in Wallet. Verification and saving use the existing APIs.
export default function ProviderBankDetails({ profile: suppliedProfile }) {
  const { user, updateUser } = useAuthStore();
  const profile = suppliedProfile || user?.data;
  const [bankInfo, setBankInfo] = useState({
    bankName: profile?.bankName || "",
    accountNumber: profile?.accountNumber || "",
    accountName: profile?.accountName || "",
    bankCode: profile?.bankCode || "",
  });
  const [isSavingBank, setIsSavingBank] = useState(false);

  // --- Bank Verification State ---
  const [banks, setBanks] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [searchQuery, setSearchQuery] = useState(profile?.bankName || "");
  const [showDropdown, setShowDropdown] = useState(false);
  const [verifyingAccount, setVerifyingAccount] = useState(false);
  const [wasJustVerified, setWasJustVerified] = useState(false);
  const verifyAbortRef = useRef(null);
  const bankDropdownRef = useRef(null);
  const editedRef = useRef(false);

  // Fresh profile data can arrive after Wallet mounts; preserve any in-progress edits.
  useEffect(() => {
    if (editedRef.current) return;
    setBankInfo({
      bankName: profile?.bankName || "", accountNumber: profile?.accountNumber || "",
      accountName: profile?.accountName || "", bankCode: profile?.bankCode || "",
    });
    setSearchQuery(profile?.bankName || "");
  }, [profile?.bankName, profile?.accountNumber, profile?.accountName, profile?.bankCode]);

  useEffect(() => () => verifyAbortRef.current?.abort(), []);

  // Click-outside handler for bank dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        bankDropdownRef.current &&
        !bankDropdownRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  // Fetch banks on mount
  useEffect(() => {
    const fetchBanks = async () => {
      setLoadingBanks(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/payment/banks`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        const data = await response.json();
        if (data.success) {
          const bankList = data.data.map((bank) => ({
            name: bank.name,
            code: bank.code,
          }));
          setBanks(bankList);

          // Auto-resolve bankCode if it was missing from backend profile
          setBankInfo((previous) => {
            if (!previous.bankName || previous.bankCode) return previous;
            const match = bankList.find((bank) => bank.name.toLowerCase() === previous.bankName.toLowerCase());
            return match ? { ...previous, bankCode: match.code } : previous;
          });
        }
      } catch (error) {
        console.error("Fetch banks error:", error);
      } finally {
        setLoadingBanks(false);
      }
    };
    fetchBanks();
  }, []);

  const filteredBanks = banks.filter((bank) =>
    bank.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const verifyAccountNumber = async (accountNumber, bankCode) => {
    verifyAbortRef.current?.abort();
    verifyAbortRef.current = null;
    setBankInfo((previous) => ({ ...previous, accountName: "" }));
    if (!accountNumber || !bankCode || accountNumber.length !== 10) {
      setBankInfo((prev) => ({ ...prev, accountName: "" }));
      setWasJustVerified(false);
      setVerifyingAccount(false);
      return;
    }

    // Cancel any in-flight verification request
    if (verifyAbortRef.current) {
      verifyAbortRef.current.abort();
    }
    const controller = new AbortController();
    verifyAbortRef.current = controller;

    setVerifyingAccount(true);
    setWasJustVerified(false);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/payment/verify-bank`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ accountNumber, bankCode }),
          signal: controller.signal,
        },
      );

      const data = await response.json();
      if (controller.signal.aborted) return;

      if (!response.ok || !data.success) {
        const errMsg =
          data.message || `Server returned ${response.status} error`;
        setBankInfo((prev) => ({ ...prev, accountName: "" }));
        toast.error(errMsg);
        return;
      }

      const fetchedName = data.data?.accountName;
      if (fetchedName) {
        setBankInfo((prev) => ({ ...prev, accountName: fetchedName }));
        setWasJustVerified(true);
      } else {
        setBankInfo((prev) => ({ ...prev, accountName: "" }));
        toast.error("Could not retrieve account name.");
      }
    } catch (error) {
      if (error.name === "AbortError" || controller.signal.aborted) return;
      console.error("Verification error:", error);
      setBankInfo((prev) => ({ ...prev, accountName: "" }));
      toast.error("Verification service unavailable. Please try again.");
    } finally {
      if (verifyAbortRef.current === controller) {
        setVerifyingAccount(false);
        verifyAbortRef.current = null;
      }
    }
  };

  const handleBankSelect = (bank) => {
    editedRef.current = true;
    setBankInfo((prev) => ({
      ...prev,
      bankName: bank.name,
      bankCode: bank.code,
      accountName: "",
    }));
    setSearchQuery(bank.name);
    setShowDropdown(false);

    verifyAccountNumber(bankInfo.accountNumber, bank.code);
  };

  const handleAccountNumberChange = (e) => {
    editedRef.current = true;
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setBankInfo((prev) => ({ ...prev, accountNumber: value }));

    verifyAccountNumber(value, bankInfo.bankCode);
  };

  const handleSaveBankInfo = async () => {
    if (isSavingBank || verifyingAccount) return;
    try {
      if (
        !bankInfo.bankName ||
        !bankInfo.bankCode || bankInfo.accountNumber.length !== 10 ||
        !bankInfo.accountName
      ) {
        toast.error("Please fill all bank details");
        return;
      }
      setIsSavingBank(true);
      await updateProviderBankInfo({
        accountName: bankInfo.accountName,
        accountNumber: bankInfo.accountNumber,
        bankName: bankInfo.bankName,
        bankCode: bankInfo.bankCode,
      });

      editedRef.current = false;
      if (user && user.data) {
        updateUser((current) => ({
          ...current,
          data: {
            ...current.data,
            accountName: bankInfo.accountName,
            accountNumber: bankInfo.accountNumber,
            bankName: bankInfo.bankName,
            bankCode: bankInfo.bankCode,
          },
        }));
      }

      toast.success("Bank info updated successfully");
    } catch (error) {
      console.error("Failed to update bank info:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update internal bank info",
      );
    } finally {
      setIsSavingBank(false);
    }
  };

  return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">Bank Account Details</h2>
          <p className="text-sm text-gray-500 mb-6">
            Setup where you receive your payouts
          </p>

          <div className="space-y-4">
            {/* Bank Name with Dropdown */}
            <div className="relative" ref={bankDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name
              </label>
              <input
                type="text"
                placeholder={
                  loadingBanks ? "Loading banks..." : "Search for your bank"
                }
                value={searchQuery}
                disabled={loadingBanks}
                onChange={(e) => {
                  editedRef.current = true;
                  verifyAbortRef.current?.abort();
                  verifyAbortRef.current = null;
                  setVerifyingAccount(false);
                  setWasJustVerified(false);
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                  if (e.target.value !== bankInfo.bankName) {
                    setBankInfo((prev) => ({
                      ...prev,
                      bankName: "",
                      bankCode: "",
                      accountName: "",
                    }));
                  }
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent bg-gray-50"
              />

              {showDropdown && searchQuery && filteredBanks.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredBanks.map((bank) => (
                    <div
                      key={bank.code}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleBankSelect(bank);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {bank.name}
                    </div>
                  ))}
                </div>
              )}
              {showDropdown &&
                searchQuery &&
                filteredBanks.length === 0 &&
                !loadingBanks && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg px-4 py-2 text-gray-500">
                    No banks found
                  </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={bankInfo.accountNumber}
                  onChange={handleAccountNumberChange}
                  placeholder="Enter 10-digit account number"
                  disabled={!bankInfo.bankCode}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent bg-gray-50 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  name="accountName"
                  value={bankInfo.accountName}
                  disabled={true}
                  placeholder={
                    verifyingAccount
                      ? "Verifying..."
                      : "Auto-filled after verification"
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent bg-gray-100 text-gray-700 disabled:cursor-not-allowed"
                />
                {verifyingAccount && (
                  <p className="text-blue-500 text-sm mt-1">
                    ⏳ Verifying account number...
                  </p>
                )}
                {bankInfo.accountName &&
                  !verifyingAccount &&
                  wasJustVerified && (
                    <p className="text-green-600 text-sm mt-1">
                      ✓ Account verified
                    </p>
                  )}
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={handleSaveBankInfo}
                disabled={
                  isSavingBank || !bankInfo.accountName || !bankInfo.bankCode || bankInfo.accountNumber.length !== 10 || verifyingAccount
                }
                className="px-6 py-2.5 bg-[#005823] text-white font-medium rounded-lg hover:bg-[#004019] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSavingBank ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save size={18} />
                )}
                Save Bank Details
              </button>
            </div>
          </div>
        </div>
  );
}
