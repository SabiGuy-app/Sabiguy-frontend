// src/components/Navbar.jsx

import { useState } from "react";
import Button from "../button";
import { Menu, X } from "lucide-react"; 
import { Link } from "react-router-dom"; 

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
<nav className="w-full flex justify-between items-center px-6 py-4 bg-white shadow-sm border-b border-gray-400">
      {/* Logo */}
      <div className="text-2xl font-bold text-[#005823]">SabiGuy</div>

      {/* Desktop buttons */}
      <div className=" hidden md:flex space-x-4">
        <Link to="/login">
          <button className="text-[#005823] font-bold px-10 py-2 text-lg hover:underline">
            Login
          </button>
        </Link>
        <Link to="/">
          <Button variant="primary" size="md">
            Sign Up
          </Button>
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
      className="md:hidden text-[#005823] focus:outline-none"
      onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28}/>}
      </button>

      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md border-t border-gray-200 flex flex-col items-center space-y-4 py-6 z-50 md:hidden"> 
        <Link
        to="/login"
        onClick={() => setMenuOpen(false)}
        className="text-[#005823] font-bold text-lg"
        >
          Login      
         </Link>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <Button variant="primary" size="md">
              Sign Up
            </Button>
          </Link>
        </div>
      )}

    </nav>
  );
}
