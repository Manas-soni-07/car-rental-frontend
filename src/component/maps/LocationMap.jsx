"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import L from "leaflet";

import {
  useEffect,
  useState,
} from "react";

// FIX MARKER ICONS
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// MOVE MAP LIVE
function ChangeMapView({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, 15);
    }
  }, [center, map]);

  return null;
}

export default function LocationMap() {
  // CURRENT LOCATION
  const [currentLocation, setCurrentLocation] =
    useState(null);

  // PICKUP
  const [pickup, setPickup] =
    useState("");

  const [pickupCoords, setPickupCoords] =
    useState(null);

  // DROP
  const [drop, setDrop] =
    useState("");

  const [dropCoords, setDropCoords] =
    useState(null);

  // SUGGESTIONS
  const [
    pickupSuggestions,
    setPickupSuggestions,
  ] = useState([]);

  const [
    dropSuggestions,
    setDropSuggestions,
  ] = useState([]);

  // ROUTE
  const [routeCoords, setRouteCoords] =
    useState([]);

  // DISTANCE + DURATION
  const [distance, setDistance] =
    useState("");

  const [duration, setDuration] =
    useState("");
  const [locationError, setLocationError] =
    useState("");

  // LIVE CURRENT LOCATION
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId =
      navigator.geolocation.watchPosition(
        async (position) => {
          const coords = [
            position.coords.latitude,
            position.coords.longitude,
          ];

          setCurrentLocation(coords);

          // FIRST TIME PICKUP
          if (!pickupCoords) {
            setPickupCoords(coords);

            try {
              const response =
                await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[0]}&lon=${coords[1]}`
                );

              const data =
                await response.json();

              setPickup(
                data.display_name ||
                  "Current Location"
              );
            } catch (error) {
              console.error(error);
            }
          }
        },

        (error) => {
          setLocationError(
            error.message ||
              "Location permission is required to show the live map."
          );
        },

        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );

    // CLEANUP
    return () => {
      navigator.geolocation.clearWatch(
        watchId
      );
    };
  }, [pickupCoords]);

  // SEARCH LOCATION
  const searchLocation = async (
    query,
    type
  ) => {
    if (!query) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );

      const data = await response.json();

      if (type === "pickup") {
        setPickupSuggestions(data);
      } else {
        setDropSuggestions(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // SELECT LOCATION
  const selectLocation = (
    place,
    type
  ) => {
    const coords = [
      parseFloat(place.lat),
      parseFloat(place.lon),
    ];

    if (type === "pickup") {
      setPickup(place.display_name);

      setPickupCoords(coords);

      setPickupSuggestions([]);
    } else {
      setDrop(place.display_name);

      setDropCoords(coords);

      setDropSuggestions([]);
    }
  };

  // GET ROUTE
  useEffect(() => {
    const getRoute = async () => {
      if (!pickupCoords || !dropCoords)
        return;

      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${pickupCoords[1]},${pickupCoords[0]};${dropCoords[1]},${dropCoords[0]}?overview=full&geometries=geojson`
        );

        const data = await response.json();

        if (!data.routes?.length) {
          setRouteCoords([]);
          setDistance("");
          setDuration("");
          return;
        }

        const route =
          data.routes[0].geometry.coordinates.map(
            (coord) => [
              coord[1],
              coord[0],
            ]
          );

        setRouteCoords(route);

        // DISTANCE
        const km =
          (
            data.routes[0].distance / 1000
          ).toFixed(2);

        setDistance(`${km} km`);

        // DURATION
        const mins = Math.round(
          data.routes[0].duration / 60
        );

        setDuration(`${mins} mins`);
      } catch (error) {
        console.error(error);
      }
    };

    getRoute();
  }, [pickupCoords, dropCoords]);

  // LOADING
  if (!currentLocation) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">
          {locationError || "Getting your live location..."}
        </p>
      </div>
    );
  }

return (
  <div className="w-full h-[600px] flex">
    
    {/* LEFT SIDE */}
    <div className="w-[400px] min-w-[400px] h-[600px] bg-white border-r p-4 overflow-y-auto">
      
      <h2 className="text-2xl font-bold mb-6">
        Book Your Ride
      </h2>

      {/* PICKUP */}
      <div className="bg-white rounded-xl shadow-lg p-2 mb-4">
        <input
          type="text"
          placeholder="Pickup Location"
          value={pickup}
          onChange={(e) => {
            setPickup(e.target.value);

            searchLocation(
              e.target.value,
              "pickup"
            );
          }}
          className="w-full p-3 border rounded-lg outline-none"
        />

        {pickupSuggestions.length > 0 && (
          <div className="max-h-52 overflow-y-auto">
            {pickupSuggestions.map(
              (place, index) => (
                <div
                  key={index}
                  onClick={() =>
                    selectLocation(
                      place,
                      "pickup"
                    )
                  }
                  className="p-3 border-b cursor-pointer hover:bg-gray-100"
                >
                  {place.display_name}
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* DROP */}
      <div className="bg-white rounded-xl shadow-lg p-2 mb-4">
        <input
          type="text"
          placeholder="Drop Location"
          value={drop}
          onChange={(e) => {
            setDrop(e.target.value);

            searchLocation(
              e.target.value,
              "drop"
            );
          }}
          className="w-full p-3 border rounded-lg outline-none"
        />

        {dropSuggestions.length > 0 && (
          <div className="max-h-52 overflow-y-auto">
            {dropSuggestions.map(
              (place, index) => (
                <div
                  key={index}
                  onClick={() =>
                    selectLocation(
                      place,
                      "drop"
                    )
                  }
                  className="p-3 border-b cursor-pointer hover:bg-gray-100"
                >
                  {place.display_name}
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* DISTANCE INFO */}
      {distance && (
        <div className="bg-white rounded-xl shadow-lg p-4">
          <p className="font-semibold text-lg mb-2">
            Distance: {distance}
          </p>

          <p className="font-semibold text-lg mb-4">
            Duration: {duration}
          </p>

          <button className="w-full bg-black text-white py-3 rounded-xl text-lg font-semibold">
            Continue
          </button>
        </div>
      )}
    </div>

    {/* RIGHT SIDE MAP */}
    <div className="flex-1 h-[600px]">
      <MapContainer
        center={currentLocation}
        zoom={15}
        className="w-full h-[600px]"
      >
        <ChangeMapView
          center={currentLocation}
        />

        {/* TILE */}
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* LIVE LOCATION */}
        <Marker position={currentLocation}>
          <Popup>
            Your Live Location
          </Popup>
        </Marker>

        {/* PICKUP */}
        {pickupCoords && (
          <Marker position={pickupCoords}>
            <Popup>
              Pickup Location
            </Popup>
          </Marker>
        )}

        {/* DROP */}
        {dropCoords && (
          <Marker position={dropCoords}>
            <Popup>
              Drop Location
            </Popup>
          </Marker>
        )}

        {/* ROUTE */}
        {routeCoords.length > 0 && (
          <Polyline positions={routeCoords} />
        )}
      </MapContainer>
    </div>
  </div>
);
}
