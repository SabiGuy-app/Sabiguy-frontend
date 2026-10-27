import { NavLink } from "react-router-dom";

export default function SidebarNavLink({ to, onClick, icon, children }) {
  return (
    <NavLink
      to={to}
      end
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-3 text-base text-[#231F20] hover:bg-[#005823]/10 ${
          isActive ? "bg-[#005823] text-white font-medium" : ""
        }`
      }
    >
      <span className="shrink-0">{icon}</span>
      <span>{children}</span>
    </NavLink>
  );
}
