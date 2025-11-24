import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs({ paths }) {
  return (
    <nav className="flex items-center text text-gray-500 mb-6">
      {paths.map((item, index) => (
        <div key={index} className="flex items-center">
          {index !== 0 && (
            <ChevronRight size={16} className="mx-2 text-gray-400" />
          )}

          {item.to ? (
            <Link to={item.to} className="hover:text-[#005823]">
             {item.icon && <item.icon size={20} />} 

              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700 font-semibold">
             {item.icon && <item.icon size={16} />} 
                {item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
