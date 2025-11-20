import { MessageSquare } from "lucide-react";

export default function ContactSection({ openChat }) {
  return (
<div className="w-full rounded-t-3xl text-white pb-32 pt-20 px-10 
     bg-[linear-gradient(#066c39_50%,white_50%)]">      {/* Top Text */}
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
        <p className="text-lg max-w-xl">
          Need assistance or have an inquiry?
          <br />
          Contact us and we will be more than happy to assist you.
        </p>

        {/* Floating Card */}
        <div className="mt-10 bg-[#066c39] border border-white/40 rounded-xl p-10 flex flex-col md:flex-row gap-10 shadow-lg">
          
          {/* Left: Call */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Call us</h2>
            <p className="text-sm text-gray-200 mb-4">
              Feel free to reach our operators on this line
            </p>

            <p className="text-lg font-semibold">+234 816 778 3930</p>

            <p className="text-sm mt-4">Monday – Friday (7AM – 7PM)</p>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px bg-white/40"></div>

          {/* Right: Chat Now */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Chat Now</h2>
            <p className="text-sm text-gray-200 mb-4">
              Chat for a quick reply on any issue or problems you encounter
            </p>

            <button
              onClick={openChat}
              className="flex items-center gap-2 border border-white bg-white text-[#066c39] font-semibold px-5 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <MessageSquare size={18} />
              Chat Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
