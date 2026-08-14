import { confirmPayoutData } from "../../data/mockEarnings";
import { formatNaira } from "../../utils/format";

const rows = [
  { label: "Driver", value: confirmPayoutData.driver, bold: true },
  { label: "Destination", value: confirmPayoutData.destination, bold: true },
  {
    label: "Amount",
    value: formatNaira(confirmPayoutData.amount),
    bold: true,
    color: "text-[#005823]",
  },
  {
    label: "Wallet Balance",
    value: formatNaira(confirmPayoutData.walletBalance),
    bold: true,
  },
];

const ConfirmPayoutModal = ({ isOpen, setIsOpen, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/20 flex justify-center items-center z-50 px-4"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-[520px] bg-white rounded-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-[#231F20] mb-5">
          Confirm Payout
        </h2>

        <div className="border border-[#231F2020] rounded-xl overflow-hidden">
          {rows.map((row, index) => (
            <div
              key={row.label}
              className={`flex justify-between items-center px-4 py-3.5 ${
                index !== rows.length - 1 ? "border-b border-[#231F2020]" : ""
              }`}
            >
              <span className="text-sm text-[#231F20BF]">{row.label}</span>
              <span
                className={`text-base font-bold text-[#231F20] ${
                  row.color ?? ""
                }`}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onConfirm}
          className="w-full mt-6 bg-[#005823] text-white font-semibold text-base rounded-lg py-3.5 hover:bg-[#00461c] transition-colors"
        >
          Confirm & Send {formatNaira(confirmPayoutData.amount)}
        </button>
      </div>
    </div>
  );
};

export default ConfirmPayoutModal;


