import React, { useEffect } from "react";

function Modal({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  overlayClassName = "",
  panelClassName = "",
  titleClassName = "",
  contentClassName = "",
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={
        overlayClassName ||
        "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
      }
      role="dialog"
      aria-modal="true"
    >
      <div
        className={
          panelClassName ||
          "bg-white rounded-2xl shadow-lg w-[90%] sm:w-[80%] md:w-[600px] max-h-[90vh] overflow-y-auto p-6 relative"
        }
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
          >
            x
          </button>
        )}

        {title && (
          <h2
            className={
              titleClassName ||
              "text-xl sm:text-2xl font-semibold text-center mb-4"
            }
          >
            {title}
          </h2>
        )}

        <div className={contentClassName || "text-gray-700"}>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
