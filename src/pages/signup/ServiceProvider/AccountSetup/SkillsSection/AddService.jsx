import Modal from "../../../../../components/Modal";
import InputField from "../../../../../components/InputField";
import Button from "../../../../../components/button";
import { useState, useEffect } from "react";

export default function AddService({ isOpen, onClose, onSave, editingService }) {
  const [service, setService] = useState({
    name: "",
    pricingModel: "",
    pricingModelLabel: "",
    price: "",
  });

  useEffect(() => {
if (editingService) {
      setService({
        name: editingService.name || "",
        pricingModel: editingService.pricingModel || "",
        pricingModelLabel: editingService.pricingModelLabel || "",
        price: editingService.price || "",
      });
    } else{
        setService({
        name: "",
        pricingModel: "",
        pricingModelLabel: "",
        price: "",
      });
    }
  }, [isOpen, editingService]);

  const handleChange = (field, value, label) => {
    setService((prev) => ({
      ...prev,
      [field]: value,
      ...(label ? { pricingModelLabel: label } : {}),
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Basic validation
    if (!service.name || !service.price || !service.pricingModel) {
      alert("Please fill out all fields before saving.");
      return;
    }
    if (onSave) onSave(service); 
    onClose();
    setService({
      name: "",
      pricingModel: "",
      pricingModelLabel: "",
      price: "",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <InputField
          name="name"
          label="Service Name/Type"
          placeholder="e.g. House Cleaning"
          value={service.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <InputField
          name="pricingModel"
          label="Pricing Model"
          select
          value={service.pricingModel}
          onChange={(optionOrEvent) => {
            if (optionOrEvent?.target) {
              // Standard <select>
              const value = optionOrEvent.target.value;
              const label =
                optionOrEvent.target.options[optionOrEvent.target.selectedIndex].text;
              handleChange("pricingModel", value, label);
            } else {
              // Headless UI or custom select
              handleChange("pricingModel", optionOrEvent.value, optionOrEvent.label);
            }
          }}
          options={[
            { label: "Select Model", value: "" },
            { label: "Per Project", value: "project" },
            { label: "Per Day", value: "daily" },
            { label: "Per Hour", value: "hourly" },
            { label: "Per Mile", value: "mile" },
            { label: "Per Unit", value: "unit" },
          ]}
        />

        <InputField
          name="price"
          label="Price (₦)"
          placeholder="₦20,000"
          value={service.price}
          onChange={(e) => handleChange("price", e.target.value)}
        />

       <div className="flex justify-between gap-3 mt-4">
          <Button
          variant="ghost"
          className="px-4 py-2 border border-[#005823] bg-white text-[#005823] rounded-lg"       
          onClick={onClose}      
          >
            Cancel
          </Button>

          <Button type="button"
          onClick={handleSave}
          >
            {editingService ? "Update" : "Save"}
          </Button>
        
        </div>
        </div>
    </Modal>
  );
}
