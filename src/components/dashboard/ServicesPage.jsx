import Navbar from "./Navbar";
import ProviderCard from "./ProviderCard";
import Breadcrumbs from "./BreadCrumbs";
import { Home, ChevronRight } from "lucide-react";

export default function ServicesPage ({
    title,
    description,
    providers,
    breadcrumbs,
})  {
    return (
    <>
    
      <Navbar />

      <div className="px-9 py-8">

        {/* Use reusable Breadcrumbs */}
        <Breadcrumbs paths={breadcrumbs} />

        <h1 className="font-semibold text-3xl">{title}</h1>

        {/* Description */}
        <p className="text-gray-600 mt-2 mb-6 max-w-3xl">{description}</p>

        <div className="flex gap-4 mb-6">
          <select className="border px-4 py-2 rounded-lg">
            <option>Price</option>
          </select>
          <select className="border px-4 py-2 rounded-lg">
            <option>Rating</option>
          </select>
          <select className="border px-4 py-2 rounded-lg">
            <option>Distance</option>
          </select>
        </div>

        <h2 className="font-medium text-lg mb-4">Recommended for you</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {providers.map((item, idx) => (
            <ProviderCard key={idx} {...item} />
          ))}
        </div>
      </div>
    </>
    );
}