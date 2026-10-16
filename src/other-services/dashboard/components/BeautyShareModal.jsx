import { useState } from "react";
import { Copy, X } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import Modal from "../../../components/Modal";

export default function BeautyShareModal({ provider, onClose }) {
  const [copied, setCopied] = useState(false);

  const profileLink = `${window.location.origin}${provider.profilePath}`;
  const shareText = encodeURIComponent(`Book ${provider.fullName} on SabiGUY: ${profileLink}`);
  const encodedProfileLink = encodeURIComponent(profileLink);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileLink);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      showCloseButton={false}
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4"
      panelClassName="relative w-full max-w-[520px] rounded-2xl bg-white px-6 py-7 shadow-xl sm:px-8"
      contentClassName="text-[#231F20]"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close share modal"
        className="absolute right-6 top-5 text-[#231F20BF] hover:text-[#231F20]"
      >
        <X size={20} />
      </button>
      <h2 className="text-2xl font-medium text-[#231F20]">Send via</h2>
      <div className="mt-10 flex items-center justify-center gap-9 sm:gap-14">
        <a href={`https://wa.me/?text=${shareText}`} target="_blank" rel="noreferrer" aria-label="Share on WhatsApp"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#22D549] text-white transition-transform hover:scale-105">
          <FaWhatsapp size={38} />
        </a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedProfileLink}`} target="_blank" rel="noreferrer" aria-label="Share on Facebook"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1877F2] text-white transition-transform hover:scale-105">
          <FaFacebookF size={36} />
        </a>
        <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Open Instagram"
          className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-gradient-to-tr from-[#FEDA75] via-[#D62976] to-[#4F5BD5] text-white transition-transform hover:scale-105">
          <FaInstagram size={38} />
        </a>
        <a href={`https://t.me/share/url?url=${encodedProfileLink}&text=${shareText}`} target="_blank" rel="noreferrer" aria-label="Share on Telegram"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2AA7DF] text-white transition-transform hover:scale-105">
          <FaTelegramPlane size={34} />
        </a>
      </div>
      <div className="my-5 text-center text-sm text-[#231F2080]">OR</div>
      <button
        type="button"
        onClick={copyLink}
        className="mx-auto flex items-center gap-2 text-sm font-medium text-[#2F7B4F] hover:text-[#005823]"
      >
        {copied ? "Invite link copied" : "Copy Invite link"}
        <Copy size={16} />
      </button>
    </Modal>
  );
}