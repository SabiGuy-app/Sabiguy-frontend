import { BotIcon, X } from "lucide-react";

export default function ChatBotDrawer({
  isOpen,
  onClose,
  children,
  title = "SabiBot (Your Friendly Chat Bot)",
  subtitle = "",
  showOverlay = false,
  overlayClassName = "",
  panelClassName = "",
  headerClassName = "",
  contentClassName = "",
}) {
  const panelClasses =
    panelClassName ||
    "fixed top-0 right-0 h-full w-[90%] md:w-[450px] bg-white shadow-xl z-50 rounded-l-3xl flex flex-col";

  return (
    <>
      {showOverlay && isOpen && (
        <button
          type="button"
          aria-label="Close chatbot"
          onClick={onClose}
          className={overlayClassName || "fixed inset-0 z-[49] bg-black/30 backdrop-blur-[2px]"}
        />
      )}

      <div
        role="dialog"
        aria-modal={showOverlay ? "true" : undefined}
        aria-hidden={!isOpen}
        className={`${panelClasses} transform transition-transform duration-500 ${
          isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        <div
          className={
            headerClassName ||
            "flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100"
          }
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-[#066c39]">
              <BotIcon size={20} />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-gray-900 sm:text-lg">
                {title}
              </h2>
              {subtitle && (
                <p className="truncate text-xs text-gray-500">{subtitle}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chatbot"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#066c39]/30"
          >
            <X size={20} />
          </button>
        </div>

        <div className={contentClassName || "flex-1 min-h-0"}>{children}</div>
      </div>
    </>
  );
}
