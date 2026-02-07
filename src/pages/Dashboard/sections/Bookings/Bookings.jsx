import DashboardLayout from "../../../../components/layouts/DashboardLayout";
import InputField from "../../../../components/InputField";
import { useState, useEffect } from "react";
import {
  jobTitles,
  allServices,
} from "../../../signup/ServiceProvider/AccountSetup/SkillsSection/jobData";
import Button from "../../../../components/button";
import RequestCard from "../../../../components/dashboard/RequestsCard";
import ServiceDetailsModal from "../ServiceDetailsModal";
import { Calendar, Clock, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { bookingPost} from "../../../../api/bookings";

export default function Bookings() {
  const [activeTab, setActiveTab] = useState("request");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  // Formik setup with dynamic validation schema
  const formik = useFormik({
    initialValues: {
      jobTitle: "",
      service: "",
      title: "",
      description: "",
      location: "",
      pickupLocation: "",
      dropoffLocation: "",
      serviceType: "",
      startDate: "",
      endDate: "",
      scheduleDate: "",
      budget: "",
    },
    validationSchema: Yup.object().shape({
      jobTitle: Yup.string().required("Work category is required"),
      service: Yup.string().required("Sub-category is required"),

      // Conditional validation for regular services
      title: Yup.string().when("jobTitle", {
        is: (val) => val !== "transport",
        then: (schema) => schema.required("Request title is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      description: Yup.string().when("jobTitle", {
        is: (val) => val !== "transport",
        then: (schema) =>
          schema
            .required("Task description is required")
            .min(10, "Description must be at least 10 characters"),
        otherwise: (schema) => schema.notRequired(),
      }),
      location: Yup.string().when("jobTitle", {
        is: (val) => val !== "transport",
        then: (schema) => schema.required("Location is required"),
        otherwise: (schema) => schema.notRequired(),
      }),

      // Conditional validation for transport services
      pickupLocation: Yup.string().when("jobTitle", {
        is: "transport",
        then: (schema) => schema.required("Pickup location is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      dropoffLocation: Yup.string().when("jobTitle", {
        is: "transport",
        then: (schema) => schema.required("Dropoff location is required"),
        otherwise: (schema) => schema.notRequired(),
      }),

      // Service type validation
      serviceType: Yup.string().required("Service type is required"),

      // Conditional validation for scheduled services
      scheduleDate: Yup.date().when(["serviceType", "jobTitle"], {
        is: (serviceType, jobTitle) =>
          serviceType === "schedule" && jobTitle === "transport",
        then: (schema) =>
          schema
            .required("Schedule date is required")
            .min(new Date(), "Date must be in the future"),
        otherwise: (schema) => schema.notRequired(),
      }),
      startDate: Yup.date().when(["serviceType", "jobTitle"], {
        is: (serviceType, jobTitle) =>
          serviceType === "schedule" && jobTitle !== "transport",
        then: (schema) =>
          schema
            .required("Start date is required")
            .min(new Date(), "Start date must be in the future"),
        otherwise: (schema) => schema.notRequired(),
      }),
      endDate: Yup.date().when(["serviceType", "jobTitle", "startDate"], {
        is: (serviceType, jobTitle, startDate) =>
          serviceType === "schedule" && jobTitle !== "transport" && startDate,
        then: (schema) =>
          schema
            .required("End date is required")
            .min(Yup.ref("startDate"), "End date must be after start date"),
        otherwise: (schema) => schema.notRequired(),
      }),

      // Budget validation
      budget: Yup.number()
        .required("Budget is required")
        .positive("Budget must be a positive number")
        .integer("Budget must be a whole number")
        .min(1000, "Budget must be at least ₦1,000"),
    }),
    onSubmit: async (values) => {
      console.log("Form submitted:", values);
      setLoading(true);
      setSuccessMessage("");
      setErrorMessage("");

      try {
        const payload = {
          serviceType: values.jobTitle,
          subCategory: values.service,
          title: values.title,
          address: "Osborne Foreshore Estate, Ikoyi, Lagos",
          pickupAddress: values.pickupLocation,
          dropoffAddress: values.dropoffLocation,
          scheduleType: values.serviceType,
          budget: parseFloat(values.budget),
          attachments: values.attachments,
        };

        console.log(payload);

        const res = await bookingPost(payload);
        console.log(res);

        if (res?.message) {
          setSuccessMessage(res.message);
        } else {
          setSuccessMessage("Booking created successfully!");
        }

        // Reset form
        formik.resetForm();

        setTimeout(() => {
          navigate("/dashboard/provider/searching");
        }, 1500);
      } catch (error) {
        console.error("Booking creation failed:", error);

        if (error.response) {
          setErrorMessage(
            error.response.data?.message ||
              "Booking creation failed. Try again.",
          );
        } else if (error.request) {
          setErrorMessage(
            "No response from server. Please check your connection.",
          );
        } else {
          setErrorMessage("Unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  const serviceOptions = formik.values.jobTitle
    ? allServices[formik.values.jobTitle] || []
    : [];
  const navigate = useNavigate();

  const isTransportLogistics = formik.values.jobTitle === "transport";

  const StatusFilter = ({ activeFilter, onFilterChange }) => {
    const filters = ["All", "Active", "Pending", "Completed"];

    return (
      <div className="flex gap-3 mb-6">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter.toLowerCase())}
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
              activeFilter === filter.toLowerCase()
                ? "bg-[#2D6A3E] text-white"
                : "bg-white text-gray-600 border border-gray-300 hover:border-[#2D6A3E] hover:text-[#2D6A3E]"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    );
  };

  const filteredRequests = requests.filter((request) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "active")
      return request.status.toLowerCase() === "in progress";
    return request.status.toLowerCase() === statusFilter;
  });

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto bg-gray-50 min-h-screen">
        <ServiceDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          request={selectedRequest || {}}
        />
        <h1 className="text-xl font-semibold p-4">My Bookings</h1>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("request")}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === "request"
                ? "text-[#005823] border-b-2 border-[#005823]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Request a service
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === "requests"
                ? "text-[#005823] border-b-2 border-[#005823]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            My Requests
          </button>
        </div>

        {activeTab === "request" ? (
          <form
            onSubmit={formik.handleSubmit}
            className="space-y-[20px] gap-4 p-5"
          >
            {/* Error Messages */}
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                {errorMessage}
              </div>
            )}

            {/* Success Messages */}
            {successMessage && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                {successMessage}
              </div>
            )}

            {/* Work Category */}
            <div>
              <InputField
                label="Select work category"
                select
                options={jobTitles}
                value={formik.values.jobTitle}
                onChange={(option) => {
                  formik.setFieldValue("jobTitle", option.value);
                  formik.setFieldValue("service", "");
                }}
                onBlur={() => formik.setFieldTouched("jobTitle", true)}
              />
              {formik.touched.jobTitle && formik.errors.jobTitle && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.jobTitle}
                </p>
              )}
            </div>

            {/* Subcategory */}
            <div>
              <InputField
                label="Sub-category"
                select
                options={[
                  { label: "Select Services", value: "" },
                  ...serviceOptions,
                ]}
                value={formik.values.service}
                onChange={(option) => {
                  formik.setFieldValue("service", option.value);
                }}
                onBlur={() => formik.setFieldTouched("service", true)}
                disabled={!formik.values.jobTitle}
              />
              {formik.touched.service && formik.errors.service && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.service}
                </p>
              )}
            </div>

            {/* Conditional Fields Based on Category */}
            {isTransportLogistics ? (
              <>
                {/* Transport & Logistics Fields */}
                <div>
                  <InputField
                    name="pickupLocation"
                    label="Pickup location"
                    placeholder="24 Palm Avenue, Lagos"
                    value={formik.values.pickupLocation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.pickupLocation &&
                    formik.errors.pickupLocation && (
                      <p className="mt-1 text-sm text-red-600">
                        {formik.errors.pickupLocation}
                      </p>
                    )}
                </div>

                <div>
                  <InputField
                    name="dropoffLocation"
                    label="Dropoff location"
                    placeholder="24 Palm Avenue, Lagos"
                    value={formik.values.dropoffLocation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.dropoffLocation &&
                    formik.errors.dropoffLocation && (
                      <p className="mt-1 text-sm text-red-600">
                        {formik.errors.dropoffLocation}
                      </p>
                    )}
                </div>

                {/* Show distance if both locations are filled */}
                {formik.values.pickupLocation &&
                  formik.values.dropoffLocation && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>15km</span>
                    </div>
                  )}
              </>
            ) : (
              <>
                {/* Regular Service Fields */}
                <div>
                  <InputField
                    name="title"
                    label="Request a title"
                    placeholder="e.g Need an electrician home wiring."
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.title && formik.errors.title && (
                    <p className="mt-1 text-sm text-red-600">
                      {formik.errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Tell us the details of your task"
                    rows={4}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-md placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent ${
                      formik.touched.description && formik.errors.description
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {formik.errors.description}
                    </p>
                  )}
                </div>

                <div className="w-1/3">
                  <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 text-sm cursor-pointer hover:border-gray-400 hover:text-gray-600 transition">
                    <Upload className="w-5 h-5" />
                    <span>Add photo/video (optional)</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*,video/*"
                      multiple
                    />
                  </label>
                </div>

                <div>
                  <InputField
                    name="location"
                    label="Location"
                    placeholder="Your Location"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.location && formik.errors.location && (
                    <p className="mt-1 text-sm text-red-600">
                      {formik.errors.location}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Service Type (Common for both) */}
            <div className="relative">
              <div>
                <InputField
                  label="Service Type"
                  select
                  options={[
                    { label: "Select service type", value: "" },
                    { label: "Immediate", value: "immediate" },
                    { label: "Schedule", value: "schedule" },
                  ]}
                  value={formik.values.serviceType}
                  onChange={(option) =>
                    formik.setFieldValue("serviceType", option.value)
                  }
                  onBlur={() => formik.setFieldTouched("serviceType", true)}
                />
                {formik.touched.serviceType && formik.errors.serviceType && (
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.serviceType}
                  </p>
                )}
              </div>
              {formik.values.serviceType === "immediate" && (
                <Clock className="absolute right-4 top-[55%] w-5 h-5 text-gray-400 pointer-events-none" />
              )}
              {formik.values.serviceType === "schedule" && (
                <Calendar className="absolute right-4 top-[55%] w-5 h-5 text-gray-400 pointer-events-none" />
              )}
            </div>

            {/* Schedule Date (if schedule is selected) */}
            {formik.values.serviceType === "schedule" &&
              (isTransportLogistics ? (
                <div className="relative">
                  <div>
                    <InputField
                      name="scheduleDate"
                      label="Select Date"
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={formik.values.scheduleDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.scheduleDate &&
                      formik.errors.scheduleDate && (
                        <p className="mt-1 text-sm text-red-600">
                          {formik.errors.scheduleDate}
                        </p>
                      )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <div>
                      <InputField
                        name="startDate"
                        label="Start Date"
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={formik.values.startDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.startDate && formik.errors.startDate && (
                        <p className="mt-1 text-sm text-red-600">
                          {formik.errors.startDate}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <div>
                      <InputField
                        name="endDate"
                        label="End Date"
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={formik.values.endDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.endDate && formik.errors.endDate && (
                        <p className="mt-1 text-sm text-red-600">
                          {formik.errors.endDate}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

            {/* Budget */}
            <div>
              <InputField
                name="budget"
                label="Your Budget"
                placeholder="Enter Amount"
                type="number"
                value={formik.values.budget}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.budget && formik.errors.budget && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.budget}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex flex-col">
              <Button variant="secondary" type="submit" disabled={loading}>
                {loading ? "Creating Booking..." : "Post Request"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="mt-5">
            {/* Status Filter */}
            <StatusFilter
              activeFilter={statusFilter}
              onFilterChange={setStatusFilter}
            />

            {/* Request Cards */}
            <div className="space-y-4">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onViewDetails={handleViewDetails}
                  />
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-lg">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No requests found
                  </h3>
                  <p className="text-gray-600">
                    No requests match the selected filter.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// Sample requests data
const requests = [
  {
    id: 1,
    title: "Electrical Installation",
    status: "Pending",
    providerName: "Phil Crook",
    providerImage: "https://i.pravatar.cc/40",
    orderId: "ORD 001",
    price: 50000,
    deliveryDate: "Oct 13, 2025",
    scheduledDate: "Oct 10, 2025 - 9 AM",
    startsIn: "1h 57m 48s",
    ratings: null,
  },
  {
    id: 2,
    title: "Electrical Installation",
    status: "In Progress",
    providerName: "Phil Crook",
    providerImage: "https://i.pravatar.cc/49",
    orderId: "ORD 001",
    price: 50000,
    deliveryDate: "Oct 13, 2025",
    scheduledDate: "Oct 08, 2025 - 10 AM",
    startsIn: null,
    ratings: null,
  },
  {
    id: 3,
    title: "Plumbing Repair",
    status: "Completed",
    providerName: "John Smith",
    providerImage: "https://i.pravatar.cc/45",
    orderId: "ORD 002",
    price: 35000,
    deliveryDate: "Oct 05, 2025",
    scheduledDate: "Oct 01, 2025 - 2 PM",
    startsIn: null,
    ratings: null,
  },
  {
    id: 4,
    title: "Plumbing Repair",
    status: "Completed",
    providerName: "John Smith",
    providerImage: "https://i.pravatar.cc/45",
    orderId: "ORD 002",
    price: 35000,
    deliveryDate: "Oct 05, 2025",
    scheduledDate: "Oct 01, 2025 - 2 PM",
    startsIn: null,
    ratings: 3.0,
  },
  {
    id: 5,
    title: "Plumbing Repair",
    status: "Waiting confirmation",
    providerName: "John Smith",
    providerImage: "https://i.pravatar.cc/45",
    orderId: "ORD 002",
    price: 35000,
    deliveryDate: "Oct 05, 2025",
    scheduledDate: "Oct 01, 2025 - 2 PM",
    startsIn: null,
    ratings: null,
  },
];
