import { useRef, useState } from "react";
import { Car, Bike, Plus, Pencil, Trash2 } from "lucide-react";
import InputField from "../../../../components/InputField";
import BusinessSetupLayout from "../BusinessSetupLayout";
import { IoIosArrowBack } from "react-icons/io";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";

const VEHICLE_TYPES = [
  { id: "car", label: "Car", icon: Car },
  { id: "motorbike", label: "Motorbike", icon: Bike },
  { id: "keke", label: "Keke (Tricycle)", icon: null },
];

const VehicleSchema = Yup.object().shape({
  name: Yup.string().trim().required("Vehicle name is required"),
  plate: Yup.string().trim().required("Plate number is required"),
});

function KekeIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M6 18h6l3-9h3" />
      <path d="M9 9h5" />
    </svg>
  );
}

export default function AddVehicleForm({ onBack, onNext }) {
  const [vehicles, setVehicles] = useState([]);
  const [type, setType] = useState("car");
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [listError, setListError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const formikRef = useRef(null);

  const handleAddVehicle = (values, { resetForm }) => {
    if (editingId) {
      setVehicles((vs) =>
        vs.map((v) =>
          v.id === editingId
            ? { ...v, name: values.name, plate: values.plate, type }
            : v,
        ),
      );
    } else {
      setVehicles((vs) => [
        ...vs,
        { id: Date.now(), name: values.name, plate: values.plate, type },
      ]);
    }
    setEditingId(null);
    setType("car");
    setListError("");
    resetForm();
  };

  const handleEdit = (vehicle) => {
    setType(vehicle.type);
    setEditingId(vehicle.id);
    formikRef.current?.setValues({ name: vehicle.name, plate: vehicle.plate });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setType("car");
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
            Add your first Vehicle
          </h1>
          <p className="mt-1.5 text-[16px] leading-snug text-[#231F20BF]">
            Add a few now to get going, you can manage the full fleet from your
            dashboard.
          </p>

          <div className="mt-6 space-y-3">
            {vehicles.map((v) => {
              const meta = VEHICLE_TYPES.find((t) => t.id === v.type);
              const Icon = meta?.icon;
              return (
                <div
                  key={v.id}
                  className="flex justify-between rounded-lg border border-gray-200 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-100 text-gray-700">
                      {Icon ? <Icon size={20} /> : <KekeIcon />}
                    </div>
                    <div>
                      <p className="text-[20px] font-medium text-gray-900">
                        {v.name}
                      </p>
                      <p className="text-[16px] font-medium text-[#005823]">
                        {v.plate}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
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
              );
            })}
          </div>

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
              isValid,
              dirty,
            }) => (
              <form onSubmit={handleFormikSubmit} className="mt-5 space-y-5">
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

                <div className="flex flex-wrap gap-2">
                  {VEHICLE_TYPES.map((vt) => {
                    const Icon = vt.icon;
                    const active = type === vt.id;
                    return (
                      <button
                        key={vt.id}
                        type="button"
                        onClick={() => setType(vt.id)}
                        className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12.5px] font-medium transition-colors ${
                          active
                            ? "bg-[#005823CC] text-white"
                            : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {Icon ? <Icon size={14} /> : <KekeIcon />}
                        {vt.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-3 text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={15} />
                    {editingId ? "Update Vehicle" : "Add Vehicle"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="rounded-lg border border-gray-200 px-4 py-3 text-[13px] font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}
          </Formik>

          {listError && (
            <p className="mt-3 text-[12px] text-red-600">{listError}</p>
          )}

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || vehicles.length === 0}
              className="p-3 rounded-md text-white bg-[#005823BF] hover:bg-[#005823] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
        </div>
      </div>
    </BusinessSetupLayout>
  );
}
