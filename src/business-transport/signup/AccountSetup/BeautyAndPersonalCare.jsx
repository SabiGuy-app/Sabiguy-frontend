import { IoIosArrowBack } from "react-icons/io";
import AccountSetupLayout from "./layout";
import InputField from "../../../../components/InputField";
import { useState } from "react";
import { Check, ChevronDown, CloudUpload, Plus } from "lucide-react";

const BeautyAndPersonalCare = ({ onBack }) => {
  const [experience, setExperience] = useState("");

  const services = [
    { id: 1, name: "Braiding" },
    { id: 2, name: "Hair Dresser" },
    { id: 3, name: "Spa" },
    { id: 4, name: "Lash Tech" },
    { id: 5, name: "Pedicure" },
    { id: 6, name: "Nails Tech" },
  ];

  const [selectedServices, setSelectedServices] = useState([]);
  // Service Locations State (defaulting to the two selected in your image)
  const [selectedLocations, setSelectedLocations] = useState([]);

  // Handlers
  const toggleLocation = (value) => {
    setSelectedLocations((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const businessData = {
    businessCategory: "Beauty & Personal Care",

    services: [
      { id: 1, name: "Braiding", status: false },
      { id: 2, name: "Hair Dresser", status: false },
      { id: 3, name: "Spa", status: false },
      { id: 4, name: "Lash Tech", status: false },
      { id: 5, name: "Pedicure", status: false },
      { id: 6, name: "Nails Tech", status: false },
    ],

    experience: ["0-2 years", "2-5 years", "5-10 years", "10+ years"],

    businessHours: {
      type: "every_day",
      openingTime: "09:00 AM",
      closingTime: "06:00 PM",

      availableDays: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },

    serviceLocations: [
      {
        id: 1,
        name: "Customer Address",
        value: "customer_address",
      },
      {
        id: 2,
        name: "Walk in Salon",
        value: "walk_in_salon",
      },
      {
        id: 3,
        name: "My Home Address",
        value: "my_home_address",
      },
    ],

    photos: [],
  };

  const [scheduleType, setScheduleType] = useState(
    businessData.businessHours.type,
  );
  const [openingTime, setOpeningTime] = useState(
    businessData.businessHours.openingTime,
  );
  const [closingTime, setClosingTime] = useState(
    businessData.businessHours.closingTime,
  );
  const [selectedDays, setSelectedDays] = useState([]);

  const timeOptions = [
    "07:00 AM",
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
  ];
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const toggleService = (id) => {
    setSelectedServices((prev) => {
      if (prev.includes(id)) {
        return prev.filter((serviceId) => serviceId !== id);
      }
      return [...prev, id];
    });
  };

  return (
    <AccountSetupLayout currentStep={0}>
      <div>
        <div
          onClick={onBack}
          className="flex items-center gap-2 w-fit mb-8 cursor-pointer"
        >
          <IoIosArrowBack size={24} />
          <h2 className="text-lg">Back</h2>
        </div>
        <div>
          <h2 className="text-[20px] text-[#231F20] font-semibold mb-2">
            Verify your skill
          </h2>
          <p className="text-[#231F20BF] text-[16px] mb-6">
            Complete your verification to build trust with customers and access
            more features.
          </p>

          <div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold">Business category</h3>
                <div className="border rounded-lg py-2.5 px-4 bg-[#231F200D] border-[#231F2040] h-15 flex justify-between items-center font-normal text-[#231F20BF]">
                  {businessData.businessCategory}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-semibold">Services you provide</h3>
                  <p className="text-[#231F20BF]">
                    Choose all the services your business offers.
                  </p>
                  <div className="w-full flex gap-3 flex-wrap">
                    {services.map((service) => {
                      const isSelected = selectedServices.includes(service.id);

                      return (
                        <button
                          onClick={() => toggleService(service.id)}
                          className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium transition-all duration-200
                           ${
                             isSelected
                               ? "border-[#34805A] bg-[#34805A] text-white"
                               : "border-gray-300 bg-white text-gray-700 hover:border-[#34805A] hover:text-[#34805A]"
                           }`}
                          type="button"
                          key={service.id}
                        >
                          {isSelected ? (
                            <Check size={18} strokeWidth={2} />
                          ) : (
                            <Plus size={18} strokeWidth={2} />
                          )}
                          {service.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="font-semibold">Experience</h3>

                <div className="relative w-full">
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full border rounded-lg py-2.5 px-4 bg-[#231F200D] border-[#231F2040] h-15 appearance-none outline-none focus:border-[#3B82F6] focus:bg-white transition-all cursor-pointer font-normal text-[#231F20BF]"
                  >
                    <option value="" disabled>
                      Select experience
                    </option>

                    {businessData.experience.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-600">
                    <ChevronDown size={20} strokeWidth={2} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="font-semibold">Business Hours</h3>
                <p className="text-[#231F20BF]">
                  Set when customers can book your services.
                </p>

                {/* Business Hours */}
                <div className="flex flex-col gap-5 mt-2">
                  <div className="flex items-center gap-6">
                    {/* Every day Radio */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                          scheduleType === "every_day"
                            ? "border-[#34805A]"
                            : "border-gray-300"
                        }`}
                        onClick={() => setScheduleType("every_day")}
                      >
                        {scheduleType === "every_day" && (
                          <div className="h-2.5 w-2.5 rounded-full bg-[#34805A]" />
                        )}
                      </div>
                      <span
                        className={`font-medium ${scheduleType === "every_day" ? "text-[#34805A]" : "text-gray-500"}`}
                      >
                        Every day
                      </span>
                    </label>

                    {/* 24/7 Radio */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                          scheduleType === "24_7"
                            ? "border-[#34805A]"
                            : "border-gray-300"
                        }`}
                        onClick={() => setScheduleType("24_7")}
                      >
                        {scheduleType === "24_7" && (
                          <div className="h-2.5 w-2.5 rounded-full bg-[#34805A]" />
                        )}
                      </div>
                      <span
                        className={`font-medium ${scheduleType === "24_7" ? "text-[#34805A]" : "text-gray-500"}`}
                      >
                        24/7
                      </span>
                    </label>
                  </div>

                  {/* Times */}
                  <div className="flex w-full items-end gap-3">
                    <div className="flex w-full flex-col gap-1.5">
                      <label className="text-[15px] text-gray-600">
                        Opening time
                      </label>
                      <div className="relative w-full">
                        <select
                          disabled={scheduleType === "24_7"}
                          value={
                            scheduleType === "24_7" ? "12:00 AM" : openingTime
                          }
                          onChange={(e) => setOpeningTime(e.target.value)}
                          className="w-full appearance-none rounded-lg border border-[#231F2040] bg-white px-4 py-2.5 text-[15px] text-gray-700 outline-none transition-all focus:border-[#3B82F6] disabled:bg-gray-100 disabled:opacity-70 cursor-pointer"
                        >
                          {timeOptions.map((time) => (
                            <option key={`open-${time}`} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                          <ChevronDown size={18} strokeWidth={2} />
                        </div>
                      </div>
                    </div>

                    <div className="mb-3 text-gray-400">—</div>

                    <div className="flex w-full flex-col gap-1.5">
                      <label className="text-[15px] text-gray-600">
                        Closing time
                      </label>
                      <div className="relative w-full">
                        <select
                          disabled={scheduleType === "24_7"}
                          value={
                            scheduleType === "24_7" ? "11:59 PM" : closingTime
                          }
                          onChange={(e) => setClosingTime(e.target.value)}
                          className="w-full appearance-none rounded-lg border border-[#231F2040] bg-white px-4 py-2.5 text-[15px] text-gray-700 outline-none transition-all focus:border-[#3B82F6] disabled:bg-gray-100 disabled:opacity-70 cursor-pointer"
                        >
                          {timeOptions.map((time) => (
                            <option key={`close-${time}`} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                          <ChevronDown size={18} strokeWidth={2} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Available Days */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[15px] text-gray-600">
                      Available days
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {daysOfWeek.map((day) => {
                        const isSelected = selectedDays.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            disabled={scheduleType === "24_7"}
                            onClick={() => toggleDay(day)}
                            className={`min-w-[52px] rounded-full px-2.5 py-1 text-[14px] transition-all disabled:opacity-60 ${
                              isSelected
                                ? "border border-[#34805A] bg-[#34805A] text-white"
                                : "border border-gray-300 bg-white text-gray-600 hover:border-[#34805A] hover:text-[#34805A]"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Where do you provide your service */}
                  <div className="flex flex-col gap-3 mt-4">
                    <div>
                      <h3 className="font-semibold text-[#231F20]">
                        Where do you provide your service
                      </h3>
                      <p className="text-[#231F20BF] text-sm mt-1">
                        Select all that apply
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-1">
                      {businessData.serviceLocations.map((location) => {
                        const isSelected = selectedLocations.includes(
                          location.value,
                        );
                        return (
                          <button
                            key={location.id}
                            type="button"
                            onClick={() => toggleLocation(location.value)}
                            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                              isSelected
                                ? "border-[#34805A] bg-[#34805A] text-white"
                                : "border-gray-300 bg-white text-gray-700 hover:border-[#34805A] hover:text-[#34805A]"
                            }`}
                          >
                            {isSelected ? (
                              <Check size={16} strokeWidth={2.5} />
                            ) : (
                              <Plus size={16} strokeWidth={2.5} />
                            )}
                            {location.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Photos of your work */}
                  <div className="flex flex-col gap-3 mt-4">
                    <div>
                      <h3 className="font-semibold text-[#231F20] flex gap-1">
                        Photos of your work
                        <span className="text-[#231F20BF] font-normal">
                          (optional)
                        </span>
                      </h3>
                      <p className="text-[#231F20BF] text-sm mt-1">
                        Upload clear photos that show your work or tools.
                      </p>
                    </div>

                    {/* Upload Dropzone */}
                    <div className="relative mt-2 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-400 bg-white py-10 transition-all hover:bg-gray-50">
                      <input
                        type="file"
                        multiple
                        accept=".jpg,.jpeg,.png,.pdf"
                        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                      />

                      <div className="flex flex-col items-center justify-center gap-3">
                        <CloudUpload
                          size={36}
                          className="text-[#34805A]"
                          strokeWidth={1.5}
                        />

                        <p className="text-base text-gray-700">
                          Upload pictures
                          <span className="font-semibold text-[#34805A]">
                            Browse
                          </span>
                        </p>

                        <p className="text-xs md:text-sm text-gray-400">
                          JPEG, PNG, PDF format, Max 5 MB each
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Buttons */}
                  <div className="mt-12 flex justify-end gap-4 border-t border-gray-100 pt-6">
                    <button
                      type="button"
                      onClick={onBack}
                      className="rounded-lg border border-[#34805A] bg-white px-8 py-2.5 font-semibold text-[#34805A] transition-all hover:bg-green-50"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-[#34805A] px-8 py-2.5 font-semibold text-white transition-all hover:bg-[#296647]"
                    >
                      Save & Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AccountSetupLayout>
  );
};

export default BeautyAndPersonalCare;
