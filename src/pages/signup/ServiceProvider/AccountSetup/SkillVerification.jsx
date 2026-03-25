import AccountSetupLayout from "./layout";
import { useState } from "react";
import Button from "../../../../components/button";
import InputField from "../../../../components/InputField";
import { IoIosArrowBack, IoIosAdd } from "react-icons/io";
import { jobTitles, allServices } from "./SkillsSection/jobData";
import { jobSections } from "./SkillsSection/SkillsSection";
import AddService from "./SkillsSection/AddService";
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import { Formik, ErrorMessage } from "formik";

export default function SkillsVerification({ onNext, onBack }) {
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [addService, setAddService] = useState(false);
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const serviceOptions = selectedJobTitle
    ? allServices[selectedJobTitle] || []
    : [];

  const SelectedSection = jobSections[selectedJobTitle];

  const token = localStorage.getItem("token");

  const handleSubmit = async (values) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      // Build dynamic fields based on selected job title
      const dynamicFields = {};

      if (selectedJobTitle === "transport") {
        dynamicFields.driverLicenseNumber = values.driverLicenseNumber;
        dynamicFields.vehicleColor = values.vehicleColor;
        dynamicFields.vehicleName = values.vehicleName;
        dynamicFields.vehicleRegNo = values.vehicleRegNo;
        dynamicFields.vehicleProductionYear = values.vehicleProductionYear;
      } else if (selectedJobTitle === "domestic") {
        dynamicFields.fullName = values.fullName;
        dynamicFields.nationalId = values.nationalId;
        dynamicFields.referenceContact = values.referenceContact;
      } else if (selectedJobTitle === "emergency") {
        dynamicFields.emergencyServiceId = values.emergencyServiceId;
        dynamicFields.certificationNumber = values.certificationNumber;
      } else if (selectedJobTitle === "home_repair") {
        dynamicFields.licenseNumber = values.licenseNumber;
        dynamicFields.yearsOfExperience = values.yearsOfExperience;
      } else if (selectedJobTitle === "professional") {
        dynamicFields.professionalLicense = values.professionalLicense;
        dynamicFields.organizationName = values.organizationName;
      } else if (selectedJobTitle === "freelance") {
        dynamicFields.portfolioUrl = values.portfolioUrl;
        dynamicFields.freelanceExperience = values.freelanceExperience;
      }

      const payload = {
        job: [
          {
            service: values.title,
            title: values.service,
            tagLine: values.tagLine,
          },
        ],
        ...dynamicFields,

        service: services.map((s) => ({
          serviceName: s.name,
          pricingModel: s.pricingModel,
          price: s.price,
        })),
      };
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/provider/job-service`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("Registration successful");
        onNext();
      } else {
        setErrorMessage(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      if (error.response) {
        setErrorMessage(error.response.data?.message || "An error occurred");
      } else if (error.request) {
        setErrorMessage("No response from the server. Please try again later.");
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = (index) => {
    setServices((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditService = (service, index) => {
    setEditingService({ ...service, index });
    setAddService(true);
  };

  const handleSaveService = (newService) => {
    if (editingService) {
      setServices((prev) =>
        prev.map((service, index) =>
          index === editingService.index ? newService : service,
        ),
      );
      setEditingService(null);
    } else {
      setServices((prev) => [...prev, newService]);
    }
  };

  return (
    <AccountSetupLayout currentStep={3}>
      <div className="mt-4">
        <div
          onClick={onBack}
          className="flex items-center gap-2 w-fit mb-8 cursor-pointer"
        >
          <IoIosArrowBack size={24} />
          <h2 className="text-lg">Back</h2>
        </div>
        <h2 className="text-xl font-semibold mb-2">Verify your skill</h2>
        <Formik
          initialValues={{
            service: "",
            title: "",
            tagLine: "",
            // Transport fields
            driverLicenseNumber: "",
            vehicleProductionYear: "",
            vehicleName: "",
            vehicleRegNo: "",
            vehicleColor: "",

            // Domestic fields
            fullName: "",
            nationalId: "",
            referenceContact: "",
            // Emergency fields
            emergencyServiceId: "",
            certificationNumber: "",
            // Home Repair fields
            licenseNumber: "",
            yearsOfExperience: "",
            // Professional fields
            professionalLicense: "",
            organizationName: "",
            // Freelance fields
            portfolioUrl: "",
            freelanceExperience: "",
          }}
          onSubmit={handleSubmit}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
          }) => {
            const isFormComplete = (() => {
              if (!values.title || !values.service) return false;
              if (selectedJobTitle === "transport") {
                return (
                  values.driverLicenseNumber &&
                  values.vehicleColor &&
                  values.vehicleName &&
                  values.vehicleRegNo &&
                  values.vehicleProductionYear
                );
              }
              if (selectedJobTitle === "domestic") {
                return (
                  values.fullName &&
                  values.nationalId &&
                  values.referenceContact
                );
              }
              if (selectedJobTitle === "emergency") {
                return values.emergencyServiceId && values.certificationNumber;
              }
              if (selectedJobTitle === "home_repair") {
                return values.licenseNumber && values.yearsOfExperience;
              }
              if (selectedJobTitle === "professional") {
                return values.professionalLicense && values.organizationName;
              }
              if (selectedJobTitle === "freelance") {
                return values.portfolioUrl && values.freelanceExperience;
              }
              return false;
            })();

            return (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-9">
              <InputField
                select
                options={jobTitles}
                value={values.title}
                onChange={(option) => {
                  setFieldValue("title", option.value);
                  setSelectedJobTitle(option.value);
                  setFieldValue("service", "");
                  setSelectedService("");
                }}
              />
              {/* Dynamic Section       */}
              <InputField
                select
                options={[
                  { label: "Select Services", value: "" },
                  ...serviceOptions,
                ]}
                value={values.service}
                onChange={(option) => {
                  setFieldValue("service", option.value);
                  setSelectedService(option.value);
                }}
                disabled={!selectedJobTitle}
              />

              {/* Render Dynamic Section based on selected job title */}
              {SelectedSection && selectedJobTitle && (
                <SelectedSection
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />
              )}

              {/* <InputField
                name="tagLine"
                label="Tagline"
                value={values.tagLine}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g Trusted electrician for home and office wiring."
                italicPlaceholder
              />

              <p className="font-semibold text-xl">
                Add your Services & Pricing
              </p>
              <p>
                List the services you offer and set fair prices so customers
                know what to expect.
              </p>
              <div className="flex flex-col gap-3 mt-3">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border border-gray-300 rounded-lg p-3 shadow-sm bg-white"
                  >
                    <div>
                      <h3 className="font-semibold text-lg">{service.name}</h3>
                      <p className="text-green-700 font-semibold">
                        ₦{service.price}
                        <span className="text-gray-500 font-normal ml-2">
                          • {service.pricingModelLabel}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-gray-500">
                      <Pencil
                        className="w-4 h-4 cursor-pointer hover:text-gray-700"
                        onClick={() => handleEditService(service, index)}
                      />
                      <Trash2
                        className="w-4 h-4 cursor-pointer hover:text-red-600"
                        onClick={() => handleDeleteService(index)}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="flex items-center gap-1 border border-gray-300 rounded-md w-40 py-1 font-semibold text-gray-700 bg-white hover:bg-[#8BC53FBF] transition"
                onClick={() => setAddService(true)}
              >
                <IoIosAdd size={25} className="text-gray-600" />
                <span>Add New Service</span>
              </button>
              {errorMessage && (
                <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="text-green-600 text-sm mt-2">{successMessage}</p>
              )} */}

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  className="border border-[#005823BF] text-[#005823BF] px-6 py-2 rounded-lg hover:bg-[#005823BF]/10 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-[#005823BF] text-white px-6 py-2 rounded-lg hover:bg-[#004e1a] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || !isFormComplete}
                >
                  {loading ? "Saving..." : "Save & Continue"}
                </button>
              </div>

              <AddService
                isOpen={addService}
                onClose={() => {
                  setAddService(false);
                  setEditingService(null);
                }}
                onSave={handleSaveService}
                editingService={editingService}
              />
            </form>
            );
          }}
        </Formik>
      </div>
    </AccountSetupLayout>
  );
}
