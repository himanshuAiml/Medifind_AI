import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { chance } from "../chance";

function FitToPoints({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      map.fitBounds(points, { padding: [30, 30], maxZoom: 16 });
    }
  }, [points, map]);
  return null;
}

export default function PharmacyMap({ center, pharmacies }) {
  const points = useMemo(
    () => [[center.lat, center.lng], ...pharmacies.map((p) => [p.latitude, p.longitude])],
    [center, pharmacies]
  );

  return (
    <div className="mt-4">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={14}
        scrollWheelZoom={false}
        className="h-72 w-full rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitToPoints points={points} />

        <CircleMarker
          center={[center.lat, center.lng]}
          radius={8}
          pathOptions={{ color: "#fff", weight: 2, fillColor: "#2563eb", fillOpacity: 1 }}
        >
          <Popup>Your location (demo: central Mathura)</Popup>
        </CircleMarker>

        {pharmacies.map((p) => {
          const level = chance(p.probability);
          return (
            <CircleMarker
              key={p.id}
              center={[p.latitude, p.longitude]}
              radius={11}
              pathOptions={{ color: "#fff", weight: 2, fillColor: level.color, fillOpacity: 0.95 }}
            >
              <Popup>
                <strong>{p.name}</strong>
                <br />
                {Math.round(p.probability * 100)}% chance · {p.distance_km} km away
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      <div className="mt-2 flex gap-4 text-xs text-slate-500">
        <span><span className="text-emerald-500">●</span> 70% or more</span>
        <span><span className="text-amber-500">●</span> 40 to 70%</span>
        <span><span className="text-rose-500">●</span> under 40%</span>
        <span><span className="text-blue-600">●</span> you</span>
      </div>
    </div>
  );
}