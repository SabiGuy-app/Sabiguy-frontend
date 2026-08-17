import { Menu } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  const closeMobileMenu = () => setIsOpen(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center text-center overflow-hidden">
      <div className="flex h-16 w-full px-20 items-center justify-between md:h-20 shadow-md">
        <div
          whileHover={{ scale: 1.03 }}
          className="flex shrink-0 items-center"
        >
          <Link
            to="/"
            onClick={closeMobileMenu}
            aria-label="Go to SabiGuy home"
            className="flex h-10 w-[118px] items-center overflow-hidden md:h-12 md:w-[136px]"
          >
            <img
              src="/logo.jpg"
              alt="SabiGuy"
              loading="eager"
              className="block"
              style={{
                width: "100%",
                height: "100%",
                maxWidth: "136px",
                maxHeight: "48px",
                objectFit: "contain",
              }}
            />
          </Link>
        </div>

        <div className="hidden items-center gap-10 md:flex">
          <div className="flex items-center gap-10">
            <div whileHover={{ color: "#4F8461" }}>
              <Link
                to="/"
                className="text-sm font-medium text-[#1A1A1A] transition-colors hover:text-[#4F8461]"
              >
                Home
              </Link>
            </div>
            <Link
              whileHover={{ color: "#4F8461" }}
              href="#faq"
              className="text-[#1A1A1A] font-medium text-sm transition-colors"
            >
              Support
            </Link>
          </div>

          <div className="flex items-center gap-8 ml-4 border-l border-gray-200 pl-4">
            <div whileHover={{ color: "#4F8461" }}>
              <Link
                to="/login"
                className="text-sm font-medium text-[#1A1A1A] transition-colors hover:text-[#4F8461]"
              >
                Login
              </Link>
            </div>
            <div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/welcome"
                className="inline-flex items-center justify-center rounded-full bg-[#4F8461] px-8 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#3e694d]"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="z-50 -mr-2 inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4F8461] md:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-center mt-40">
        <h1 className="text-[100px] font-extrabold text-gray-700">404</h1>
        <p className="mb-6 text-[20px] text-gray-600">Page Not Found</p>

        <button
          onClick={() => navigate("/")}
          className="bg-[#207A51] text-white font-semibold text-[16px] px-[20px] py-[10px] rounded-md transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
