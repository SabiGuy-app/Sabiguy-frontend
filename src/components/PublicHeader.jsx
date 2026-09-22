import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed left-0 right-0 top-0 z-50 w-full bg-white transition-shadow duration-300 ${isScrolled ? "border-b border-gray-100 shadow-md" : "border-b border-gray-100"}`}>
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:h-20 md:px-6">
        <Link to="/" className="flex items-center h-10 md:h-12">
          <img src="/logo.jpg" alt="SabiGuy" className="h-full w-auto" />
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          <div className="flex items-center gap-10">
            <Link to="/" className="text-sm font-medium text-[#1A1A1A] hover:text-[#4F8461]">Home</Link>
            <a href="#faq" className="text-sm font-medium text-[#1A1A1A]">Support</a>
          </div>

          <div className="flex items-center gap-8 ml-4 border-l border-gray-200 pl-4">
            <Link to="/login" className="text-sm font-medium text-[#1A1A1A] hover:text-[#4F8461]">Login</Link>
            <Link to="/welcome" className="inline-flex items-center justify-center rounded-full bg-[#4F8461] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#3e694d]">Sign up</Link>
          </div>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="z-50 -mr-2 inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-700 md:hidden">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute left-0 top-16 z-50 w-full bg-white border-t border-gray-100 md:hidden">
          <div className="flex flex-col items-center gap-2 px-4 py-5">
            <Link to="/" onClick={() => setIsOpen(false)} className="w-full rounded py-3 text-center text-sm font-medium text-[#1A1A1A] hover:bg-gray-50">Home</Link>
            <a href="#faq" onClick={() => setIsOpen(false)} className="w-full rounded py-3 text-center text-sm font-medium text-[#1A1A1A] hover:bg-gray-50">Support</a>
            <Link to="/login" onClick={() => setIsOpen(false)} className="w-full rounded py-3 text-center text-sm font-medium text-[#1A1A1A] hover:bg-gray-50">Login</Link>
            <Link to="/welcome" onClick={() => setIsOpen(false)} className="mt-2 w-full rounded-full bg-[#4F8461] px-6 py-3 text-center text-sm font-medium text-white">Sign up</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
