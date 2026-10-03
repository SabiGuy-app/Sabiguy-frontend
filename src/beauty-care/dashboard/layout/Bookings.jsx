import { useState } from "react";
import { Timer } from "lucide-react";
import BeautyDashboardLayout from "./BeautyDashboardLayout";

const serviceOptions = [
  "Select Service",
  "Facial",
  "Manicure & Pedicure",
  "Hair Styling",
  "Massage",
  "Bridal Makeup",
];

const categoryOptions = [
  "Select Category",
  "Skincare",
  "Nail Care",
  "Hair Care",
  "Body Care",
  "Makeup",
];

const typeOptions = ["Pickup now", "Schedule later"];

export default function Bookings() {
  const [activeTab, setActiveTab] = useState("request");
  const [selectedService, setSelectedService] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [location, setLocation] = useState("24 Palm Avenue, Lagos");
  const [serviceType, setServiceType] = useState("Pickup now");

  return (
    <BeautyDashboardLayout customerView>
      <section className="min-h-[calc(100vh-7rem)]">
        <h1 className="mb-3 text-lg font-semibold text-[#282526]">
          My Bookings
        </h1>

        <div className="mb-3 flex h-[46px] items-stretch rounded-lg bg-white px-5">
          <button
            type="button"
            onClick={() => setActiveTab("request")}
            className={`relative px-1 text-sm transition-colors ${
              activeTab === "request"
                ? "font-semibold text-[#005823]"
                : "text-[#5f5c5d]"
            }`}
          >
            Request a service
            {activeTab === "request" && (
              <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#005823]" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("requests")}
            className={`relative ml-8 px-1 text-sm transition-colors ${
              activeTab === "requests"
                ? "font-semibold text-[#005823]"
                : "text-[#5f5c5d]"
            }`}
          >
            My Requests
            {activeTab === "requests" && (
              <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#005823]" />
            )}
          </button>
        </div>

        <div className="min-h-[540px] rounded-lg bg-white px-5 py-5 sm:px-10">
          {activeTab === "request" ? (
            <form
              className="space-y-4"
              onSubmit={(event) => event.preventDefault()}
            >
              <div>
                <label className="mb-2 block text-xs font-medium text-[#5f5c5d]">
                  Select work category
                </label>
                <div className="relative">
                  <select
                    value={selectedService}
                    onChange={(event) => setSelectedService(event.target.value)}
                    className="h-[38px] w-full appearance-none rounded-md border border-[#d8d8d8] bg-[#f5f5f5] px-3 pr-10 text-xs text-[#5f5c5d] outline-none transition focus:border-[#005823]"
                  >
                    {serviceOptions.map((option) => (
                      <option
                        key={option}
                        value={option === "Select Service" ? "" : option}
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#6b7280]">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-[#5f5c5d]">
                  Subcategory
                </label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                    className="h-[38px] w-full appearance-none rounded-md border border-[#d8d8d8] bg-[#f5f5f5] px-3 pr-10 text-xs text-[#5f5c5d] outline-none transition focus:border-[#005823]"
                  >
                    {categoryOptions.map((option) => (
                      <option
                        key={option}
                        value={option === "Select Category" ? "" : option}
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#6b7280]">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-[#5f5c5d]">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="h-[38px] w-full rounded-md border border-[#d8d8d8] bg-[#f5f5f5] px-3 text-xs text-[#5f5c5d] outline-none transition focus:border-[#005823]"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-[#5f5c5d]">
                  Service Type
                </label>
                <div className="relative">
                  <Timer
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#292526]"
                  />
                  <select
                    value={serviceType}
                    onChange={(event) => setServiceType(event.target.value)}
                    className="h-[38px] w-full appearance-none rounded-md border border-[#d8d8d8] bg-[#f5f5f5] pl-9 pr-10 text-xs text-[#292526] outline-none transition focus:border-[#005823]"
                  >
                    {typeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#6b7280]">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="mt-3 h-10 w-full rounded-sm bg-[#34805a] px-6 text-center text-xs font-semibold text-white transition-colors hover:bg-[#286b49]"
              >
                Continue
              </button>
            </form>
          ) : (
            <p className="py-5 text-sm text-[#6b7280]">No requests yet.</p>
          )}
        </div>
      </section>
    </BeautyDashboardLayout>
  );
}
