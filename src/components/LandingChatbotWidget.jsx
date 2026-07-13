import { useState, useEffect } from "react";
import { publicChatbotService } from "../api/chat";
import ChatBotDrawer from "./dashboard/ChatBoxDrawer";
import ChatBotUI from "./dashboard/ChatBotUI";

const publicFaqs = [
  "What services does SabiGuy offer?",
  "How do I book a service?",
  "How does pricing work?",
  "Can I send packages with SabiGuy?",
  "How do I become a provider?",
];

export default function LandingChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  // Defer GIF load until browser is idle — avoids competing with page resources
  const [gifReady, setGifReady] = useState(false);

  useEffect(() => {
    const load = () => setGifReady(true);
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(load, { timeout: 3000 });
      return () => cancelIdleCallback(id);
    } else {
      // Fallback for Safari: defer by 2.5s
      const t = setTimeout(load, 2500);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <>
      {/* ─── Floating Action Button ─── */}
      {!isOpen && (
        <button
          type="button"
          title=""
          aria-label="Open SabiBot chat assistant"
          onClick={() => setIsOpen(true)}
          className="group fixed bottom-5 right-4 z-[60] sm:bottom-6 sm:right-6"
        >
          {/* No background pulse ring, just the clean icon */}

          {/* Bot icon wrapper — no background, just the animation */}
          <span
            className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105"
          >
            {gifReady ? (
              /* Video loads after browser is idle */
              <video
                src="/assets/animations/KhloeSAC.webm"
                width="100"
                height="100"
                autoPlay
                loop
                muted
                playsInline
                className="relative z-10 h-full w-full object-contain drop-shadow-xl"
              />
            ) : (
              /* Empty transparent placeholder to reserve space while waiting for idle */
              <span
                className="relative z-10 flex h-16 w-16 sm:h-20 sm:w-20"
                aria-hidden="true"
              />
            )}

            {/* Online indicator dot */}
            <span
              className="absolute right-0 top-0 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full border-2 border-white shadow-sm z-20"
              style={{ background: "#4ADE80" }}
              aria-hidden="true"
            >
              <span className="block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white" />
            </span>
          </span>

          {/* Tooltip — desktop only */}

        </button>
      )}

      {/* ─── Chat Modal ─── */}
      <ChatBotDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="SabiBot"
        subtitle="Ask about services, pricing, and sign up."
        showOverlay
        overlayClassName={`fixed inset-0 z-[65] bg-black/15 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        panelClassName={[
          /* Base — mobile bottom-sheet */
          "fixed z-[70] flex flex-col bg-white shadow-2xl",
          "bottom-0 left-1 right-1 rounded-t-2xl",
          "h-[75vh] max-h-[520px]",
          /* sm+ (≥640px) — floating widget bottom-right */
          "sm:left-auto sm:bottom-6 sm:right-6",
          "sm:w-[380px] sm:h-[520px] sm:max-h-[calc(100vh-3rem)]",
          "sm:rounded-2xl",
          /* Shared polish */
          "border border-gray-200/60",
          "ring-1 ring-black/[0.04]",
          /* Visibility fix for closed state */
          "transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        ].join(" ")}
        headerClassName="flex items-center justify-between gap-3 border-b border-gray-100 bg-white px-4 py-3 sm:px-5 sm:py-3.5 rounded-t-2xl sm:rounded-t-2xl"
      >
        {isOpen && (
          <ChatBotUI
            userType="public"
            chatbotService={publicChatbotService}
            visitorName="Website visitor"
            initialFaqs={publicFaqs}
            showHumanSupport={false}
          />
        )}
      </ChatBotDrawer>
    </>
  );
}
