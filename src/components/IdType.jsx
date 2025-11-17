import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";


export default function IDTypeSelector({ title, desc, icon }) {
  const [selected, setSelected] = useState(false);

   const handleSelect = (id) => {
    setSelected(id);
  };

  return (
    <div
      onClick={() => setSelected(!selected)}
      className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer transition
        ${selected ? "border-[#005823BF] bg-[#F5F8F6]" : "border-gray-300 hover:border-[#005823BF]/40"}
      `}
    >
     <div className="flex items-start space-x-3">
              <div className=" bg-[#00582340] rounded-md p-2">{icon}</div>
              <div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            </div>
      <div
  className={`w-4 h-4 flex items-center justify-center rounded-full transition-colors
            ${
          selected ? "bg-[#005823BF] border-[#005823BF]" : "border-gray-300"
        }`}
      >
                      {selected && <FaCheck className="w-3 h-3  text-white" />}

      </div>
    </div>
  );
}
