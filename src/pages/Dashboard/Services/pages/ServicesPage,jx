import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Breadcrumbs from "./BreadCrumbs";
import { Star, MapPin } from "lucide-react";

export default function ServiPage({ title, description, providers, breadcrumbs }) {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      
      <div className="px-9 py-8">
        <Breadcrumbs paths={breadcrumbs} />

        <div className="mb-8">
          <h1 className="font-semibold text-3xl mb-2">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>

        {providers.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No providers available for this service at the moment.</p>
            <button
              onClick={() => navigate("/dashboard/categories")}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Browse Other Categories
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {providers.map((provider, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                onClick={() => navigate(`/dashboard/provider/${provider.id || idx}`)}
              >
                <div className="relative h-48">
                  <img
                    src={provider.image}
                    alt={provider.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{provider.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{provider.skill}</p>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-sm">{provider.rating}</span>
                    </div>
                    <span className="text-gray-400 text-sm">({provider.reviews} reviews)</span>
                  </div>

                  <div className="flex items-center gap-1 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{provider.location}</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="font-bold text-lg text-blue-600">{provider.price}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/dashboard/provider/${provider.id || idx}`);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}