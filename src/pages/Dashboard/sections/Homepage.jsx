// import DashboardLayout from "../../../components/layouts/DashboardLayout";
// import ProviderCard from "../../../components/dashboard/ProviderCard";
// import CategoryCarousel from "../../../components/dashboard/CategoryCarousel";
// import Button from "../../../components/dashboard/Button";
// import { ArrowRight } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useAuthStore } from "../../../stores/auth.store";
// // import { getAllProviders } from "../../../api/provider";
// import { useRef, useState } from "react";
// import { searchServiceProviders } from "../../../api/bookings";
// import ServicesCard from "../../../components/dashboard/ServicesCard";
// import { extractNearbyProviders } from "../../../other-services/dashboard/utils/beautyProviderMapper";
// import {
//   exploreCategories,
//   getCategoryDestination,
// } from "../../../other-services/dashboard/data/exploreCategories";
// import { BEAUTY_PROVIDER_SEARCH_NAMES } from "../../../constants/beautyServices";
// import { SERVICE_CATEGORIES } from "../../../constants/serviceCategories";
// import new1 from "/new1.png";
// import new2 from "/new2.png";
// import new3 from "/new3.png";
// import new4 from "/new4.png";
// import new5 from "/new5.png";
// import new6 from "/new6.png";
// import new7 from "/new7.png";
// import new8 from "/new8.png";
// import ComingSoonModal from "../../../components/dashboard/ComingSoonModal";
// import DashboardTour from "../../../components/tour/DashboardTour";
// import NotificationTest from "../../../services/testNotify";

// const getCurrentLocation = () =>
//   new Promise((resolve, reject) => {
//     if (!navigator.geolocation) {
//       reject(new Error("Location access is needed to search for providers."));
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       ({ coords }) =>
//         resolve({
//           latitude: coords.latitude,
//           longitude: coords.longitude,
//         }),
//       (error) => {
//         const errorMessages = {
//           1: "The browser denied this location request. Check this site's location permission and try again.",
//           2: "Your device or browser could not determine a location. Check that device location services are enabled and try again.",
//           3: "The location request timed out before your device returned a position. Try again or check device location services.",
//         };
//         reject(
//           new Error(
//             errorMessages[error.code] ||
//               `Could not get your location: ${error.message || "unknown location error"}.`,
//           ),
//         );
//       },
//       { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 },
//     );
//   });

// const beautyCategory = exploreCategories.find((category) => category.id === "beauty");
// const buildSearchableTasks = () => {
//   const serviceTasks = SERVICE_CATEGORIES.flatMap((category) =>
//     (category.services || []).map((service) => ({
//       key: `${category.id}:${service.id}`,
//       label: service.name,
//       category: category.label,
//       destination: null,
//     })),
//   );
//   const categoryTasks = [
//     ...BEAUTY_PROVIDER_SEARCH_NAMES.map((task) => ({
//       category: beautyCategory,
//       task,
//     })),
//     ...exploreCategories
//       .filter((category) => !category.comingSoon)
//       .flatMap((category) =>
//         category.tasks.map((task) => ({ category, task })),
//       ),
//   ].map(({ category, task }) => ({
//     key: `${category.id}:${task.toLowerCase()}`,
//     label: task,
//     category: category.title,
//     destination: getCategoryDestination(category, task),
//   }));

//   return Array.from(
//     new Map(
//       [...serviceTasks, ...categoryTasks].map((task) => [task.key, task]),
//     ).values(),
//   );
// };

// export default function DashboardHome() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchedTerm, setSearchedTerm] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [searchError, setSearchError] = useState("");
//   const [searchLoading, setSearchLoading] = useState(false);
//   const hydrated = useAuthStore((state) => state.hydrated);
//   // const { providers, setProviders } = useProviderStore();
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedService, setSelectedService] = useState(null);
//   const user = useAuthStore((state) => state.user);
//   const navigate = useNavigate();
//   const searchRequestId = useRef(0);
//   const matchingTasks = buildSearchableTasks().filter(({ label, category }) => {
//     const query = searchTerm.trim().toLowerCase();
//     if (!query) return false;
//     return [label, category].some((value) => value.toLowerCase().includes(query));
//   });

//   const submitSearch = async (searchQuery = searchTerm) => {
//     const query = searchQuery.trim();
//     if (!query) return;

//     const requestId = ++searchRequestId.current;
//     setSearchTerm(query);
//     setSearchedTerm(query);
//     setSearchResults([]);
//     setSearchError("");
//     setSearchLoading(true);

//     try {
//       const location = await getCurrentLocation();
//       const response = await searchServiceProviders({
//         location,
//         serviceName: query,
//         jobService: query,
//         businessName: query,
//       });
//       if (requestId === searchRequestId.current) {
//         setSearchResults(
//           extractNearbyProviders(response).filter(
//             (provider) => provider?.id || provider?._id,
//           ),
//         );
//       }
//     } catch (error) {
//       if (requestId === searchRequestId.current) {
//         setSearchError(
//           error?.response?.data?.message ||
//             error?.message ||
//             "Search failed. Please try again.",
//         );
//       }
//     } finally {
//       if (requestId === searchRequestId.current) setSearchLoading(false);
//     }
//   };

//   if (!hydrated) {
//     return (
//       <DashboardLayout>
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="text-center">
//             <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-4"></div>
//             <div className="h-4 w-96 bg-gray-200 rounded animate-pulse mx-auto"></div>
//           </div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   const categories = [
//     {
//       title: "Package Delivery",
//       description: "Your items delivered quickly and safely",
//       image: new1,
//       comingSoon: false,
//     },
//     {
//       title: "Book a Ride",
//       description: "Reliable rides, ready whenever you are.",
//       image: new2,
//       // bgColor: "#BF4A0B4D",
//       comingSoon: false,
//     },
//     {
//       title: "Welding",
//       description: "Reliable welding for repairs and fabrication",
//       image: new3,
//       // bgColor: "#72280080",
//       comingSoon: true,
//     },
//     {
//       title: "Household Support",
//       description: "Quick, dependable household assistance anytime.",
//       image: new4,
//       bgColor: "#0054AE80",
//       comingSoon: true,
//     },
//     {
//       title: "Towing & Roadside",
//       description: "Fast help for breakdowns and emergencies",
//       image: new5,
//       bgColor: "#B100004D",
//       comingSoon: true,
//     },
//     {
//       title: "Legal & Financial",
//       description: "Expert guidance for legal and financial needs",
//       image: new6,
//       bgColor: "#4800D94D",
//       comingSoon: true,
//     },
//     {
//       title: "Plumbing",
//       description: "Fast help for breakdowns and emergencies",
//       image: new7,
//       bgColor: "#BF4A0B4D",
//       comingSoon: true,
//     },
//     {
//       title: "Digital Design",
//       description: "Modern designs for web, brand, and media.",
//       image: new8,
//       bgColor: "#A30B4B4D",
//       comingSoon: true,
//     },
//   ];

//   const services = exploreCategories;

//   const categoryServiceMap = {
//     "Package Delivery": "package delivery",
//     "Book a Ride": "book a ride",
//   };

//   const handleServiceClick = (service, task) => {
//     const destination = getCategoryDestination(service, task);
//     if (destination) navigate(destination);
//     else {
//       setSelectedService(service);
//       setModalOpen(true);
//     }
//   };

//   const handleCategoryClick = (category) => {
//     if (category.comingSoon) return;
//     const serviceValue = categoryServiceMap[category.title];
//     if (serviceValue) {
//       navigate(`/bookings?service=${encodeURIComponent(serviceValue)}`);
//     } else {
//       navigate("/bookings");
//     }
//   };

//   // useEffect(() => {
//   //   const loadProviders = async () => {
//   //     const data = await getAllProviders(token);
//   //     console.log("Setting providers:", data.data);
//   //     setProviders(data.data);
//   //   };

//   //   loadProviders();
//   // }, []);

//   return (
//     <DashboardLayout
//       searchValue={searchTerm}
//       onSearchChange={setSearchTerm}
//       onSearchSubmit={submitSearch}
//       searchPlaceholder="Search for anything"
//     >
//       <DashboardTour />
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//         <div>
//           <h2 className="text-lg font-semibold mb-3">
//             {" "}
//             Welcome Back, {user?.data?.fullName?.split(" ")[0]} 👋
//           </h2>
//           <p className="mb-3 text-sm">What would you like to get done today?</p>
//         </div>
//       </div>

//       {searchTerm.trim() && (
//         <section aria-label="Task search results" className="mb-6 mt-4 max-w-2xl">
//           <h3 className="mb-2 text-sm font-semibold text-[#231F20]">
//             Services and tasks
//           </h3>
//           {matchingTasks.length ? (
//             <ul className="divide-y divide-gray-200 border-y border-gray-200">
//               {matchingTasks.map((task) => (
//                 <li key={task.key}>
//                   <button
//                     type="button"
//                     onClick={() =>
//                       task.destination
//                         ? navigate(task.destination)
//                         : submitSearch(task.label)
//                     }
//                     className="flex w-full items-center justify-between gap-4 py-3 text-left hover:text-[#005823] focus-visible:outline-2 focus-visible:outline-[#005823]"
//                   >
//                     <span className="min-w-0"><span className="block text-sm font-medium">{task.label}</span><span className="block text-xs text-gray-500">{task.category}</span></span>
//                     <ArrowRight size={17} className="shrink-0" aria-hidden="true" />
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="py-3 text-sm text-gray-500">
//               No matching service or task found.
//             </p>
//           )}
//         </section>
//       )}

//       {searchedTerm === searchTerm.trim() && searchedTerm && (
//         <section aria-label="Provider search results" className="mb-6 mt-4">
//           <h3 className="mb-3 text-sm font-semibold text-[#231F20]">
//             Providers matching “{searchedTerm}”
//           </h3>
//           {searchLoading ? (
//             <p role="status" className="py-3 text-sm text-gray-500">
//               Searching providers near you...
//             </p>
//           ) : searchError ? (
//             <p role="alert" className="py-3 text-sm text-red-600">
//               {searchError}
//             </p>
//           ) : searchResults.length ? (
//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//               {searchResults.map((provider) => {
//                 const services = Array.isArray(provider.service)
//                   ? provider.service
//                   : Array.isArray(provider.services)
//                     ? provider.services
//                     : [];
//                 const serviceName =
//                   services[0]?.serviceName ||
//                   services[0]?.name ||
//                   (Array.isArray(provider.job) ? provider.job[0]?.service : "") ||
//                   "Service provider";
//                 const providerId = provider.id || provider._id;
//                 const rating = provider.rating?.average ?? provider.rating;

//                 return (
//                   <ProviderCard
//                     key={providerId}
//                     id={providerId}
//                     fullName={
//                       provider.fullName ||
//                       provider.businessName ||
//                       provider.BusinessName ||
//                       "Service provider"
//                     }
//                     rating={Number(rating) || 0}
//                     reviews={
//                       provider.rating?.count ??
//                       (Array.isArray(provider.reviews)
//                         ? provider.reviews.length
//                         : provider.reviews || 0)
//                     }
//                     price={
//                       provider.price ??
//                       services[0]?.price ??
//                       services[0]?.fixedPrice ??
//                       0
//                     }
//                     city={
//                       provider.businessAddress ||
//                       provider.city ||
//                       provider.currentLocation?.address ||
//                       provider.address ||
//                       "Location unavailable"
//                     }
//                     job={
//                       Array.isArray(provider.job) && provider.job.length
//                         ? provider.job
//                         : [{ service: serviceName }]
//                     }
//                     profilePicture={
//                       provider.profilePicture ||
//                       provider.profilePic ||
//                       provider.profileImage
//                     }
//                     isAvailable={provider.availability?.isAvailable !== false}
//                   />
//                 );
//               })}
//             </div>
//           ) : (
//             <p className="py-3 text-sm text-gray-500">
//               No providers matched that search near your current location.
//             </p>
//           )}
//         </section>
//       )}

//       {/* <section
//         aria-label="Ride booking promotion"
//         className="mb-7 mt-2 overflow-hidden rounded-2xl border border-[#7BCB8C] bg-[#E7F6EC] px-4 py-5 shadow-sm sm:px-6 md:px-8"
//       >
//         <div className="grid items-center gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(220px,34%)]">
//           <div className="max-w-2xl">
//             <h3 className="text-xl font-bold leading-tight text-[#231F20] md:text-2xl">
//               Get up to ₦500 off your rides in the month of June!
//             </h3>
//             <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#231F20BF] md:text-base">
//               New users enjoy ₦500 discount on their ride
//               bookings. Book now and save instantly.
//             </p>
//             <button
//               type="button"
//               onClick={handleRidePromoClick}
//               className="mt-5 inline-flex items-center justify-center gap-3 rounded-lg bg-[#2F7D4B] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#25683E] focus:outline-none focus:ring-2 focus:ring-[#2F7D4B]/30 focus:ring-offset-2 md:px-6"
//             >
//               Book Now
//               <ArrowRight size={18} strokeWidth={2} />
//             </button>
//           </div>

//           <div className="flex justify-center sm:justify-end">
//             <img
//               src="/car.svg"
//               alt="SabiGuy ride service car"
//               className="w-full max-w-[230px] object-contain sm:max-w-[270px] lg:max-w-[330px]"
//               loading="lazy"
//             />
//           </div>
//         </div>
//       </section> */}

//       <div id="service-cards">
//         <CategoryCarousel
//           categories={categories}
//           onCategoryClick={handleCategoryClick}
//         />
//       </div>
//       {/* <div>
//         <NotificationTest />
//       </div> */}
//       <div className="mb-6 mt-4">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
//           <h3 className="text-[20px] font-semibold mb-4">Categories</h3>
//         </div>
//         <div id="explore-categories">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {services.map((ser, idx) => {
//               return (
//                 <ServicesCard
//                   key={idx}
//                   image={ser.image}
//                   tasks={ser.tasks}
//                   imageIncludesTitle={ser.imageIncludesTitle}
//                   title={ser.title}
//                   onClick={() => handleServiceClick(ser)}
//                   onTaskClick={(task) => handleServiceClick(ser, task)}
//                 />
//               );
//             })}
//           </div>
//         </div>

//         <ComingSoonModal
//           isOpen={modalOpen}
//           onClose={() => setModalOpen(false)}
//           service={selectedService}
//         />
//       </div>
//       {/* <div>
//         <h3 className="text-xl font-semibold mb-4">Featured Providers</h3>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {providers?.map((pro, idx) => (
//             <ProviderCard key={idx} {...pro} />
//           ))}
//         </div>
//       </div> */}
//     </DashboardLayout>
//   );
// }


import DashboardLayout from "../../../components/layouts/DashboardLayout";
import ProviderCard from "../../../components/dashboard/ProviderCard";
import CategoryCarousel from "../../../components/dashboard/CategoryCarousel";
import Button from "../../../components/dashboard/Button";
import { ArrowRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../stores/auth.store";
// import { getAllProviders } from "../../../api/provider";
import { useState } from "react";
import ServicesCard from "../../../components/dashboard/ServicesCard";
import {
  exploreCategories,
  getCategoryDestination,
} from "../../../other-services/dashboard/data/exploreCategories";
import new1 from "/new1.png";
import new2 from "/new2.png";
import new3 from "/new3.png";
import new4 from "/new4.png";
import new5 from "/new5.png";
import new6 from "/new6.png";
import new7 from "/new7.png";
import new8 from "/new8.png";
import ComingSoonModal from "../../../components/dashboard/ComingSoonModal";
import DashboardTour from "../../../components/tour/DashboardTour";
import NotificationTest from "../../../services/testNotify";

// Every service in the shared constants, each linking to its category page.
// The category page then asks the backend which providers actually offer it.
const searchableTasks = Array.from(
  new Map(
    exploreCategories
      .flatMap((category) =>
        (category.id === "transport" ? category.tasks : category.serviceNames)
          .map((task) => ({ category, task })),
      )
      .map(({ category, task }) => {
        const destination = getCategoryDestination(category, task);
        return [destination, { label: task, category: category.title, destination }];
      }),
  ).values(),
);

const COLLAPSED_SUGGESTION_COUNT = 4;

const findCategory = (id) => exploreCategories.find((category) => category.id === id);

export default function DashboardHome() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  const hydrated = useAuthStore((state) => state.hydrated);
  // const { providers, setProviders } = useProviderStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const query = searchTerm.trim().toLowerCase();
  const matchingTasks = query
    ? searchableTasks.filter(({ label, category }) =>
        [label, category].some((value) => value.toLowerCase().includes(query)),
      )
    : [];

  const providerSearchPath = `/dashboard/search?q=${encodeURIComponent(searchTerm.trim())}`;

  const submitSearch = () => {
    if (query) navigate(providerSearchPath);
  };

  if (!hydrated) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-4"></div>
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const categories = [
    {
      title: "Package Delivery",
      description: "Your items delivered quickly and safely",
      image: new1,
      comingSoon: false,
    },
    {
      title: "Book a Ride",
      description: "Reliable rides, ready whenever you are.",
      image: new2,
      // bgColor: "#BF4A0B4D",
      comingSoon: false,
    },
    {
      title: "Welding",
      description: "Reliable welding for repairs and fabrication",
      image: new3,
      // bgColor: "#72280080",
      destination: getCategoryDestination(findCategory("home-repair"), "Welder"),
    },
    {
      title: "Household Support",
      description: "Quick, dependable household assistance anytime.",
      image: new4,
      bgColor: "#0054AE80",
      destination: getCategoryDestination(findCategory("domestic")),
    },
    {
      title: "Towing & Roadside",
      description: "Fast help for breakdowns and emergencies",
      image: new5,
      bgColor: "#B100004D",
      destination: getCategoryDestination(findCategory("automotive"), "Towing"),
    },
    {
      title: "Legal & Financial",
      description: "Expert guidance for legal and financial needs",
      image: new6,
      bgColor: "#4800D94D",
      comingSoon: true,
    },
    {
      title: "Plumbing",
      description: "Fast help for breakdowns and emergencies",
      image: new7,
      bgColor: "#BF4A0B4D",
      destination: getCategoryDestination(findCategory("home-repair"), "Plumber"),
    },
    {
      title: "Digital Design",
      description: "Modern designs for web, brand, and media.",
      image: new8,
      bgColor: "#A30B4B4D",
      comingSoon: true,
    },
  ];

  const services = exploreCategories;

  const categoryServiceMap = {
    "Package Delivery": "package delivery",
    "Book a Ride": "book a ride",
  };

  const handleServiceClick = (service, task) => {
    const destination = getCategoryDestination(service, task);
    if (destination) navigate(destination);
    else {
      setSelectedService(service);
      setModalOpen(true);
    }
  };

  const handleCategoryClick = (category) => {
    if (category.comingSoon) return;
    if (category.destination) {
      navigate(category.destination);
      return;
    }
    const serviceValue = categoryServiceMap[category.title];
    if (serviceValue) {
      navigate(`/bookings?service=${encodeURIComponent(serviceValue)}`);
    } else {
      navigate("/bookings");
    }
  };

  // useEffect(() => {
  //   const loadProviders = async () => {
  //     const data = await getAllProviders(token);
  //     console.log("Setting providers:", data.data);
  //     setProviders(data.data);
  //   };

  //   loadProviders();
  // }, []);

  return (
    <DashboardLayout
      searchValue={searchTerm}
      onSearchChange={(value) => {
        setSearchTerm(value);
        setShowAllSuggestions(false);
      }}
      onSearchSubmit={submitSearch}
      searchPlaceholder="Search for anything"
    >
      <DashboardTour />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold mb-3">
            {" "}
            Welcome Back, {user?.data?.fullName?.split(" ")[0]} 👋
          </h2>
          <p className="mb-3 text-sm">What would you like to get done today?</p>
        </div>
      </div>

      {searchTerm.trim() && (
        <section aria-label="Service search results" className="mb-6 mt-4 max-w-2xl">
          <h3 className="mb-2 text-sm font-semibold text-[#231F20]">Services</h3>
          {matchingTasks.length ? (
            <ul className="divide-y divide-gray-200 border-y border-gray-200">
              {(showAllSuggestions
                ? matchingTasks
                : matchingTasks.slice(0, COLLAPSED_SUGGESTION_COUNT)
              ).map((task) => (
                <li key={task.destination}>
                  <button
                    type="button"
                    onClick={() => navigate(task.destination)}
                    className="flex w-full items-center justify-between gap-4 py-3 text-left hover:text-[#005823] focus-visible:outline-2 focus-visible:outline-[#005823]"
                  >
                    <span className="min-w-0"><span className="block text-sm font-medium">{task.label}</span><span className="block text-xs text-gray-500">{task.category}</span></span>
                    <ArrowRight size={17} className="shrink-0" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          ) : <p className="py-3 text-sm text-gray-500">No matching service found.</p>}
          {matchingTasks.length > COLLAPSED_SUGGESTION_COUNT && (
            <button
              type="button"
              onClick={() => setShowAllSuggestions((value) => !value)}
              aria-expanded={showAllSuggestions}
              className="mt-2 text-sm font-semibold text-[#005823] hover:underline focus-visible:outline-2 focus-visible:outline-[#005823]"
            >
              {showAllSuggestions
                ? "View less"
                : `View more (${matchingTasks.length - COLLAPSED_SUGGESTION_COUNT})`}
            </button>
          )}
          <button
            type="button"
            onClick={submitSearch}
            className="mt-4 flex w-full items-center gap-3 rounded-md border border-gray-200 bg-white px-3 py-3 text-left text-sm hover:border-[#005823] hover:text-[#005823] focus-visible:outline-2 focus-visible:outline-[#005823]"
          >
            <Search size={17} className="shrink-0 text-[#005823]" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate">
              Search providers &amp; businesses for “{searchTerm.trim()}”
            </span>
            <ArrowRight size={17} className="shrink-0" aria-hidden="true" />
          </button>
        </section>
      )}

      {/* <section
        aria-label="Ride booking promotion"
        className="mb-7 mt-2 overflow-hidden rounded-2xl border border-[#7BCB8C] bg-[#E7F6EC] px-4 py-5 shadow-sm sm:px-6 md:px-8"
      >
        <div className="grid items-center gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(220px,34%)]">
          <div className="max-w-2xl">
            <h3 className="text-xl font-bold leading-tight text-[#231F20] md:text-2xl">
              Get up to ₦500 off your rides in the month of June!
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#231F20BF] md:text-base">
              New users enjoy ₦500 discount on their ride
              bookings. Book now and save instantly.
            </p>
            <button
              type="button"
              onClick={handleRidePromoClick}
              className="mt-5 inline-flex items-center justify-center gap-3 rounded-lg bg-[#2F7D4B] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#25683E] focus:outline-none focus:ring-2 focus:ring-[#2F7D4B]/30 focus:ring-offset-2 md:px-6"
            >
              Book Now
              <ArrowRight size={18} strokeWidth={2} />
            </button>
          </div>

          <div className="flex justify-center sm:justify-end">
            <img
              src="/car.svg"
              alt="SabiGuy ride service car"
              className="w-full max-w-[230px] object-contain sm:max-w-[270px] lg:max-w-[330px]"
              loading="lazy"
            />
          </div>
        </div>
      </section> */}

      <div id="service-cards">
        <CategoryCarousel
          categories={categories}
          onCategoryClick={handleCategoryClick}
        />
      </div>
      {/* <div>
        <NotificationTest />
      </div> */}
      <div className="mb-6 mt-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
          <h3 className="text-[20px] font-semibold mb-4">Categories</h3>
        </div>
        <div id="explore-categories">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((ser, idx) => {
              return (
                <ServicesCard
                  key={idx}
                  image={ser.image}
                  tasks={ser.tasks}
                  imageIncludesTitle={ser.imageIncludesTitle}
                  title={ser.title}
                  onClick={() => handleServiceClick(ser)}
                  onTaskClick={(task) => handleServiceClick(ser, task)}
                />
              );
            })}
          </div>
        </div>

        <ComingSoonModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          service={selectedService}
        />
      </div>
      {/* <div>
        <h3 className="text-xl font-semibold mb-4">Featured Providers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers?.map((pro, idx) => (
            <ProviderCard key={idx} {...pro} />
          ))}
        </div>
      </div> */}
    </DashboardLayout>
  );
}