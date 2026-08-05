import { useRef, useState } from "react";
import {
  Pencil,
  Trash2,
  UploadCloud,
  ChevronDown,
  AlertTriangle,
  X,
  Car,
} from "lucide-react";
import InputField from "../../../../components/InputField";
import BusinessSetupLayout from "../BusinessSetupLayout";
import { IoIosArrowBack } from "react-icons/io";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";

const VEHICLE_TYPES = [
  { id: "car", label: "Car driver (2000 below)" },
  { id: "car_premium", label: "Car driver (above 2000)" },
  { id: "motorbike", label: "Motorbike driver" },
  // { id: "keke", label: "Keke driver (Tricycle)" },
];

const MIN_PICTURES = 2;
const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

const VehicleSchema = Yup.object().shape({
  name: Yup.string().trim().required("Vehicle name is required"),
  plate: Yup.string().trim().required("Plate number is required"),
});

export default function AddVehicleForm({ onBack, onNext }) {
  const [vehicles, setVehicles] = useState([]);
  const [type, setType] = useState("car");
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [listError, setListError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [pictures, setPictures] = useState([]);
  const [pictureError, setPictureError] = useState("");
  const formikRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFiles = (fileList) => {
    const incoming = Array.from(fileList || []);
    if (incoming.length === 0) return;

    const valid = [];
    let rejection = "";

    incoming.forEach((file) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        rejection = "Only JPEG, PNG or PDF files are allowed.";
        return;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        rejection = `Each file must be under ${MAX_FILE_SIZE_MB}MB.`;
        return;
      }
      valid.push({
        id: `${Date.now()}-${file.name}-${Math.random()}`,
        file,
        name: file.name,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : null,
      });
    });

    if (rejection) setPictureError(rejection);
    else setPictureError("");

    if (valid.length > 0) {
      setPictures((prev) => [...prev, ...valid]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleRemovePicture = (id) => {
    setPictures((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddVehicle = (values, { resetForm }) => {
    if (pictures.length < MIN_PICTURES) {
      setPictureError(
        `Please upload at least ${MIN_PICTURES} pictures with plates visible.`,
      );
      return;
    }

    if (editingId) {
      setVehicles((vs) =>
        vs.map((v) =>
          v.id === editingId
            ? { ...v, name: values.name, plate: values.plate, type, pictures }
            : v,
        ),
      );
    } else {
      setVehicles((vs) => [
        ...vs,
        {
          id: Date.now(),
          name: values.name,
          plate: values.plate,
          type,
          pictures,
          status: "pending",
        },
      ]);
    }
    setEditingId(null);
    setType("car");
    setPictures([]);
    setPictureError("");
    setListError("");
    resetForm();
  };

  const handleEdit = (vehicle) => {
    setType(vehicle.type);
    setEditingId(vehicle.id);
    setPictures(vehicle.pictures || []);
    formikRef.current?.setValues({ name: vehicle.name, plate: vehicle.plate });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setType("car");
    setPictures([]);
    setPictureError("");
    formikRef.current?.resetForm();
  };

  const handleDelete = (id) => {
    setVehicles((vs) => vs.filter((v) => v.id !== id));
    if (editingId === id) handleCancelEdit();
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (vehicles.length === 0) {
      setListError("Add at least one vehicle before continuing.");
      return;
    }

    setSubmitting(true);
    try {
      setListError("");
      setSuccessMessage("Vehicles saved successfully!");
      onNext();
    } catch (error) {
      console.error("AddVehicle submit error:", error);
      if (error.response) {
        setErrorMessage(
          error.response.data?.message ||
            "Unable to save your vehicles. Please try again.",
        );
      } else if (error.request) {
        setErrorMessage("No response from the server. Please try again later.");
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BusinessSetupLayout currentStep={2}>
      <div style={{ background: "#fff", minHeight: "100vh" }} className="">
        <div
          onClick={onBack}
          className="flex items-center gap-2 w-fit cursor-pointer"
        >
          <IoIosArrowBack size={24} />
          <h2 className="text-lg">Back</h2>
        </div>
        <div className="w-full max-w-lg px-5 py-8">
          <h1 className="text-[20px] font-semibold text-[#231F20]">
            Add Vehicle
          </h1>
          <p className="mt-1.5 text-[16px] leading-snug text-[#231F20BF]">
            Enter your vehicle details carefully. Once submitted, these details
            cannot be edited.
          </p>

          {vehicles.length > 0 && (
            <div className="mt-6 space-y-3">
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                      <Car size={18} />
                    </div>
                    <div>
                      <p className="text-[16px] font-medium text-gray-900">
                        {v.name}
                      </p>
                      <p className="text-[14px] font-medium text-[#005823]">
                        {v.plate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {v.status === "pending" && (
                      <span className="rounded-full bg-[#FEF3C7] px-3 py-1 text-[11px] font-medium text-[#92400E]">
                        Pending review
                      </span>
                    )}
                    {v.status === "approved" && (
                      <span className="rounded-full bg-[#DCFCE7] px-3 py-1 text-[11px] font-medium text-[#166534]">
                        Approved
                      </span>
                    )}
                    {v.status === "rejected" && (
                      <span className="rounded-full bg-[#FEE2E2] px-3 py-1 text-[11px] font-medium text-[#991B1B]">
                        Rejected
                      </span>
                    )}
                    <button
                      type="button"
                      aria-label="Edit vehicle"
                      onClick={() => handleEdit(v)}
                      className="hover:text-gray-600"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete vehicle"
                      onClick={() => handleDelete(v.id)}
                      className="hover:text-red-500"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Formik
            innerRef={formikRef}
            initialValues={{ name: "", plate: "" }}
            validationSchema={VehicleSchema}
            onSubmit={handleAddVehicle}
          >
            {({
              values,
              handleChange,
              handleBlur,
              handleSubmit: handleFormikSubmit,
            }) => (
              <form onSubmit={handleFormikSubmit} className="mt-6 space-y-5">
                <div>
                  <InputField
                    name="name"
                    label="Vehicle Name"
                    placeholder="e.g Adewale Fleet Services"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <ErrorMessage
                    name="name"
                    component="span"
                    className="text-[#db3a3a] text-sm mt-1 block"
                  />
                </div>

                <div>
                  <InputField
                    name="plate"
                    label="Plate Number"
                    placeholder="e.g BN-1234567"
                    value={values.plate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <ErrorMessage
                    name="plate"
                    component="span"
                    className="text-[#db3a3a] text-sm mt-1 block"
                  />
                </div>

                <div>
                  <label className="block text-[15px] font-medium text-[#231F20] mb-2">
                    Vehicle type
                  </label>
                  <div className="relative">
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-3.5 text-[15px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#005823]/30"
                    >
                      {VEHICLE_TYPES.map((vt) => (
                        <option key={vt.id} value={vt.id}>
                          {vt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={18}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[15px] font-medium text-[#231F20] mb-2">
                    Vehicle pictures{" "}
                    <span className="font-normal text-gray-500">
                      (min {MIN_PICTURES}, plates must be visible)
                    </span>
                  </label>

                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-10 text-center hover:bg-gray-50 transition-colors"
                  >
                    <UploadCloud size={32} className="text-[#005823]" />
                    <p className="text-[15px] text-gray-700">
                      Upload pictures{" "}
                      <span className="font-medium text-[#005823] underline">
                        Browse
                      </span>
                    </p>
                    <p className="text-[12px] text-gray-400">
                      JPEG, PNG, PDF format, Max {MAX_FILE_SIZE_MB}MB each
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept={ACCEPTED_TYPES.join(",")}
                      className="hidden"
                      onChange={(e) => handleFiles(e.target.files)}
                    />
                  </div>

                  {pictures.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {pictures.map((p) => (
                        <div
                          key={p.id}
                          className="relative flex items-center gap-2 rounded-md border border-gray-200 px-2.5 py-1.5 text-[12px] text-gray-600"
                        >
                          <span className="max-w-[120px] truncate">
                            {p.name}
                          </span>
                          <button
                            type="button"
                            aria-label="Remove picture"
                            onClick={() => handleRemovePicture(p.id)}
                            className="hover:text-red-500"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {pictureError && (
                    <p className="mt-2 text-[12px] text-red-600">
                      {pictureError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#005823] py-3.5 text-[14px] font-medium text-[#005823] hover:bg-[#00582310] transition-colors"
                >
                  <span className="text-lg leading-none">+</span>
                  {editingId ? "Update Vehicle" : "Add Vehicle"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="w-full rounded-lg border border-gray-200 py-3 text-[13px] font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    Cancel edit
                  </button>
                )}
              </form>
            )}
          </Formik>

          {listError && (
            <p className="mt-3 text-[12px] text-red-600">{listError}</p>
          )}

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || vehicles.length === 0}
              className="rounded-md bg-[#005823BF] px-6 py-3 text-[14px] font-medium text-white hover:bg-[#005823] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Saving..." : "Save & Continue"}
            </button>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-600 text-sm mt-2">{successMessage}</p>
          )}

          <div className="mt-6 flex items-start gap-2 rounded-lg border border-[#FDE68A] bg-[#FEF9E7] px-4 py-3">
            <AlertTriangle
              size={16}
              className="mt-0.5 shrink-0 text-[#D97706]"
            />
            <p className="text-[12.5px] leading-snug text-[#92400E]">
              Please ensure all details are accurate before submitting. Vehicle
              information cannot be edited after registration.
            </p>
          </div>
        </div>
      </div>
    </BusinessSetupLayout>
  );
}
