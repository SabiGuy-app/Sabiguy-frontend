import React from "react";
import ImageUpload from "./ImageUpload";
import {
  AddIcon,
  TriangleAlertIcon,
  ArrowLeftIcon,
} from "../dashboard/layout/icons";

const Vehicle = () => {
  return (
    <div>
      <AddVehicle />
    </div>
  );
};

const AddVehicle = ({ title = "Vehicle" }) => {
  return (
    <div className="w-full h-full max-h-screen justify-center flex mt-20 gap-5 px-5 ">
      <button className="flex justify-center mt-2">
        <ArrowLeftIcon /> Back
      </button>

      <div className="w-full max-w-[477px] flex flex-col gap-8 justify-center items-center h-full">
        <div className="flex flex-col gap-3 justify-center items-center">
          <h3 className="font-semibold text-[#231F20] text-2xl">
            Add your {title}
          </h3>
          <p className="font-normal text-[#231F20BF] text-center">
            Enter your vehicle details carefully. Once submitted, these details
            cannot be edited.
          </p>
        </div>
        <div className="w-full h-full flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="vehicle-name">Vehicle Name</label>
            <input
              className="border-[#231F2040] outline-0 border placeholder:text-[#231F2040] bg-[#231F2040]/5 py-2.5 px-4 rounded-lg"
              type="text"
              placeholder="e.g Adewale Fleet Services"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="plate-number">Plate Number</label>
            <input
              className="border-[#231F2040] outline-0 border placeholder:text-[#231F2040] bg-[#231F2040]/5 py-2.5 px-4 rounded-lg"
              type="vehicle-type"
              placeholder="e.g BN-1234567"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="text">Vehicle type</label>
            <input
              className="border-[#231F2040] outline-0 border placeholder:text-[#231F2040] bg-[#231F2040]/5 py-2.5 px-4 rounded-lg"
              type="text"
              placeholder="Car driver (2000 below)"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <label htmlFor="text">Vehicle pictures </label>
              <span className="text-[#231F20]/50">
                (min 2, plates must be visible)
              </span>
            </div>
            <ImageUpload />

            <div className="mt-4 border border-[#00582340] py-1.5 rounded-lg cursor-pointer">
              <p className="flex justify-center items-center gap-2 text-[#00582380]">
                <AddIcon strokeWidth={1} />
                Add Vehicle
              </p>
            </div>
          </div>
        </div>

        <div className="flex max-md:flex-col justify-center items-center bg-[#FFFBEB] border border-[#FDE68A] rounded-lg text-[#991B1BB2] text-sm gap-2 py-3 px-6">
          <TriangleAlertIcon />
          <span className="leading-relaxed">
            Please ensure all details are accurate before submitting. Vehicle
            information cannot be edited after registration.
          </span>
        </div>
      </div>
    </div>
  );
};

export default AddVehicle;
