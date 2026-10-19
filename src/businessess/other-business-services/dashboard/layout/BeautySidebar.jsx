import { Link } from "react-router-dom";
import SidebarNavLink from "../../../../components/dashboard/SidebarNavLink";
import { MoneyBag, X } from "../icons";
import { formatNaira } from "../utils/format";
import { beautyDashboardPath, beautyNavGroups } from "./beautyNavLinks";

export default function BeautySidebar({ open, onClose, wallet }) {
  return (
    <aside id="beauty-sidebar" className={`beauty-sidebar ${open ? "is-open" : ""}`}>
      <div className="beauty-sidebar-brand">
        <Link to={beautyDashboardPath} onClick={onClose} aria-label="SabiGuy beauty overview">
          <img src="/logo.jpg" alt="SabiGuy" />
        </Link>
        <button className="beauty-menu-button beauty-sidebar-close" onClick={onClose} aria-label="Close navigation">
          <X size={22} />
        </button>
      </div>
      <div className="beauty-wallet">
        <p><MoneyBag size={18} /> <span>Wallet: {formatNaira(wallet.balance)}</span></p>
        <span>Owed to staff: {formatNaira(wallet.owedToStaff)}</span>
      </div>
      <nav aria-label="Beauty business navigation" className="beauty-navigation">
        {beautyNavGroups.map((group, index) => (
          <div className="beauty-nav-group" key={index}>
            <p className="beauty-nav-heading">{group.section}</p>
            {group.items.map(({ name, path, icon }) => {
              const Icon = icon;
              const href = `${beautyDashboardPath}${path ? `/${path}` : ""}`;
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
