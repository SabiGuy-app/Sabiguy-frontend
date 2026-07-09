import { useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
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

  return (
    <>
      {/* ─── Floating Action Button ─── */}
      {!isOpen && (
        <button
          type="button"
          title="Chat with SabiBot"
          aria-label="Open SabiBot chat assistant"
          onClick={() => setIsOpen(true)}
          className="group fixed bottom-5 right-4 z-[60] sm:bottom-6 sm:right-6"
        >
          {/* Pulse ring — sits behind the button */}
          <span
            className="sabibot-pulse-ring absolute inset-0"
            style={{ 
              borderRadius: "2.5rem 2.5rem 0.75rem 2.5rem",
              background: "radial-gradient(circle, rgba(49, 120, 77, 0.25) 0%, transparent 70%)" 
            }}
            aria-hidden="true"
          />

          {/* Main Glassy Droplet button */}
          <span
            className="relative flex h-14 w-14 sm:h-[68px] sm:w-[68px] items-center justify-center transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105"
            style={{
              // Glassmorphism background with a light green tint
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(235, 245, 238, 0.7) 100%)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              // Water-drop / chat bubble shape (points to bottom right)
              borderRadius: "2.5rem 2.5rem 0.75rem 2.5rem",
              // Clean border and soft inner/outer shadow for 3D glass feel
              border: "1.5px solid rgba(255, 255, 255, 0.9)",
              boxShadow: "inset 0 4px 6px rgba(255, 255, 255, 0.8), inset 0 -2px 10px rgba(49, 120, 77, 0.05), 0 12px 30px -5px rgba(49, 120, 77, 0.15), 0 8px 12px -6px rgba(49, 120, 77, 0.1)",
            }}
          >
            {/* Optional subtle orange accent glow inside the glass */}
            <span className="absolute -bottom-2 -left-2 w-1/2 h-1/2 bg-orange-400/10 rounded-full blur-md" />

            {/* Animated Lottie Bot icon */}
            <Player
              autoplay
              loop
              src="/assets/animations/chatbot.json"
              style={{ height: '145%', width: '145%', objectFit: 'cover' }}
              className="relative z-10"
            />

            {/* Online indicator dot - shifted slightly due to new droplet shape */}
            <span
              className="absolute right-1 top-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full border-2 border-white shadow-sm z-20"
              style={{ background: "#4ADE80" }}
              aria-hidden="true"
            >
              <span className="block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white" />
            </span>
          </span>

          {/* Tooltip — desktop only */}
          <span
            className="pointer-events-none absolute right-full top-1/2 mr-4 hidden -translate-y-1/2 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 sm:block"
            style={{
              background: "linear-gradient(135deg, #31784D 0%, #1e5c38 100%)",
            }}
            aria-hidden="true"
          >
            Chat with SabiBot
            {/* Tooltip arrow */}
            <span className="absolute right-0 top-1/2 -mr-1 -translate-y-1/2 border-4 border-transparent border-l-[#1e5c38]" />
          </span>
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
