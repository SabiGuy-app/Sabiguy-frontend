import { Link } from "react-router-dom";
import { Bell, Menu, Search } from "../icons";
import { businessDashboardPath } from "./businessNavLinks";
import { useBusinessSession } from "../session/businessSessionContext";

const FALLBACK_AVATAR = "/avatar.png";

export default function BusinessTopbar({ sidebarOpen, onMenuClick, search, onSearchChange, showAvailability = true }) {
  const {
    business,
    available,
    updatingAvailability,
    locationEnabled,
    toggleAvailability,
    unreadCount,
    openNotifications,
  } = useBusinessSession();
  const businessName = business?.BusinessName || "Business";

  return (
    <header className="business-topbar">
      <button type="button" className="business-menu-button business-mobile-menu" aria-label="Toggle navigation" aria-expanded={sidebarOpen} aria-controls="business-sidebar" onClick={onMenuClick}>
        <Menu size={23} />
      </button>
      <label className="business-search">
        <Search size={18} aria-hidden="true" />
        <input type="search" value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search for anything" aria-label="Search dashboard booking, staff, and activity" />
      </label>
      <div className="business-topbar-actions">
        {showAvailability && (
          <button
            type="button"
            className={`business-availability ${updatingAvailability ? "is-updating" : ""}`}
            role="switch"
            aria-checked={available}
            aria-busy={updatingAvailability}
            aria-label="Available for jobs"
            title={available ? (locationEnabled ? "Sharing your location while available" : "Available") : "Go online and start sharing location"}
            disabled={updatingAvailability}
            onClick={toggleAvailability}
          >
            <span>{available ? "Available for Jobs" : "Unavailable for Jobs"}</span>
            <span className={`business-switch ${available ? "is-on" : ""}`}><span /></span>
          </button>
        )}
        <button
          type="button"
          className="business-notification-button"
          aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : "Notifications"}
          onClick={openNotifications}
        >
          <Bell size={24} strokeWidth={1.6} />
          {unreadCount > 0 && <span className="business-notification-count">{unreadCount > 99 ? "99+" : unreadCount}</span>}
        </button>
        <Link to={`${businessDashboardPath}/settings`} className="business-profile" aria-label="Open account settings">
          <img
            src={business?.data?.profilePicture || FALLBACK_AVATAR}
            alt={`${businessName} profile`}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = FALLBACK_AVATAR;
            }}
          />
        </Link>
      </div>
    </header>
  );
}
