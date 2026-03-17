// src/components/Navbar.jsx

import Button from "../button";
import { Menu, X } from "lucide-react"; 
import { Link, useNavigate } from "react-router-dom"; 
import { useState } from "react";

export default function SignUpNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
<nav className="w-full flex justify-between items-center px-6 py-4 bg-white shadow-sm border-b border-gray-400">
      {/* Logo */}
      <Link to="/">
  <img src="/logo.jpg" alt="SabiGuy Logo" className="h-8 w-auto" />
</Link>
      {/* Desktop buttons */}
      <div className=" hidden md:flex space-x-4">
        <Link to="/login">
          <button className="text-[#005823] font-bold px-10 py-2 text-lg hover:underline">
            Login
          </button>
        </Link>
        {/* <Link to="/">
          <Button variant="primary" size="md">
            Sign Up
          </Button>
        </Link> */}
      </div>



    </nav>
  );
}
