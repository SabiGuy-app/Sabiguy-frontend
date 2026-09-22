import { Check, X } from "lucide-react";

const PASSWORD_RULES = [
  {
    key: "length",
    label: "Be at least 8 characters long",
    test: (password) => password.length >= 8,
  },
  {
    key: "uppercase",
    label: "At least one uppercase letter (A-Z)",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    key: "lowercase",
    label: "At least one lowercase letter (a-z)",
    test: (password) => /[a-z]/.test(password),
  },
  {
    key: "number",
    label: "At least one number (0-9)",
    test: (password) => /\d/.test(password),
  },
  {
    key: "special",
    label: "At least one special character (!@#$%^&*)",
    test: (password) => /[^A-Za-z0-9]/.test(password),
  },
];

export default function PasswordRequirements({ password = "" }) {
  const completedRules = PASSWORD_RULES.filter((rule) => rule.test(password));
  const firstIncompleteIndex = PASSWORD_RULES.findIndex(
    (rule) => !rule.test(password),
  );

  return (
    <div
      className="mt-3 rounded-xl border border-[#DDE9E0] bg-[#F5F9F6] px-3 py-3 sm:px-4 sm:py-4"
      aria-label="Password requirements"
    >
      <div className="mb-3 flex w-full gap-2" aria-hidden="true">
        {PASSWORD_RULES.map((rule, index) => {
          const isComplete = completedRules.includes(rule);
          const isNext = index === firstIncompleteIndex;

          return (
            <span
              key={rule.key}
              className={`h-2 min-w-0 flex-1 rounded-full transition-colors ${
                isComplete
                  ? "bg-[#005823]"
                  : isNext && password
                    ? "bg-[#D89B22]"
                    : "bg-[#C7D0C9]"
              }`}
            />
          );
        })}
      </div>

      <ul className="space-y-2">
        {PASSWORD_RULES.map((rule) => {
          const isComplete = rule.test(password);

          return (
            <li
              key={rule.key}
              className="flex items-center gap-2 text-sm leading-5 text-[#4B5550] sm:text-[15px]"
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                  isComplete
                    ? "bg-[#DCEFE2] text-[#005823]"
                    : "bg-[#E7ECE8] text-[#657069]"
                }`}
              >
                {isComplete ? <Check size={16} strokeWidth={2.5} /> : <X size={16} />}
              </span>
              <span>{rule.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
