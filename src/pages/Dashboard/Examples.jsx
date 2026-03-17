import ReportIssue from "../../components/dashboard/ReportIssueModal";
import CancellationReasonModal from "../../components/dashboard/CancellationReason";
import CancellationDescriptionModal from "../../components/dashboard/CancellationDescription";
import CancellationPendingModal from "../../components/dashboard/CancellationPending";
import ReviewModal from "../../components/dashboard/ReviewModal";
import { useState } from "react";

export default function ReviewModalsExample() {
  const [showReportModal, setShowReportModal] = useState(false);
  const [showCancelStep1, setShowCancelStep1] = useState(false);
  const [showCancelStep2, setShowCancelStep2] = useState(false);
  const [showCancelStep3, setShowCancelStep3] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

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

  const handleReviewSubmit = (data) => {
    console.log("Review submitted in example:", data);
    setShowReviewModal(false);
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold mb-6">Component Preview Page (/eng)</h1>
      
      <div className="space-x-4">
        <button
          onClick={() => setShowReviewModal(true)}
          className="px-6 py-3 bg-[#005823] text-white rounded-lg hover:bg-[#1f4a2a] transition-colors"
        >
          Open Review & Tip Modal
        </button>
        
        <button
          onClick={() => setShowReportModal(true)}
          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Open Report Issue
        </button>
        
        <button
          onClick={() => setShowCancelStep1(true)}
          className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Open Cancellation Flow
        </button>
      </div>

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleReviewSubmit}
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