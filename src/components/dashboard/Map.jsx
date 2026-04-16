import React, { useEffect, useRef, useState } from "react";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

let googleMapsLoaderPromise = null;

const isValidCoordinate = (coord) => {
  return (
    coord &&
    typeof coord.latitude === "number" &&
    typeof coord.longitude === "number" &&
    !Number.isNaN(coord.latitude) &&
    !Number.isNaN(coord.longitude) &&
    coord.latitude >= -90 &&
    coord.latitude <= 90 &&
    coord.longitude >= -180 &&
    coord.longitude <= 180
  );
};

const toLatLngLiteral = (coord) => ({
  lat: coord.latitude,
  lng: coord.longitude,
});

const isBikeVehicleType = (vehicleType) => {
  const normalizedType = String(vehicleType || "").toLowerCase();
  return (
    normalizedType.includes("bike") || normalizedType.includes("motorbike")
  );
};

const loadGoogleMaps = () => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only load in the browser."));
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (!GOOGLE_MAPS_API_KEY) {
    return Promise.reject(
      new Error("Missing VITE_GOOGLE_MAPS_API_KEY environment variable."),
    );
  }

  if (!googleMapsLoaderPromise) {
    googleMapsLoaderPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector(
        'script[data-google-maps="true"]',
      );

      if (existingScript) {
        existingScript.addEventListener("load", () =>
          resolve(window.google.maps),
        );
        existingScript.addEventListener("error", () =>
          reject(new Error("Google Maps failed to load.")),
        );
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=weekly`;
      script.async = true;
      script.defer = true;
      script.dataset.googleMaps = "true";
      script.onload = () => resolve(window.google.maps);
      script.onerror = () => reject(new Error("Google Maps failed to load."));
      document.head.appendChild(script);
    });
  }

  return googleMapsLoaderPromise;
};

const createPinSvg = (color, label) => {
  const safeLabel = label ?? "";
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="56" viewBox="0 0 48 56">
      <path d="M24 2C15.2 2 8 9.2 8 18c0 12 16 36 16 36s16-24 16-36C40 9.2 32.8 2 24 2z" fill="${color}" stroke="white" stroke-width="3"/>
      <circle cx="24" cy="18" r="7" fill="white"/>
      <text x="24" y="49" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="700" fill="#111827">${safeLabel}</text>
    </svg>
  `)}`;
};

const createVehicleSvg = (vehicleType, bearing = 0) => {
  const isBike = isBikeVehicleType(vehicleType);
  const accent = isBike ? "#2563eb" : "#005823";
  const body = isBike
    ? `
      <circle cx="14" cy="35" r="5" fill="none" stroke="white" stroke-width="3"/>
      <circle cx="34" cy="35" r="5" fill="none" stroke="white" stroke-width="3"/>
      <path d="M14 35l7-14h7l-4 8h8l4 6" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M20 21l4 7" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"/>
      <path d="M31 21l3 6" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"/>
    `
    : `
      <rect x="11" y="18" width="26" height="14" rx="4" fill="white" opacity="0.2"/>
      <path d="M13 27h22l-2-7c-.4-1.4-1.7-2.3-3.2-2.3h-11.6c-1.5 0-2.8.9-3.2 2.3L13 27z" fill="none" stroke="white" stroke-width="3" stroke-linejoin="round"/>
      <path d="M15 18l3-4h12l3 4" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="17" cy="32" r="3" fill="white"/>
      <circle cx="31" cy="32" r="3" fill="white"/>
      <path d="M14 23h20" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"/>
    `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56">
      <circle cx="28" cy="28" r="24" fill="${accent}" opacity="0.18"/>
      <circle cx="28" cy="28" r="18" fill="${accent}" stroke="white" stroke-width="4"/>
      <g transform="rotate(${bearing} 28 28)">
        ${body}
      </g>
    </svg>
  `)}`;
};

const createFallbackMapStyle = [
  {
    featureType: "all",
    elementType: "geometry",
    stylers: [{ color: "#f5f7f6" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#7f8a87" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#e7ece9" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#dbe6df" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#e9efe9" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#d7eef7" }],
  },
];

const animateMarker = (marker, from, to, duration = 700) => {
  if (!marker || !from || !to) return;

  const startTime = performance.now();
  const easeInOut = (t) => t * (2 - t);

  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = easeInOut(progress);
    const lat = from.lat + (to.lat - from.lat) * eased;
    const lng = from.lng + (to.lng - from.lng) * eased;

    marker.setPosition({ lat, lng });

    if (progress < 1) {
      marker.__raf = window.requestAnimationFrame(step);
    }
  };

  if (marker.__raf) {
    window.cancelAnimationFrame(marker.__raf);
  }

  marker.__raf = window.requestAnimationFrame(step);
  return marker.__raf;
};

const DeliveryMap = ({
  pickup,
  dropoff,
  riderLocation,
  vehicleType = "car",
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const pickupMarker = useRef(null);
  const dropoffMarker = useRef(null);
  const riderMarker = useRef(null);
  const routePolyline = useRef(null);
  const directionsService = useRef(null);
  const markerAnimation = useRef(null);
  const [loadState, setLoadState] = useState(
    GOOGLE_MAPS_API_KEY ? "loading" : "missing",
  );
  const [loadError, setLoadError] = useState("");

  const getCenter = () => {
    if (isValidCoordinate(riderLocation)) {
      return toLatLngLiteral(riderLocation);
    }

    if (isValidCoordinate(pickup)) {
      return toLatLngLiteral(pickup);
    }

    if (isValidCoordinate(dropoff)) {
      return toLatLngLiteral(dropoff);
    }

    return null;
  };

  const updateBounds = () => {
    if (!map.current || !window.google?.maps) return;

    const points = [];
    if (isValidCoordinate(riderLocation)) {
      points.push(toLatLngLiteral(riderLocation));
    }
    if (isValidCoordinate(pickup)) {
      points.push(toLatLngLiteral(pickup));
    }
    if (isValidCoordinate(dropoff)) {
      points.push(toLatLngLiteral(dropoff));
    }

    if (points.length >= 2) {
      const bounds = new window.google.maps.LatLngBounds();
      points.forEach((point) => bounds.extend(point));
      map.current.fitBounds(bounds, {
        top: 100,
        bottom: 100,
        left: 100,
        right: 100,
      });
      return;
    }

    if (points.length === 1) {
      map.current.setCenter(points[0]);
      map.current.setZoom(13);
    }
  };

  useEffect(() => {
    let cancelled = false;

    loadGoogleMaps()
      .then(() => {
        if (!cancelled) {
          setLoadState("ready");
          setLoadError("");
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadState("error");
          setLoadError(error.message || "Unable to load Google Maps.");
          console.error("Google Maps load error:", error);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (loadState !== "ready" || map.current || !mapContainer.current) return;

    const center = getCenter();
    if (!center) return;

    map.current = new window.google.maps.Map(mapContainer.current, {
      center,
      zoom: 13,
      styles: createFallbackMapStyle,
      disableDefaultUI: true,
      zoomControl: true,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      clickableIcons: false,
      gestureHandling: "greedy",
    });

    directionsService.current = new window.google.maps.DirectionsService();
    updateBounds();
  }, [loadState, pickup, dropoff, riderLocation]);

  useEffect(() => {
    if (!map.current || !window.google?.maps || !isValidCoordinate(pickup)) {
      return;
    }

    const position = toLatLngLiteral(pickup);

    if (pickupMarker.current) {
      pickupMarker.current.setPosition(position);
      return;
    }

    pickupMarker.current = new window.google.maps.Marker({
      position,
      map: map.current,
      title: "Pickup",
      icon: {
        url: createPinSvg("#10b981", "P"),
        scaledSize: new window.google.maps.Size(48, 56),
        anchor: new window.google.maps.Point(24, 52),
      },
    });
  }, [pickup, loadState]);

  useEffect(() => {
    if (!map.current || !window.google?.maps || !isValidCoordinate(dropoff)) {
      return;
    }

    const position = toLatLngLiteral(dropoff);

    if (dropoffMarker.current) {
      dropoffMarker.current.setPosition(position);
      return;
    }

    dropoffMarker.current = new window.google.maps.Marker({
      position,
      map: map.current,
      title: "Dropoff",
      icon: {
        url: createPinSvg("#ef4444", "D"),
        scaledSize: new window.google.maps.Size(48, 56),
        anchor: new window.google.maps.Point(24, 52),
      },
    });
  }, [dropoff, loadState]);

  useEffect(() => {
    if (
      !map.current ||
      !window.google?.maps ||
      !isValidCoordinate(riderLocation)
    ) {
      return;
    }

    const position = toLatLngLiteral(riderLocation);
    const bearing = riderLocation.bearing ?? 0;
    const iconUrl = createVehicleSvg(vehicleType, bearing);

    if (riderMarker.current) {
      const currentPosition = riderMarker.current.getPosition()?.toJSON?.();
      if (markerAnimation.current) {
        window.cancelAnimationFrame(markerAnimation.current);
      }

      if (currentPosition) {
        markerAnimation.current = animateMarker(
          riderMarker.current,
          currentPosition,
          position,
          700,
        );
      } else {
        riderMarker.current.setPosition(position);
      }

      riderMarker.current.setIcon({
        url: iconUrl,
        scaledSize: new window.google.maps.Size(56, 56),
        anchor: new window.google.maps.Point(28, 28),
      });
      return;
    }

    riderMarker.current = new window.google.maps.Marker({
      position,
      map: map.current,
      title: isBikeVehicleType(vehicleType) ? "Bike courier" : "Vehicle",
      icon: {
        url: iconUrl,
        scaledSize: new window.google.maps.Size(56, 56),
        anchor: new window.google.maps.Point(28, 28),
      },
    });
  }, [riderLocation, loadState, vehicleType]);

  useEffect(() => {
    if (
      !map.current ||
      !window.google?.maps ||
      !directionsService.current ||
      !isValidCoordinate(pickup) ||
      !isValidCoordinate(dropoff)
    ) {
      return;
    }

      directionsService.current.route(
      {
        origin: toLatLngLiteral(pickup),
        destination: toLatLngLiteral(dropoff),
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status !== "OK" || !result) {
          console.warn("Google Directions request failed:", status);
          return;
        }

        const routePath = result.routes?.[0]?.overview_path;
        if (!routePath?.length) return;

        if (routePolyline.current) {
          routePolyline.current.setMap(null);
        }

        routePolyline.current = new window.google.maps.Polyline({
          path: routePath,
          strokeColor: "#005823",
          strokeOpacity: 0.8,
          strokeWeight: 5,
          map: map.current,
        });
      },
    );
  }, [pickup, dropoff, loadState]);

  useEffect(() => {
    if (!map.current) return;
    updateBounds();
  }, [pickup, dropoff, riderLocation, loadState]);

  useEffect(() => {
    return () => {
      if (markerAnimation.current) {
        window.cancelAnimationFrame(markerAnimation.current);
      }

      if (pickupMarker.current) {
        pickupMarker.current.setMap(null);
      }

      if (dropoffMarker.current) {
        dropoffMarker.current.setMap(null);
      }

      if (riderMarker.current) {
        riderMarker.current.setMap(null);
      }

      if (routePolyline.current) {
        routePolyline.current.setMap(null);
      }
    };
  }, []);

  if (loadState === "missing") {
    return (
      <div className="w-full h-full rounded-lg overflow-hidden shadow-lg bg-white flex items-center justify-center p-6 text-center border border-dashed border-gray-200">
        <div>
          <p className="font-semibold text-gray-900 mb-2">Google Maps key missing</p>
          <p className="text-sm text-gray-500 max-w-xs">
            Add <code>VITE_GOOGLE_MAPS_API_KEY</code> to your environment to load the live delivery map.
          </p>
        </div>
      </div>
    );
  }

  if (loadState === "error") {
    return (
      <div className="w-full h-full rounded-lg overflow-hidden shadow-lg bg-white flex items-center justify-center p-6 text-center border border-dashed border-gray-200">
        <div>
          <p className="font-semibold text-gray-900 mb-2">Map unavailable</p>
          <p className="text-sm text-gray-500 max-w-xs">
            {loadError || "Google Maps could not be loaded right now."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      className="w-full h-full rounded-lg overflow-hidden shadow-lg bg-[#f5f7f6]"
    />
  );
};

export default DeliveryMap;
