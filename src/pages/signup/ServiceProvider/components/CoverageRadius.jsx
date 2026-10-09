import { useState } from "react";

export default function CoverageRadius({
  onChange,
  initialRadius = 5,
  initialAllowOutside = true,
}) {
  const [radius, setRadius] = useState(initialRadius);
  const [allowOutside] = useState(initialAllowOutside);
  const [customValue, setCustomValue] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const presetValues = [3, 5, 10, 15, 20];

  const notifyChange = (newRadius, newAllowOutside) => {
    onChange?.({ radius: newRadius, allowAnywhere: newAllowOutside });
  };

  const handlePresetClick = (value) => {
    setRadius(value);
    setIsCustom(false);
    notifyChange(value, allowOutside);
  };

  const handleCustomClick = () => {
    setIsCustom(true);
    if (customValue) setRadius(Number(customValue));
  };

  const handleCustomInputChange = (event) => {
    const value = event.target.value;
    if (value === "" || (Number(value) >= 1 && Number(value) <= 50)) {
      setCustomValue(value);
      if (value) {
        const numberValue = Number(value);
        setRadius(numberValue);
        notifyChange(numberValue, allowOutside);
      }
    }
  };

  return (
    <div className="max-w-1xl bg-white rounded-lg">
      <div className="flex gap-3 mb-6">
        {presetValues.map((value) => (
          <button
            type="button"
            key={value}
            onClick={() => handlePresetClick(value)}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              radius === value && !isCustom
                ? "bg-green-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {value}km
          </button>
        ))}

        {isCustom ? (
          <input
            type="number"
            value={customValue}
            onChange={handleCustomInputChange}
            onBlur={() => {
              if (!customValue) {
                setIsCustom(false);
                setRadius(5);
              }
            }}
            placeholder="km"
            className="w-20 px-4 py-2 rounded-full border-2 border-green-700 text-center font-medium focus:outline-none"
            autoFocus
            min="1"
            max="50"
          />
        ) : (
          <button
            type="button"
            onClick={handleCustomClick}
            className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
          >
            Custom
          </button>
        )}
      </div>
    </div>
  );
}
