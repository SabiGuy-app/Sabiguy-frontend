import Modal from "../Modal";
import { ShieldAlert } from "lucide-react";

export default function KycVerificationModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="KYC verification in progress">
      <div className="flex flex-col items-center text-center py-2">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <ShieldAlert size={32} />
        </div>

        <p className="max-w-md text-sm leading-7 text-gray-600 sm:text-base">
          Our team is reviewing your KYC. We&apos;ll be sure to let you know
          when your KYC has been verified. For now, availability cannot be
          turned on yet, but booking alerts will be available as soon as
          verification is complete.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#005823] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#00461d]"
        >
          Okay
        </button>
      </div>
    </Modal>
  );
}
