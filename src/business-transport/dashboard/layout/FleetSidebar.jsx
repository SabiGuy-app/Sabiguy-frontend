import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { fleetNavGroups } from "./fleetNavLinks";
import { formatNaira } from "../utils/format";

export default function FleetSidebar({ open = false, onClose, wallet = {} }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const onLogout = () => {
    setShowLogoutConfirm(false);
    onClose?.();
    navigate("/login");
  };

  return (
    <>
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-80 rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-2 flex items-center gap-3">
              <LogOut className="text-red-500" size={22} />
              <h2 className="text-lg font-semibold text-gray-800">Log out?</h2>
            </div>
            <p className="mb-6 text-sm text-gray-500">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={onLogout}
                className="flex-1 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      <aside
        className={`fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] w-3/4 transform flex-col border-r border-gray-200 bg-white p-4 shadow-xl transition-transform duration-300 sm:top-20 sm:h-[calc(100vh-5rem)] sm:p-6 md:w-64 md:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-500">
            Wallet: <span className="font-semibold text-gray-900">{formatNaira(wallet.balance)}</span>
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Owed to drivers: {formatNaira(wallet.owedToDrivers)}
          </p>
        </div>

        <nav className="mt-5 flex-1 space-y-5 overflow-y-auto">
          {fleetNavGroups.map((group, groupIndex) => (
            <div key={`${group.section || "primary"}-${groupIndex}`}>
              {group.section && (
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  {group.section}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((link) => {
                  const isActive = pathname === link.path;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => onClose?.()}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#231F20] hover:bg-[#005823]/10 ${
                        isActive ? "bg-[#005823] font-medium text-white" : ""
                      }`}
                    >
                      <Icon size={18} />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-auto border-t pt-4">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
