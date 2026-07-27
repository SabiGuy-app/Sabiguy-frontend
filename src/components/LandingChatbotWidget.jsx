import { lazy, Suspense, useState } from "react";
import { publicChatbotService } from "../api/chat";
import ChatBotDrawer from "./dashboard/ChatBoxDrawer";

const ChatBotUI = lazy(() => import("./dashboard/ChatBotUI"));

const publicFaqs = [
  "What services does SabiGuy offer?",
  "How do I book a service?",
  "How does pricing work?",
  "Can I send packages with SabiGuy?",
  "How do I become a provider?",
];

function ChatbotLoading() {
  return (
    <div className="flex h-full flex-col bg-[#F7F9F8]">
      <div className="flex-1 space-y-4 px-4 py-5">
        <div className="flex items-end gap-2.5">
          <div className="h-8 w-8 rounded-full bg-emerald-100" />
          <div className="max-w-[78%] rounded-2xl rounded-bl-sm border border-gray-100 bg-white px-4 py-3 shadow-sm">
            <div className="mb-2 h-3 w-24 rounded-full bg-gray-100" />
            <div className="h-3 w-40 rounded-full bg-gray-100" />
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 bg-white px-4 py-3">
        <div className="h-11 rounded-2xl bg-gray-100" />
      </div>
    </div>
  );
}

function ChatbotLauncher({ onClick }) {
  return (
    <button
      type="button"
      aria-label="Open SabiBot chat assistant"
      onClick={onClick}
      className="group fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-[calc(0.75rem+env(safe-area-inset-right))] z-[60] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#8BC53F]/35 sm:bottom-6 sm:right-6 lg:bottom-7 lg:right-7"
    >
      <span className="relative flex h-[76px] w-[76px] items-center justify-center transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105 sm:h-20 sm:w-20 lg:h-24 lg:w-24">
        <video
          width="100"
          height="100"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="relative z-10 h-full w-full object-contain drop-shadow-xl"
        >
          <source src="/assets/animations/KhloeSAC.webm" type="video/webm" />
          <img
            src="/assets/animations/chatbot-green.gif"
            alt=""
            className="h-full w-full object-contain"
          />
        </video>
        <span
          className="absolute right-0 top-0 z-20 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-white bg-[#4ADE80] shadow-sm sm:h-4 sm:w-4"
          aria-hidden="true"
        >
          <span className="block h-1.5 w-1.5 rounded-full bg-white sm:h-2 sm:w-2" />
        </span>
      </span>
    </button>
  );
}

export default function LandingChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen && <ChatbotLauncher onClick={() => setIsOpen(true)} />}

      <ChatBotDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="SabiBot"
        subtitle="Ask about services, pricing, and sign up."
        showOverlay
        overlayClassName="fixed inset-0 z-[65] bg-transparent"
        panelClassName={[
          "fixed z-[70] flex flex-col overflow-hidden bg-white",
          "bottom-[calc(1rem+env(safe-area-inset-bottom))] left-3 right-3 h-[min(76dvh,520px)] max-h-[calc(100dvh-2rem)] rounded-[24px]",
          "border border-white/80 shadow-[0_24px_70px_rgba(0,0,0,0.22)] ring-1 ring-[#005823]/10",
          "transition-all duration-300 ease-out",
          "sm:left-auto sm:bottom-6 sm:right-6 sm:h-[min(72vh,540px)] sm:w-[380px] sm:max-h-[calc(100vh-3rem)] sm:rounded-[28px]",
          "md:w-[390px] lg:bottom-7 lg:right-7 lg:h-[min(70vh,560px)] lg:w-[400px]",
          isOpen
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-[0.98] opacity-0",
        ].join(" ")}
        headerClassName="flex shrink-0 items-center justify-between gap-3 border-b border-gray-100 bg-white px-4 py-3 sm:px-5"
        contentClassName="flex-1 min-h-0 overflow-hidden"
      >
        {isOpen && (
          <Suspense fallback={<ChatbotLoading />}>
            <ChatBotUI
              userType="public"
              chatbotService={publicChatbotService}
              visitorName="Website visitor"
              initialFaqs={publicFaqs}
              showHumanSupport
            />
          </Suspense>
        )}
      </ChatBotDrawer>
    </>
  );
}
