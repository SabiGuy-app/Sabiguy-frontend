import { useState, useEffect, useRef } from "react";
import { ChevronDown, MapPin, Loader } from "lucide-react";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Load the Google Maps script once globally
let scriptLoaded = false;
let scriptLoading = false;
const scriptCallbacks = [];

function loadGoogleMapsScript() {
  return new Promise((resolve, reject) => {
    // Already loaded
    if (window.google?.maps?.places) {
      resolve();
      return;
    }

    // Queue callback if script is mid-load
    if (scriptLoading) {
      scriptCallbacks.push({ resolve, reject });
      return;
    }

    scriptLoading = true;
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      scriptLoaded = true;
      scriptLoading = false;
      resolve();
      scriptCallbacks.forEach((cb) => cb.resolve());
      scriptCallbacks.length = 0;
    };

    script.onerror = () => {
      scriptLoading = false;
      const err = new Error("Failed to load Google Maps script");
      reject(err);
      scriptCallbacks.forEach((cb) => cb.reject(err));
      scriptCallbacks.length = 0;
    };

    document.head.appendChild(script);
  });
}

const LocationAutocomplete = ({
  value,
  onChange,
  onBlur,
  label,
  placeholder,
  name,
  readOnly = false,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sdkReady, setSdkReady] = useState(false);

  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceTimeoutRef = useRef(null);
  const autocompleteServiceRef = useRef(null);

  // Load Google Maps SDK on mount
  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      setError("Google Maps API key not configured.");
      return;
    }

    loadGoogleMapsScript()
      .then(() => {
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
        setSdkReady(true);
      })
      .catch(() => {
        setError("Could not load location service. Please type your address manually.");
      });
  }, []);

  // Fetch suggestions using the JS SDK (no CORS issues)
  const fetchSuggestions = (input) => {
    if (!input || input.length < 2 || !autocompleteServiceRef.current) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    autocompleteServiceRef.current.getPlacePredictions(
      {
        input,
        componentRestrictions: { country: "ng" }, // Nigeria only
        types: ["geocode", "establishment"],
      },
      (predictions, status) => {
        setLoading(false);

        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions.slice(0, 5));
          setError("");
        } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          setSuggestions([]);
        } else {
          setSuggestions([]);
        }
      }
    );
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    setIsOpen(true);

    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => fetchSuggestions(inputValue), 300);
  };

  const handleSelectSuggestion = (suggestion) => {
    onChange(suggestion.description);
    setIsOpen(false);
    setSuggestions([]);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionsRef.current && !suggestionsRef.current.contains(e.target) &&
        inputRef.current && !inputRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, []);

  return (
    <div className="relative w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          name={name}
          value={value}
          onChange={handleInputChange}
          onBlur={() => {
            onBlur?.();
            setTimeout(() => setIsOpen(false), 200);
          }}
          onFocus={() => value && suggestions.length === 0 && fetchSuggestions(value)}
          placeholder={!sdkReady && !error ? "Loading location service..." : placeholder}
          readOnly={readOnly}
          disabled={readOnly || (!sdkReady && !error)}
          className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005823] focus:border-transparent text-gray-700 transition-colors ${
            readOnly ? "bg-gray-50 cursor-not-allowed" : "bg-white"
          }`}
        />

        {loading && (
          <div className="absolute right-3 top-3 text-[#005823]">
            <Loader size={20} className="animate-spin" />
          </div>
        )}

        {!loading && !readOnly && (
          <ChevronDown size={20} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => {
            // structured_formatting gives better main/secondary text split
            const mainText = suggestion.structured_formatting?.main_text || suggestion.description;
            const secondaryText = suggestion.structured_formatting?.secondary_text || "";

            return (
              <button
                key={suggestion.place_id || index}
                type="button"
                onClick={() => handleSelectSuggestion(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-[#f0f9f4] border-b border-gray-100 last:border-b-0 transition-colors focus:outline-none focus:bg-[#f0f9f4]"
              >
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-[#005823] mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{mainText}</p>
                    {secondaryText && (
                      <p className="text-xs text-gray-500 truncate">{secondaryText}</p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Error */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {/* No results */}
      {isOpen && !loading && suggestions.length === 0 && value && sdkReady && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 p-3 text-center text-gray-500 text-sm">
          No locations found
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;
