const TONE_CLASSES = {
  green: "border-green-200 bg-green-50 text-green-700",
  neutral: "border-[#DDDADB] bg-[#F4F3F3] text-[#5F5C5D]",
  red: "border-red-200 bg-red-50 text-red-600",
};

export default function SettingsBadge({ tone = "green", children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        TONE_CLASSES[tone] || TONE_CLASSES.green
      }`}
    >
      {children}
    </span>
  );
}
