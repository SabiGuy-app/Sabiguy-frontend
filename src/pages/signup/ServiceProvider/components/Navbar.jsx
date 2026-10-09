import { Link } from "react-router-dom";

export default function SignUpNavbar() {
  return (
    <nav className="w-full flex justify-between items-center px-6 py-4 bg-white shadow-sm border-b border-gray-400">
      <Link to="/">
        <img src="/logo.jpg" alt="SabiGuy Logo" className="h-8 w-auto" />
      </Link>
      <div className="hidden md:flex space-x-4">
        <Link to="/login">
          <button className="text-[#005823] font-bold px-10 py-2 text-lg hover:underline">
            Login
          </button>
        </Link>
      </div>
    </nav>
  );
}
