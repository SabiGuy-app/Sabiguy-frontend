import React, { useState } from "react";
import { ChevronDown, User, Car, X } from "lucide-react";

export const policyOptions = ["Standard fleet policy", "Night shift policy"];

const NewGroupModal = ({ onClose }) => {
  const [contains, setContains] = useState("Drivers");
  const [policy, setPolicy] = useState("Standard fleet policy");
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-[16px]">
      <div className="bg-white rounded-[12px] w-[440px] max-w-full p-[28px] relative">
        <button
          onClick={onClose}
          className="absolute top-[20px] right-[20px] w-[28px] h-[28px] flex items-center justify-center rounded-[6px] hover:bg-[#f3f4f6]"
        >
          <X size={16} color="#6b7280" />
        </button>

        <h2 className="text-[19px] font-bold text-[#111827] mb-[6px]">
          New group
        </h2>
        <p className="text-[13px] text-[#6b7280] mb-[24px]">
          A group organises drivers or vehicles that share the same policy.
        </p>

        <div className="mb-[20px]">
          <label className="block text-[13px] font-semibold text-[#374151] mb-[8px]">
            Name
          </label>
          <input
            type="text"
            placeholder="Motorbike fleet"
            className="w-full h-[44px] px-[14px] text-[14px] rounded-[8px] border border-[#d1d5db] outline-none placeholder:text-[#9ca3af]"
          />
        </div>

        <div className="mb-[20px]">
          <label className="block text-[13px] font-semibold text-[#374151] mb-[8px]">
            Description
          </label>
          <input
            type="text"
            placeholder="Optional"
            className="w-full h-[44px] px-[14px] text-[14px] rounded-[8px] border border-[#d1d5db] outline-none placeholder:text-[#9ca3af]"
          />
        </div>

        <div className="mb-[20px]">
          <label className="block text-[13px] font-semibold text-[#374151] mb-[10px]">
            This group contains
          </label>
          <div className="flex gap-[10px]">
            <button
              onClick={() => setContains("Drivers")}
              className={
                "flex-1 flex items-center justify-center gap-[8px] h-[42px] rounded-[8px] text-[14px] font-semibold " +
                (contains === "Drivers"
                  ? "bg-[#1f7a4a] text-white"
                  : "border border-[#d1d5db] text-[#374151] bg-white")
              }
            >
              <User size={16} />
              Drivers
            </button>
            <button
              onClick={() => setContains("Vehicles")}
              className={
                "flex-1 flex items-center justify-center gap-[8px] h-[42px] rounded-[8px] text-[14px] font-semibold " +
                (contains === "Vehicles"
                  ? "bg-[#1f7a4a] text-white"
                  : "border border-[#d1d5db] text-[#374151] bg-white")
              }
            >
              <Car size={16} />
              Vehicles
            </button>
          </div>
        </div>

        <div className="mb-[26px]">
          <label className="block text-[13px] font-semibold text-[#374151] mb-[8px]">
            Linked policy
          </label>
          <div className="relative">
            <select
              value={policy}
              onChange={(e) => setPolicy(e.target.value)}
              className="appearance-none w-full h-[44px] pl-[14px] pr-[36px] text-[14px] rounded-[8px] border border-[#d1d5db] outline-none bg-white text-[#111827]"
            >
              {policyOptions.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2"
              color="#6b7280"
            />
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full h-[48px] rounded-[8px] bg-[#1f7a4a] text-white text-[14px] font-bold"
        >
          Add Group
        </button>
      </div>
    </div>
  );
};

export default NewGroupModal;
