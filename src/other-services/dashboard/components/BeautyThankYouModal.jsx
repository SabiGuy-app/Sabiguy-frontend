import { Check, Navigation, X } from "lucide-react";
import Modal from "../../../components/Modal";

export default function BeautyThankYouModal({
  providerName,
  onClose,
  onRefer,
}) {
  return (
    <Modal
      isOpen
      onClose={onClose}
      showCloseButton={false}
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4"
      panelClassName="relative w-full max-w-[520px] rounded-2xl bg-white px-6 py-10 shadow-xl sm:px-10"
      contentClassName="text-[#231F20]"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close thank you modal"
        className="absolute right-6 top-5 text-[#231F20BF] hover:text-[#231F20]"
      >
        <X size={20} />
      </button>
      <div className="flex flex-col items-center text-center">
        <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#2F7B4F] text-white">
          <Check size={42} strokeWidth={4} />
        </span>
        <h2 className="text-2xl font-bold text-[#231F20]">Thank you!</h2>
        <p className="mt-3 text-base text-[#231F20A6]">
          Your service with {providerName} is now complete.
        </p>
        <p className="mt-8 text-sm italic text-[#231F2080]">
          Help a friend get started
        </p>
        <button
          type="button"
          onClick={onRefer}
          className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-[#2F7B4F] hover:text-[#005823]"
        >
          Refer &amp; Earn
          <Navigation size={15} />
        </button>
      </div>
    </Modal>
  );
}
