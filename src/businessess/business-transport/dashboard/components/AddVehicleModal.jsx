import { useEffect, useRef, useState } from "react";
import { ArrowLeft, UploadCloud, TriangleAlert, X } from "lucide-react";

const VEHICLE_TYPES = [
  { value: "car_2000_below", label: "Car driver (2000 below)" },
  { value: "car_above_2000", label: "Car driver (Above 2000)" },
  { value: "motorcycle", label: "Motorcycle" },
];

const MAX_FILE_SIZE_MB = 5;
const MIN_PICTURES = 2;

export default function AddVehicleModal({ open, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [vehicleType, setVehicleType] = useState(VEHICLE_TYPES[0].value);
  const [pictures, setPictures] = useState([]);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setName("");
      setPlateNumber("");
      setVehicleType(VEHICLE_TYPES[0].value);
      setPictures([]);
      setError("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  function addFiles(fileList) {
    const incoming = Array.from(fileList);
    const accepted = [];
    for (const file of incoming) {
      const isValidType = [
        "image/jpeg",
        "image/png",
        "application/pdf",
      ].includes(file.type);
      const isValidSize = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;
      if (isValidType && isValidSize) accepted.push(file);
    }
    if (accepted.length < incoming.length) {
      setError(
        `Some files were skipped. Use JPEG, PNG or PDF under ${MAX_FILE_SIZE_MB}MB.`,
      );
    } else {
      setError("");
    }
    setPictures((prev) => [...prev, ...accepted]);
  }

  function removePicture(index) {
    setPictures((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit() {
    if (!name.trim()) return setError("Enter a vehicle name.");
    if (!plateNumber.trim()) return setError("Enter a plate number.");
    if (pictures.length < MIN_PICTURES)
      return setError(`Upload at least ${MIN_PICTURES} vehicle pictures.`);

    setError("");
    onSubmit?.({
      name: name.trim(),
      plateNumber: plateNumber.trim(),
      vehicleType,
      pictures,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-h-[90vh] w-full max-w-[45%] overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="relative mb-1 flex items-center justify-center">
          <button
            type="button"
            onClick={onClose}
            className="absolute left-0 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h2 className="text-[16px] font-semibold text-gray-900">
            Add your Vehicle
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-0 text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <p className="mb-6 text-center text-sm text-gray-500">
          Enter your vehicle details carefully. Once submitted, these details
          cannot be edited.
        </p>

        <div className="space-y-4">
          <Field label="Vehicle Name">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g Adewale Fleet Services"
              className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#005823] focus:outline-none focus:ring-1 focus:ring-[#005823]"
            />
          </Field>

          <Field label="Plate Number">
            <input
              type="text"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
              placeholder="e.g BN-1234567"
              className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#005823] focus:outline-none focus:ring-1 focus:ring-[#005823]"
            />
          </Field>

          <Field label="Vehicle type">
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-[#005823] focus:outline-none focus:ring-1 focus:ring-[#005823]"
            >
              {VEHICLE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label={`Vehicle pictures (min ${MIN_PICTURES}, plates must be visible)`}
          >
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                addFiles(e.dataTransfer.files);
              }}
              className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors ${
                isDragging
                  ? "border-[#005823] bg-green-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <UploadCloud className="mb-2 h-7 w-7 text-[#005823]" />
              <p className="text-sm text-gray-600">
                Upload pictures{" "}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="font-medium text-[#005823] hover:underline"
                >
                  Browse
                </button>
              </p>
              <p className="mt-1 text-xs text-gray-400">
                JPEG, PNG, PDF format, Max {MAX_FILE_SIZE_MB}MB each
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,application/pdf"
                className="hidden"
                onChange={(e) => addFiles(e.target.files)}
              />
            </div>

            {pictures.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {pictures.map((file, i) => (
                  <li
                    key={`${file.name}-${i}`}
                    className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-1.5 text-xs text-gray-600"
                  >
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removePicture(i)}
                      className="ml-2 shrink-0 text-gray-400 hover:text-red-500"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Field>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full rounded-md border border-dashed border-gray-300 py-2.5 text-sm font-medium text-[#005823] transition-colors hover:bg-green-50"
          >
            + Add Vehicle
          </button>

          {error && <p className="text-center text-xs text-red-500">{error}</p>}

          <div className="flex gap-2 rounded-md bg-yellow-50 px-3 py-2.5">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
            <p className="text-xs text-yellow-700">
              Please ensure all details are accurate before submitting. Vehicle
              information cannot be edited after registration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-gray-700">{label}</label>
      {children}
    </div>
  );
}
