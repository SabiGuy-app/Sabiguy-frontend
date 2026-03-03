import Modal from "../Modal";
import WithdrawStep1 from "./WithdrawFunds1";
import WithdrawStep2 from "./WithdrawFunds2";
import WithdrawStep3 from "./WithdrawFunds3";
import { useState, useEffect } from "react";
import { useAuthStore } from "../../stores/auth.store";
import { withdrawFromWallet } from "../../api/provider";
import toast from "react-hot-toast";

export default function WithdrawFundsModal({ isOpen, onClose, availableBalance = 100000 }) {
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [withdrawalInfo, setWithdrawalInfo] = useState({
    amount: 0,
    accountName: user?.data?.accountName || "",
    bankName: user?.data?.bankName || "",
    accountNumber: user?.data?.accountNumber || "",
  });

  const hasBankDetails = !!(withdrawalInfo.accountName && withdrawalInfo.bankName && withdrawalInfo.accountNumber);

  // Sync state if user data dynamically loads after render
  useEffect(() => {
    if (user?.data?.accountName) {
      setWithdrawalInfo(prev => ({
        ...prev,
        accountName: user.data.accountName,
        bankName: user.data.bankName,
        accountNumber: user.data.accountNumber,
      }));
    }
  }, [user]);

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      const response = await withdrawFromWallet(withdrawalInfo.amount);
      if (response?.success) {
        setStep(3);
      } else {
        toast.error(response?.message || "Withdrawal failed. Please try again.");
      }
    } catch (error) {
      const message = error?.response?.data?.message || error.message || "Withdrawal failed. Please try again.";
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const getTitle = () => {
    switch (step) {
      case 1: return "Withdraw Funds";
      case 2: return "Withdrawal to Bank";
      case 3: return "Withdrawal Successful";
      default: return "Withdraw Funds";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={getTitle()}
      showCloseButton={step !== 3}
    >
      {step === 1 && (
        <WithdrawStep1
          onNext={handleNext}
          availableBalance={availableBalance}
          withdrawalInfo={withdrawalInfo}
          setWithdrawalInfo={setWithdrawalInfo}
          hasBankDetails={hasBankDetails}
        />
      )}

      {step === 2 && (
        <WithdrawStep2
          onBack={handleBack}
          onConfirm={handleConfirm}
          withdrawalInfo={withdrawalInfo}
          isProcessing={isProcessing}
        />
      )}

      {step === 3 && (
        <WithdrawStep3
          onClose={handleClose}
          withdrawalInfo={withdrawalInfo}
        />
      )}
    </Modal>
  );
}