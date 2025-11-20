import { Bot, Send } from "lucide-react";

export default function ChatBotUI() {
  return (
    <div className="flex flex-col h-full">

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">

        {/* Bot Bubble */}
        <div className="flex items-start gap-3">
          <div className="bg-[#066c39]/10 p-2 rounded-full">
            <Bot className="text-[#066c39]" size={22} />
          </div>

          <div className="bg-gray-100 px-4 py-3 rounded-xl max-w-xs">
            <p className="font-semibold text-sm">Hello Phil! My name is SabiGuy.</p>
            <p className="text-sm mt-1">
              How may I help you today?
              <br />
              (Please select an option)
            </p>

            {/* Options */}
            <div className="flex gap-3 mt-4">
              <button className="bg-[#d8eecf] text-sm px-3 py-2 rounded-lg">
                I would like to speak to an agent
              </button>

              <button className="bg-[#d8eecf] text-sm px-3 py-2 rounded-lg">
                I have an issue with my account
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Input */}
      <div className="border-t p-3 flex items-center gap-3">
        <input
          type="text"
          placeholder="Type your message"
          className="flex-1 border rounded-xl px-4 py-2 outline-none"
        />
        <button className="p-3 bg-[#066c39] rounded-xl">
          <Send className="text-white" />
        </button>
      </div>
    </div>
  );
}
