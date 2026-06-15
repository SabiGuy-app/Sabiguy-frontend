import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Modal from "../Modal";
import { updateProviderBankInfo } from "../../api/provider";
import { useAuthStore } from "../../stores/auth.store";
import { Save } from "lucide-react";

export default function AddBankDetails({ isOpen, onClose }) {
  const { user, updateUser } = useAuthStore();
  const [banks, setBanks] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [verifyingAccount, setVerifyingAccount] = useState(false);
  const [wasJustVerified, setWasJustVerified] = useState(false);
  const [isSavingBank, setIsSavingBank] = useState(false);
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
    bankCode: "",
  });
  const verifyAbortRef = useRef(null);
  const bankDropdownRef = useRef(null);

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

  useEffect(() => {
    const fetchBanks = async () => {
      if (!isOpen) return;

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
          setBanks(
            data.data.map((bank) => ({
              name: bank.name,
              code: bank.code,
            })),
          );
        }
      } catch (error) {
        console.error("Fetch banks error:", error);
        toast.error("Failed to load banks. Please try again.");
      } finally {
        setLoadingBanks(false);
      }
    };

    fetchBanks();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const currentUser = user?.data || {};
    const initialBankName = currentUser.bankName || "";

    setBankInfo({
      bankName: currentUser.bankName || "",
      accountNumber: currentUser.accountNumber || "",
      accountName: currentUser.accountName || "",
      bankCode: currentUser.bankCode || "",
    });
    setSearchQuery(initialBankName);
    setWasJustVerified(false);
    setShowDropdown(false);
  }, [isOpen, user]);

  const filteredBanks = banks.filter((bank) =>
    bank.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const verifyAccountNumber = async (accountNumber, bankCode) => {
    if (!accountNumber || !bankCode || accountNumber.length !== 10) {
      setBankInfo((prev) => ({ ...prev, accountName: "" }));
      setWasJustVerified(false);
      return;
    }

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

      if (!response.ok || !data.success) {
        setBankInfo((prev) => ({ ...prev, accountName: "" }));
        toast.error(data.message || "Could not verify account details.");
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
      if (error.name === "AbortError") return;
      console.error("Verification error:", error);
      setBankInfo((prev) => ({ ...prev, accountName: "" }));
      toast.error("Verification service unavailable. Please try again.");
    } finally {
      setVerifyingAccount(false);
    }
  };

  const handleBankSelect = (bank) => {
    setBankInfo((prev) => ({
      ...prev,
      bankName: bank.name,
      bankCode: bank.code,
    }));
    setSearchQuery(bank.name);
    setShowDropdown(false);

    if (bankInfo.accountNumber.length === 10) {
      verifyAccountNumber(bankInfo.accountNumber, bank.code);
    }
  };

  const handleAccountNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setBankInfo((prev) => ({ ...prev, accountNumber: value }));

    if (value.length === 10 && bankInfo.bankCode) {
      verifyAccountNumber(value, bankInfo.bankCode);
    } else {
      setBankInfo((prev) => ({ ...prev, accountName: "" }));
      setWasJustVerified(false);
    }
  };

  const handleSaveBankInfo = async () => {
    try {
      if (
        !bankInfo.bankName ||
        !bankInfo.accountNumber ||
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

      if (user?.data) {
        updateUser({
          data: {
            ...user.data,
            accountName: bankInfo.accountName,
            accountNumber: bankInfo.accountNumber,
            bankName: bankInfo.bankName,
            bankCode: bankInfo.bankCode,
          },
        });
      }

      toast.success("Bank info updated successfully");
      onClose();
    } catch (error) {
      console.error("Failed to update bank info:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update bank details",
      );
    } finally {
      setIsSavingBank(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Bank Details">
      <p className="text-sm text-gray-500 mb-6">
        Add the bank account you want withdrawals sent to.
      </p>

      <div className="space-y-4">
        <div className="relative" ref={bankDropdownRef}>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Bank Name
          </label>
          <input
            type="text"
            placeholder={loadingBanks ? "Loading banks..." : "Search for your bank"}
            value={searchQuery}
            disabled={loadingBanks}
            onChange={(e) => {
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
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#8BC53F]"
          />

          {showDropdown && searchQuery && filteredBanks.length > 0 && (
            <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
              {filteredBanks.map((bank) => (
                <div
                  key={bank.code}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleBankSelect(bank);
                  }}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
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
              <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-500 shadow-lg">
                No banks found
              </div>
            )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Account Number
            </label>
            <input
              type="text"
              name="accountNumber"
              value={bankInfo.accountNumber}
              onChange={handleAccountNumberChange}
              placeholder="Enter 10-digit account number"
              disabled={!bankInfo.bankCode}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#8BC53F] disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Account Name
            </label>
            <input
              type="text"
              name="accountName"
              value={bankInfo.accountName}
              disabled
              placeholder={
                verifyingAccount ? "Verifying..." : "Auto-filled after verification"
              }
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-gray-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#8BC53F] disabled:cursor-not-allowed"
            />
            {verifyingAccount && (
              <p className="mt-1 text-sm text-blue-500">
                Verifying account number...
              </p>
            )}
            {bankInfo.accountName && !verifyingAccount && wasJustVerified && (
              <p className="mt-1 text-sm text-green-600">Account verified</p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSaveBankInfo}
            disabled={isSavingBank || !bankInfo.accountName || verifyingAccount}
            className="inline-flex items-center gap-2 rounded-lg bg-[#005823] px-6 py-2.5 font-medium text-white transition-colors hover:bg-[#004019] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSavingBank ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Save size={18} />
            )}
            Save Bank Details
          </button>
        </div>
      </div>
    </Modal>
  );
}
