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
      <div className="overflow-hidden rounded-xl border border-[#cfccc2]">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={14}
          scrollWheelZoom={false}
          className="h-72 w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitToPoints points={points} />

          <CircleMarker
            center={[center.lat, center.lng]}
            radius={8}
            pathOptions={{ color: "#fff", weight: 2, fillColor: "#253420", fillOpacity: 1 }}
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
      </div>

      <div className="mt-2.5 flex flex-wrap gap-4 text-[11px] text-[#5e6358]">
        <span><span className="text-[#465a40]">●</span> 70% or more (likely)</span>
        <span><span className="text-[#967d43]">●</span> 40 to 70% (possible)</span>
        <span><span className="text-[#9e5454]">●</span> under 40% (unlikely)</span>
        <span><span className="text-[#253420]">●</span> your location</span>
      </div>
    </div>
  );
}