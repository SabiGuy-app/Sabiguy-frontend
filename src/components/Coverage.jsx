import React, { useState } from 'react';

export default function CoverageRadius({onChange, initialRadius = 5, initialAllowOutside = true }) {
  const [radius, setRadius] = useState(initialRadius);
  const [allowOutside, setAllowOutside] = useState(initialAllowOutside);
  const [customValue, setCustomValue] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const presetValues = [3, 5, 10, 15, 20];

  const notifyChange = (newRadius, newAllowOutside) => {
    if (onChange) {
      onChange({
        radius: newRadius,
        allowAnywhere: newAllowOutside
      });
    }
  };

  const handlePresetClick = (value) => {
    setRadius(value);
    setIsCustom(false);
    notifyChange(value, allowOutside);

  };

  const handleCustomClick = () => {
    setIsCustom(true);
    if (customValue) {
      setRadius(Number(customValue));
    }
  };

  const handleSliderChange = (e) => {
    const value = Number(e.target.value);
    setRadius(value);
    if (isCustom) {
      setCustomValue(value.toString());
    }
     notifyChange(value, allowOutside);

  };

  const handleCustomInputChange = (e) => {
    const value = e.target.value;
    if (value === '' || (Number(value) >= 1 && Number(value) <= 50)) {
      setCustomValue(value);
     if (value) {
        const numValue = Number(value);
        setRadius(numValue);
        notifyChange(numValue, allowOutside);
      }
    }
  };

  return (
    <div className="max-w-1xl bg-white rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Work coverage radius
      </h2>

      {/* Preset buttons */}
      <div className="flex gap-3 mb-6">
        {presetValues.map((value) => (
          <button
          type='button'
            key={value}
            onClick={() => handlePresetClick(value)}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              radius === value && !isCustom
                ? 'bg-green-700 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {value}km
          </button>
        ))}
        
        {/* Custom button */}
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
                    type='button'

            onClick={handleCustomClick}
            className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
          >
            Custom
          </button>
        )}
      </div>

      {/* Slider */}
      <div className="mb-2">
        <input
          type="range"
          min="1"
          max="50"
          value={radius}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #15803d 0%, #15803d ${((radius - 1) / 49) * 100}%, #e5e7eb ${((radius - 1) / 49) * 100}%, #e5e7eb 100%)`
          }}
        />
      </div>

      {/* Slider labels */}
      <div className="flex justify-between text-sm text-gray-500 mb-8">
        <span>1km</span>
        <span>{radius}km</span>
        <span>50km</span>
      </div>

      {/* Checkbox */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            type="checkbox"
            checked={allowOutside}
            onChange={(e) => setAllowOutside(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-green-700 peer-checked:border-green-700 transition-colors flex items-center justify-center">
            {allowOutside && (
              <svg
                className="w-3.5 h-3.5 text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
            )}
          </div>
        </div>
        <div>
          <div className="font-medium text-gray-800">
            Allow bookings outside my coverage area
          </div>
          <div className="text-sm text-gray-500 mt-1">
            You'll receive requests from clients beyond your preferred radius
          </div>
        </div>
      </label>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #15803d;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #15803d;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}