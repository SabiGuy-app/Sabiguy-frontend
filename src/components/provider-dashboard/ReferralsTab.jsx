import { useState } from "react";
import { Users } from "lucide-react";
import { FiCopy, FiCheck, FiShare2, FiUsers, FiAward } from "react-icons/fi";
import { FaWhatsapp, FaFacebookF, FaTelegramPlane } from "react-icons/fa";

export default function ReferralsTab () {
      const [copied, setCopied] = useState(false);


      const referralLink = "www.sabiguy.com/ref/RB4821";
  const referralHistory = [
    { email: "philcrook99@gmail.com", status: "Invite sent", statusColor: "text-yellow-600" },
    { email: "philcrook99@gmail.com", status: "Invite sent", statusColor: "text-yellow-600" },
    { email: "philcrook99@gmail.com", status: "Registered", statusColor: "text-gray-700" },
    { email: "philcrook99@gmail.com", status: "₦1,000", statusColor: "text-green-600" },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true)
    setTimeout(() => setCopied(false), 2000);
  };

   const handleShare = (platform) => {
    const text = `Join SabiGuy using my referral link: ${referralLink}`;
    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`,
    };
    
    window.open(urls[platform], '_blank');
  };

  return (
    <div>
    <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Referrals & Rewards</h1>
<p className="text-gray-600">
          Earn wallet credits when your friends sign up and complete their first service.
        </p>
    </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
<label className="block text-sm font-medium text-gray-900 mb-3">
          Copy your Invite link
        </label>
        <div className="flex gap-3 mb-6">
        <input
        type="text"
        value={referralLink}
        readOnly
        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8BC53F]"
        />
         <button
            onClick={handleCopy}
            className="px-6 py-3 bg-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
          >
            {copied ? (
              <>
                <FiCheck size={18} />
                Copied
              </>
            ) : (
              <>
                <FiCopy size={18} />
                Copy
              </>
            )}
          </button>
        </div>
       <div className="flex flex-col items-center">
          <span className="text-sm text-gray-600 mb-4">OR</span>
          <div className="flex gap-4">
            <button
              onClick={() => handleShare('whatsapp')}
              className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
            >
              <FaWhatsapp size={24} />
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
              <FaFacebookF size={20} />
            </button>
            <button
              onClick={() => handleShare('telegram')}
              className="w-12 h-12 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
            >
              <FaTelegramPlane size={20} />
            </button>
          </div>
        </div>
      </div>
 <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Referral history</h3>
        
        <div className="space-y-3">
          {referralHistory.map((referral, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
            >
              <span className="text-gray-900">{referral.email}</span>
              <span className={`font-medium ${referral.statusColor}`}>
                {referral.status}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-8">
         <h3 className="text-lg font-semibold text-gray-900 text-center mb-8">
          How it works
        </h3>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200">
                    <FiShare2 className="text-[#005823]" size={28} />
                </div>
            <h4 className="font-semibold text-gray-900 mb-2">Refer a friend</h4>
<p className="text-sm text-gray-600 leading-relaxed">
              Invite Providers only. Your referral code works for provider-to-Provider referrals.
            </p>
            </div>
             <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200">
              <Users className="text-[#005823]" size={28} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Your friend gets ₦500</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Your friend gets ₦500 on their first booking
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200">
              <FiAward className="text-[#005823]" size={28} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">You earn ₦1,000</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              You earn ₦1,000 after their first completed service
            </p>
          </div>
            </div>


        </div>

    </div>
  )

























}