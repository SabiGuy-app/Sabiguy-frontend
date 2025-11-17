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
    primary: "bg-[#005823BF]  text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#005823] transition",
     secondary: "border border-gray-400 text-black px-4 py-2 rounded-lg text-sm font-medium  hover:text-[#005823]",
    ghost: " text-[#005823] font-bold  border border-[#005823] px-20 py-2",
    disabled: "bg-gray-300 text-gray-600 cursor-not-allowed"
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
