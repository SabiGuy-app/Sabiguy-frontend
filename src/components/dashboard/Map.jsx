// import React, { useState, useEffect, useRef } from "react";
// import Map, { Marker, Source, Layer } from "react-map-gl";
// import "mapbox-gl/dist/mapbox-gl.css";
// import { Navigation } from "lucide-react";

// const DeliveryMap = ({ pickup, dropoff, riderLocation }) => {
//   const mapRef = useRef(null);
//   const [routeCoordinates, setRouteCoordinates] = useState([]);
//   const [viewport, setViewport] = useState({
//     longitude: pickup?.longitude || 3.3792,
//     latitude: pickup?.latitude || 6.5244,
//     zoom: 13,
//   });

//   // Fetch route from Mapbox Directions API
//   useEffect(() => {
//     if (!pickup?.longitude || !dropoff?.longitude) return;

//     const fetchRoute = async () => {
//       try {
//         const response = await fetch(
//           `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup.longitude},${pickup.latitude};${dropoff.longitude},${dropoff.latitude}?geometries=geojson&overview=full&access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}`
//         );

//         const data = await response.json();
//         if (data.routes && data.routes[0]) {
//           const coordinates = data.routes[0].geometry.coordinates;
//           setRouteCoordinates(coordinates);
//         }
//       } catch (error) {
//         console.error("Error fetching route:", error);
//       }
//     };

//     fetchRoute();
//   }, [pickup, dropoff]);

//   // Auto-fit bounds when markers change
//   useEffect(() => {
//     if (!mapRef.current || !pickup || !dropoff) return;

//     const bounds = [
//       [
//         Math.min(pickup.longitude, dropoff.longitude),
//         Math.min(pickup.latitude, dropoff.latitude),
//       ],
//       [
//         Math.max(pickup.longitude, dropoff.longitude),
//         Math.max(pickup.latitude, dropoff.latitude),
//       ],
//     ];

//     // Include rider location in bounds if available
//     if (riderLocation?.longitude && riderLocation?.latitude) {
//       bounds[0][0] = Math.min(bounds[0][0], riderLocation.longitude);
//       bounds[0][1] = Math.min(bounds[0][1], riderLocation.latitude);
//       bounds[1][0] = Math.max(bounds[1][0], riderLocation.longitude);
//       bounds[1][1] = Math.max(bounds[1][1], riderLocation.latitude);
//     }

//     mapRef.current?.fitBounds(bounds, {
//       padding: { top: 100, bottom: 100, left: 100, right: 100 },
//       duration: 1000,
//     });
//   }, [pickup, dropoff, riderLocation]);

//   // Route GeoJSON
//   const routeGeoJSON = {
//     type: "Feature",
//     geometry: {
//       type: "LineString",
//       coordinates: routeCoordinates,
//     },
//   };

//   return (
//     <div className="w-full h-full rounded-lg overflow-hidden shadow-lg">
//       <Map
//         ref={mapRef}
//         {...viewport}
//         onMove={(evt) => setViewport(evt.viewState)}
//         style={{ width: "100%", height: "100%" }}
//         mapStyle="mapbox://styles/mapbox/streets-v12"
//         mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
//       >
//         {/* Pickup Marker */}
//         {pickup?.longitude && pickup?.latitude && (
//           <Marker
//             longitude={pickup.longitude}
//             latitude={pickup.latitude}
//             anchor="bottom"
//           >
//             <div className="relative">
//               <div className="w-10 h-10 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
//                 <div className="w-4 h-4 bg-white rounded-full"></div>
//               </div>
//               <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-white px-2 py-1 rounded shadow-md text-xs font-medium">
//                 Pickup
//               </div>
//             </div>
//           </Marker>
//         )}

//         {/* Dropoff Marker */}
//         {dropoff?.longitude && dropoff?.latitude && (
//           <Marker
//             longitude={dropoff.longitude}
//             latitude={dropoff.latitude}
//             anchor="bottom"
//           >
//             <div className="relative">
//               <div className="w-10 h-10 bg-red-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
//                 <div className="w-4 h-4 bg-white rounded-full"></div>
//               </div>
//               <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-white px-2 py-1 rounded shadow-md text-xs font-medium">
//                 Dropoff
//               </div>
//             </div>
//           </Marker>
//         )}

//         {/* Rider Location Marker (Real-time from WebSocket) */}
//         {riderLocation?.longitude && riderLocation?.latitude && (
//           <Marker
//             longitude={riderLocation.longitude}
//             latitude={riderLocation.latitude}
//             anchor="center"
//           >
//             <div className="relative animate-pulse">
//               {/* Pulsing circle background */}
//               <div className="absolute inset-0 bg-blue-400 rounded-full opacity-40 animate-ping"></div>
              
//               {/* Rider icon/avatar */}
//               <div className="relative w-12 h-12 bg-blue-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
//                 <Navigation 
//                   className="w-6 h-6 text-white" 
//                   style={{ 
//                     transform: `rotate(${riderLocation.bearing || 0}deg)` 
//                   }}
//                 />
//               </div>
//             </div>
//           </Marker>
//         )}

//         {/* Route Line */}
//         {routeCoordinates.length > 0 && (
//           <Source id="route" type="geojson" data={routeGeoJSON}>
//             <Layer
//               id="route-layer"
//               type="line"
//               paint={{
//                 "line-color": "#3B82F6",
//                 "line-width": 5,
//                 "line-opacity": 0.75,
//               }}
//             />
//           </Source>
//         )}
//       </Map>
//     </div>
//   );
// };

// export default DeliveryMap;

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const DeliveryMap = ({ pickup, dropoff, riderLocation }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const pickupMarker = useRef(null);
  const dropoffMarker = useRef(null);
  const riderMarker = useRef(null);

  // Validate coordinates helper
  const isValidCoordinate = (coord) => {
    return (
      coord &&
      typeof coord.latitude === "number" &&
      typeof coord.longitude === "number" &&
      !isNaN(coord.latitude) &&
      !isNaN(coord.longitude) &&
      coord.latitude >= -90 &&
      coord.latitude <= 90 &&
      coord.longitude >= -180 &&
      coord.longitude <= 180
    );
  };

  // Initialize map
  useEffect(() => {
    if (map.current) return;

    const center = isValidCoordinate(riderLocation)
      ? [riderLocation.longitude, riderLocation.latitude]
      : isValidCoordinate(pickup)
        ? [pickup.longitude, pickup.latitude]
        : isValidCoordinate(dropoff)
          ? [dropoff.longitude, dropoff.latitude]
          : null;

    if (!center) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: center,
      zoom: 13,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
  }, [pickup, dropoff, riderLocation]);

  // Add/Update Pickup Marker
  useEffect(() => {
    if (!map.current || !isValidCoordinate(pickup)) return;

    if (pickupMarker.current) {
      pickupMarker.current.setLngLat([pickup.longitude, pickup.latitude]);
    } else {
      const el = document.createElement("div");
      el.innerHTML = `
        <div style="position: relative;">
          <div style="width: 40px; height: 40px; background-color: #10b981; border-radius: 50%; border: 4px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
            <div style="width: 16px; height: 16px; background-color: white; border-radius: 50%;"></div>
          </div>
          <div style="position: absolute; top: 45px; left: 50%; transform: translateX(-50%); background: white; padding: 4px 8px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); white-space: nowrap; font-size: 12px; font-weight: 500;">
            Pickup
          </div>
        </div>
      `;

      pickupMarker.current = new mapboxgl.Marker({ element: el })
        .setLngLat([pickup.longitude, pickup.latitude])
        .addTo(map.current);
    }
  }, [pickup]);

  // Add/Update Dropoff Marker
  useEffect(() => {
    if (!map.current || !isValidCoordinate(dropoff)) return;

    if (dropoffMarker.current) {
      dropoffMarker.current.setLngLat([dropoff.longitude, dropoff.latitude]);
    } else {
      const el = document.createElement("div");
      el.innerHTML = `
        <div style="position: relative;">
          <div style="width: 40px; height: 40px; background-color: #ef4444; border-radius: 50%; border: 4px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-center: center;">
            <div style="width: 16px; height: 16px; background-color: white; border-radius: 50%;"></div>
          </div>
          <div style="position: absolute; top: 45px; left: 50%; transform: translateX(-50%); background: white; padding: 4px 8px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); white-space: nowrap; font-size: 12px; font-weight: 500;">
            Dropoff
          </div>
        </div>
      `;

      dropoffMarker.current = new mapboxgl.Marker({ element: el })
        .setLngLat([dropoff.longitude, dropoff.latitude])
        .addTo(map.current);
    }
  }, [dropoff]);

  // Add/Update Rider Marker
  useEffect(() => {
    if (!map.current || !isValidCoordinate(riderLocation)) return;

    if (riderMarker.current) {
      riderMarker.current.setLngLat([
        riderLocation.longitude,
        riderLocation.latitude,
      ]);

      const el = riderMarker.current.getElement();
      const icon = el.querySelector(".rider-icon");
      if (icon && riderLocation.bearing !== undefined) {
        icon.style.transform = `rotate(${riderLocation.bearing}deg)`;
      }
    } else {
      const el = document.createElement("div");
      el.innerHTML = `
        <div style="position: relative;">
          <div style="position: absolute; width: 60px; height: 60px; background-color: rgba(59, 130, 246, 0.3); border-radius: 50%; animation: pulse 2s infinite;"></div>
          <div style="position: relative; width: 48px; height: 48px; background-color: #3b82f6; border-radius: 50%; border: 4px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
            <svg class="rider-icon" style="width: 24px; height: 24px; color: white; transition: transform 0.3s;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          </div>
        </div>
      `;

      if (!document.getElementById("pulse-animation")) {
        const style = document.createElement("style");
        style.id = "pulse-animation";
        style.textContent = `
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 0.5;
            }
            50% {
              transform: scale(1.2);
              opacity: 0.3;
            }
          }
        `;
        document.head.appendChild(style);
      }

      riderMarker.current = new mapboxgl.Marker({ element: el })
        .setLngLat([riderLocation.longitude, riderLocation.latitude])
        .addTo(map.current);
    }
  }, [riderLocation]);

  // Fetch and draw route
  useEffect(() => {
    if (
      !map.current ||
      !isValidCoordinate(pickup) ||
      !isValidCoordinate(dropoff)
    )
      return;

    const fetchRoute = async () => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup.longitude},${pickup.latitude};${dropoff.longitude},${dropoff.latitude}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`
        );

        const data = await response.json();
        if (data.routes && data.routes[0]) {
          const route = data.routes[0].geometry;

          if (!map.current.isStyleLoaded()) {
            map.current.once("load", () => addRouteToMap(route));
          } else {
            addRouteToMap(route);
          }
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    const addRouteToMap = (route) => {
      if (map.current.getSource("route")) {
        map.current.removeLayer("route-layer");
        map.current.removeSource("route");
      }

      map.current.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: route,
        },
      });

      map.current.addLayer({
        id: "route-layer",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#3b82f6",
          "line-width": 5,
          "line-opacity": 0.75,
        },
      });
    };

    fetchRoute();
  }, [pickup, dropoff]);

  // Auto-fit bounds (only when at least two valid points exist)
  useEffect(() => {
    if (!map.current) return;

    const points = [];
    if (isValidCoordinate(riderLocation)) {
      points.push([riderLocation.longitude, riderLocation.latitude]);
    }
    if (isValidCoordinate(pickup)) {
      points.push([pickup.longitude, pickup.latitude]);
    }
    if (isValidCoordinate(dropoff)) {
      points.push([dropoff.longitude, dropoff.latitude]);
    }

    if (points.length >= 2) {
      const bounds = new mapboxgl.LngLatBounds();
      points.forEach((pt) => bounds.extend(pt));
      map.current.fitBounds(bounds, {
        padding: { top: 100, bottom: 100, left: 100, right: 100 },
        duration: 1000,
      });
      return;
    }

    if (points.length === 1) {
      map.current.easeTo({ center: points[0], zoom: 13, duration: 600 });
    }
  }, [pickup, dropoff, riderLocation]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-full rounded-lg overflow-hidden shadow-lg"
    />
  );
};

export default DeliveryMap;
