import Modal from "../Modal";
import WithdrawStep1 from "./WithdrawFunds1";
import WithdrawStep2 from "./WithdrawFunds2";
import WithdrawStep3 from "./WithdrawFunds3";
import { useState } from "react";

export default function WithdrawFundsModal({ isOpen, onClose, availableBalance = 100000 }) {
  const [step, setStep] = useState(1);
  const [withdrawalInfo, setWithdrawalInfo] = useState({
    amount: 0,
    accountName: "Phil Crook",
    bankName: "Providus Bank",
    accountNumber: "****221",
  });

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);
  
  const handleConfirm = async () => {
    // TODO: Call API to process withdrawal
    console.log("Processing withdrawal:", withdrawalInfo);
    /*
    try {
      await axios.post(`${API_URL}/wallet/withdraw`, {
        amount: withdrawalInfo.amount,
        accountNumber: withdrawalInfo.fullAccountNumber
      });
      setStep(3);
    } catch (error) {
      console.error("Withdrawal error:", error);
    }
    */
    setStep(3);
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
        />
      )}
      
      {step === 2 && (
        <WithdrawStep2
          onBack={handleBack}
          onConfirm={handleConfirm}
          withdrawalInfo={withdrawalInfo}
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