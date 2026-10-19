import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Menu, Search, UserRound } from "../icons";
import { beautyDashboardPath } from "./beautyNavLinks";
import ActivityEntry from "../components/ActivityEntry";

export default function BeautyTopbar({ sidebarOpen, onMenuClick, search, onSearchChange, available, onAvailabilityChange, notification, onReadNotification, showAvailability = true }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    if (!notificationsOpen) return;
    const closeOnOutsideClick = (event) => {
      if (!notificationRef.current?.contains(event.target)) setNotificationsOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setNotificationsOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [notificationsOpen]);

  return (
    <header className="beauty-topbar">
      <button type="button" className="beauty-menu-button beauty-mobile-menu" aria-label="Toggle navigation" aria-expanded={sidebarOpen} aria-controls="beauty-sidebar" onClick={onMenuClick}>
        <Menu size={23} />
      </button>
      <label className="beauty-search">
        <Search size={18} aria-hidden="true" />
        <input type="search" value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search for anything" aria-label="Search dashboard booking, staff, and activity" />
      </label>
      <div className="beauty-topbar-actions">
        {showAvailability && <button type="button" className="beauty-availability" role="switch" aria-checked={available} aria-label="Available for jobs" onClick={() => onAvailabilityChange(!available)}>
          <span>{available ? "Available for Jobs" : "Unavailable for Jobs"}</span>
          <span className={`beauty-switch ${available ? "is-on" : ""}`}><span /></span>
        </button>}
        <div className="beauty-notification-wrap" ref={notificationRef}>
          <button type="button" className="beauty-notification-button" aria-label={notification?.unread ? "Notifications, 1 unread" : "Notifications"} aria-expanded={notificationsOpen} aria-controls="beauty-notifications" onClick={() => {
            if (!notificationsOpen) onReadNotification?.();
            setNotificationsOpen((value) => !value);
          }}>
            <Bell size={24} strokeWidth={1.6} />{notification?.unread && <span className="beauty-notification-dot" />}
          </button>
          {notificationsOpen && (
            <section className="beauty-notifications" id="beauty-notifications" aria-label="Notifications">
              <strong>Notifications</strong>
              {notification ? <ActivityEntry activity={notification} /> : <p>You’re all caught up.</p>}
            </section>
          )}
        </div>
        <Link to={`${beautyDashboardPath}/settings`} className="beauty-profile" aria-label="Open account settings">
          <UserRound size={40} strokeWidth={1.2} />
        </Link>
      </div>
    </header>
  );
}
