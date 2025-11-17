// src/components/Button.jsx

export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  ...props
}) {
  const base =
    "rounded-md font-medium transition-colors focus:outline-none";

  const styles = {
    primary: "bg-[#005823BF] text-white hover:bg-[#005823]",
     secondary: "bg-[#005823BF] text-white hover:bg-[#005823] px-35 py-3",
    ghost: " text-[#005823] font-bold  border border-[#005823] px-20 py-2",
    disabled: "bg-gray-300 text-gray-600 px-35 py-3 cursor-not-allowed"
  };

  const sizes = {
    sm: "px-4 py-1 text-sm",
    md: "px-6 py-2 text-lg",
    lg: "px-8 py-3 text-lg",

  };
const appliedStyle = disabled
    ? styles.disabled
    : styles[variant] || styles.primary;
  return (
 <button
      disabled={disabled}
      className={`${base} ${appliedStyle} ${sizes[size]}`}
      {...props}
    >      
    {children}
    </button>
  );
}
