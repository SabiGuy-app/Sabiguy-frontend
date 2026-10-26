import { Clock3 } from "lucide-react";
import Modal from "../../Modal";
import Button from "../../button";

export default function ProductReviewModal({ onClose }) {
  return (
    <Modal isOpen onClose={onClose} title="Product under review"
      panelClassName="relative max-h-[calc(100dvh_-_2rem)] w-[90%] max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
      titleClassName="mb-4 pr-5 text-center text-xl font-semibold text-[#231F20]">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-700"><Clock3 size={28} /></div>
        <p className="text-sm leading-6 text-gray-600">Your product is under review. You’ll receive a notification once it’s approved.</p>
        <Button type="button" size="sm" onClick={onClose}>Got it</Button>
      </div>
    </Modal>
  );
}
