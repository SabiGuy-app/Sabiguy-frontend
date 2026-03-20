import { Fragment, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";

export default function InputField({
  label,
  select = false,
  options = [],
  value,
  onChange,
  isSelected = false,
  asRadio = false,
  onClick,
  type = "text",
  placeholder,
  italicPlaceholder = false,
  onBlur,
  name,
  size = "full",
  ...props
}) {
  const getSelected = () => {
    if (!value) return options[0];
    return options.find((opt) => opt.value === value) || options[0];
  };
  const [selected, setSelected] = useState(getSelected);

  useEffect(() => {
    if (value !== undefined) {
      const match = options.find((opt) => opt.value === value);
      if (match) setSelected(match);
    }
  }, [value]);

  const widthClasses = {
    full: "w-full",
    large: "w-full sm:w-96 md:w-[500px] max-w-full",
    medium: "w-full sm:w-80 md:w-96 max-w-full",
    small: "w-full sm:w-64 md:w-80 max-w-full",
    xs: "w-full sm:w-48 md:w-64 max-w-full",
  };

  const widthClass = widthClasses[size] || widthClasses.full;

  if (asRadio) {
    return (
      <div
        onClick={onClick}
        className={`flex items-center gap-4 ${widthClass} px-5 py-4 border rounded-md cursor-pointer transition-colors
          ${isSelected ? "bg-[#005823BF] border-[#005823] text-white" : "bg-gray-50 border-gray-400 text-black"}
        `}
      >
        <div
          className={`w-4 h-4 flex items-center justify-center border-2 rounded-full transition-colors
            ${isSelected ? "border-[#8BC53FBF] bg-white" : "border-gray-400"}
          `}
        >
          {isSelected && <FaCheck className="w-3 h-3 text-[#005823BF]" />}
        </div>

        <span className="text-sm font-medium">{placeholder}</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1 ${widthClass}`}>
      {label && <label className="text-sm font-medium">{label}</label>}

      {select ? (
        <Listbox
          value={selected}
          onChange={(val) => {
            setSelected(val);
            if (onChange) onChange(val);
          }}
        >
          <div className="relative">
            <Listbox.Button className="w-full px-5 py-4 bg-gray-50 border border-gray-400 rounded-md text-left focus:outline-none focus:ring-1 focus:ring-[#8BC53FBF] focus:border-[#8BC53FBF]">
              <span>{selected.label}</span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronUpDownIcon className="w-5 h-5 text-gray-400" />
              </span>
            </Listbox.Button>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-auto focus:outline-none text-base">
                {options.map((option, idx) => (
                  <Listbox.Option
                    key={idx}
                    value={option}
                    className={({ active }) =>
                      `cursor-pointer select-none px-4 py-2 ${
                        active ? "bg-[#005823BF] text-white" : "text-gray-900"
                      }`
                    }
                  >
                    {({ selected }) => (
                      <div className="flex justify-between items-center">
                        <span className={selected ? "font-semibold" : ""}>
                          {option.label}
                        </span>
                        {selected && (
                          <CheckIcon className="w-5 h-5 text-white" />
                        )}
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full px-5 py-4 bg-gray-50 border border-gray-400 rounded-md focus:border-[#8BC53FBF] focus:ring-1 focus:ring-[#8BC53FBF] focus:outline-none ${
            italicPlaceholder ? "placeholder:italic" : ""
          }`}
          placeholder={placeholder}
          {...props}
        />
      )}
    </div>
  );
}
