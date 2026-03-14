// src/components/Navbar.jsx

import Button from "../button";
import { Link } from "react-router-dom"; 

export default function Navbar() {

  return (
<nav className="w-full flex justify-between items-center px-6 py-4 bg-white shadow-sm border-b border-gray-400">
      {/* Logo */}
      <div className="text-2xl font-bold text-[#005823]">
        <img src="/logo.jpg" alt="SabiGuy Logo" className="h-8 w-auto" />
      </div>

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



    </nav>
  );
}
