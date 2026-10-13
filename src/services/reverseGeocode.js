const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
let googleMapsLoadPromise;

const stripPlusCode = (address) =>
  address
    .replace(/^[A-Z0-9]{4,8}\+[A-Z0-9]{2,3}[\s,]*/i, "")
    .replace(/\s+,/g, ",")
    .trim();

const formatFriendlyAddress = (results) => {
  const streetResult = results.find(
    (result) =>
      result.address_components?.some((component) =>
        component.types.includes("route"),
      ) && result.formatted_address,
  );
  if (streetResult) return stripPlusCode(streetResult.formatted_address);

  const result = results[0];
  const formattedAddress = result.formatted_address || "";
  if (!/^[A-Z0-9]{4,8}\+[A-Z0-9]{2,3}\b/i.test(formattedAddress)) {
    return formattedAddress;
  }

  const components = result.address_components || [];
  const getComponent = (...types) =>
    components.find((component) =>
      types.some((type) => component.types.includes(type)),
    )?.long_name;
  const street = [getComponent("street_number"), getComponent("route")]
    .filter(Boolean)
    .join(" ");
  const readableParts = [
    street,
    getComponent("neighborhood", "sublocality_level_1", "sublocality"),
    getComponent("locality", "postal_town", "administrative_area_level_2"),
    getComponent("administrative_area_level_1"),
    getComponent("country"),
  ].filter(Boolean);
  const uniqueParts = readableParts.filter(
    (part, index) =>
      readableParts.findIndex(
        (candidate) => candidate.toLowerCase() === part.toLowerCase(),
      ) === index,
  );

  if (uniqueParts.length) return uniqueParts.join(", ");
  return stripPlusCode(formattedAddress);
};

const loadGoogleMaps = () => {
  if (window.google?.maps?.Geocoder) return Promise.resolve();
  if (googleMapsLoadPromise) return googleMapsLoadPromise;
  if (!GOOGLE_MAPS_API_KEY) {
    return Promise.reject(new Error("Google Maps API key is not configured."));
  }

  googleMapsLoadPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com/maps/api/js"]',
    );

    if (existingScript) {
      existingScript.addEventListener(
        "load",
        () =>
          window.google?.maps?.Geocoder
            ? resolve()
            : reject(new Error("Google Maps geocoder is unavailable.")),
        { once: true },
      );
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Google Maps could not be loaded.")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () =>
      window.google?.maps?.Geocoder
        ? resolve()
        : reject(new Error("Google Maps geocoder is unavailable."));
    script.onerror = () =>
      reject(new Error("Google Maps could not be loaded."));
    document.head.appendChild(script);
  }).catch((error) => {
    googleMapsLoadPromise = null;
    throw error;
  });

  return googleMapsLoadPromise;
};

export const reverseGeocodeCoordinates = async ({ latitude, longitude }) => {
  await loadGoogleMaps();

  const geocoder = new window.google.maps.Geocoder();
  return new Promise((resolve, reject) => {
    geocoder.geocode(
      { location: { lat: Number(latitude), lng: Number(longitude) } },
      (results, status) => {
        if (status === "OK" && results?.[0]?.formatted_address) {
          resolve(formatFriendlyAddress(results));
          return;
        }
        reject(
          new Error(`Could not resolve coordinates to an address (${status}).`),
        );
      },
    );
  });
};
