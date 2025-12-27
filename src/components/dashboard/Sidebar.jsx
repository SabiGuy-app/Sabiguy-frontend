import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, HelpCircle, MessageCircle, Home, LogOut, Gift, Heart, Book, ClipboardList, Cog} from "lucide-react";


const links = [
  { name: "Home", path: "/dashboard", icon: <Home/> },
  { name: "My Bookings", path: "/bookings", icon: <Book/> },
  { name: "Saved Profile", path: "/dashboard/saved", icon: <Heart/> },
  { name: "Chat", path: "/dashboard/chat", icon: <MessageCircle/> },
  { name: "Activity", path: "/dashboard/activity", icon: <ClipboardList/> },
  // { name: "Referrals", path: "/dashboard/", icon: <Gift/> },
  { name: "Settings", path: "/dashboard/settings", icon: <Cog/> },
  { name: "Help", path: "/dashboard/help", icon: <HelpCircle/> },
  { name: "Logout", path: "/", icon: <LogOut/> },


];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden p-3 fixed top-4 left-4 z-50 bg-[#005823] text-white rounded-lg"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen mt-20 bg-white border-r border-gray-200 z-40 w-64 p-6 transform transition-transform duration-300 
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* <h1 className="text-3xl font-bold text-[#005823] mb-10">SabiGuy</h1> */}
        <nav className="space-y-2">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-[#005823]/10 ${
                pathname === link.path ? "bg-[#005823] text-white font-medium" : ""
              }`}
            >
              <span>{link.icon}</span>
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}