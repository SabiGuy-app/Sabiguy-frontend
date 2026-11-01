import { Link } from "react-router-dom";
import SidebarNavLink from "../../../../components/dashboard/SidebarNavLink";
import { MoneyBag, X } from "../icons";
import { formatNaira } from "../utils/format";
import { businessDashboardPath, businessNavGroups } from "./businessNavLinks";

export default function BusinessSidebar({ open, onClose, wallet }) {
  return (
    <aside id="business-sidebar" className={`business-sidebar ${open ? "is-open" : ""}`}>
      <div className="business-sidebar-brand">
        <Link to={businessDashboardPath} onClick={onClose} aria-label="SabiGuy business overview">
          <img src="/logo.jpg" alt="SabiGuy" />
        </Link>
        <button className="business-menu-button business-sidebar-close" onClick={onClose} aria-label="Close navigation">
          <X size={22} />
        </button>
      </div>
      <div className="business-wallet">
        <p><MoneyBag size={18} /> <span>Wallet: {formatNaira(wallet.balance)}</span></p>
        <span>Owed to staff: {formatNaira(wallet.owedToStaff)}</span>
      </div>
      <nav aria-label="Business business navigation" className="business-navigation">
        {businessNavGroups.map((group, index) => (
          <div className="business-nav-group" key={index}>
            <p className="business-nav-heading">{group.section}</p>
            {group.items.map(({ name, path, icon }) => {
              const Icon = icon;
              const href = `${businessDashboardPath}${path ? `/${path}` : ""}`;
              return (
                <SidebarNavLink
                  key={name}
                  to={href}
                  onClick={onClose}
                  icon={<Icon size={20} strokeWidth={1.6} />}
                >
                  {name}
                </SidebarNavLink>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
