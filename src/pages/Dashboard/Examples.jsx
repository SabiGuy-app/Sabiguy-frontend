import RateExperienceModal from "../../components/dashboard/RateExperience";
import ReportIssue from "../../components/dashboard/ReportIssueModal";
import CancellationReasonModal from "../../components/dashboard/CancellationReason";
import CancellationDescriptionModal from "../../components/dashboard/CancellationDescription";
import CancellationPendingModal from "../../components/dashboard/CancellationPending";
import { useState } from "react";
import ServiceCompleted from "../../components/dashboard/ServiceCompleted";

export default function ReviewModalsExample() {
  const [showRateModal, setShowRateModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showCancelStep1, setShowCancelStep1] = useState(false);
  const [showCancelStep2, setShowCancelStep2] = useState(false);
  const [showCancelStep3, setShowCancelStep3] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);


  const handleCancelNext = (reason) => {
    setShowCancelStep1(false);
    if (reason === "other") {
      setShowCancelStep2(true);
    } else {
      setShowCancelStep3(true);
    }
  };

  const handleDescriptionNext = (description) => {
    console.log("Description:", description);
    setShowCancelStep2(false);
    setShowCancelStep3(true);
  };

  return (
    <div className="p-8 space-y-4">
      <button
        onClick={() => setShowRateModal(true)}
        className="px-6 py-3 bg-[#005823] text-white rounded-lg"
      >
        Open Rate Experience
      </button>
      <button
        onClick={() => setShowReportModal(true)}
        className="px-6 py-3 bg-red-500 text-white rounded-lg"
      >
        Open Report Issue
      </button>
      <button
        onClick={() => setShowCancelStep1(true)}
        className="px-6 py-3 bg-gray-700 text-white rounded-lg"
      >
        Open Cancellation Flow
      </button>

      <RateExperienceModal
        isOpen={showRateModal}
        onClose={() => setShowRateModal(false)}
      />

      <ReportIssue
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
      />

      <CancellationReasonModal
        isOpen={showCancelStep1}
        onClose={() => setShowCancelStep1(false)}
        onNext={handleCancelNext}
      />

      <CancellationDescriptionModal
        isOpen={showCancelStep2}
        onClose={() => setShowCancelStep2(false)}
        onBack={() => {
          setShowCancelStep2(false);
          setShowCancelStep1(true);
        }}
        onNext={handleDescriptionNext}
      />

      <CancellationPendingModal
        isOpen={showCancelStep3}
        onClose={() => setShowCancelStep3(false)}
      />
    </div>
  );
}