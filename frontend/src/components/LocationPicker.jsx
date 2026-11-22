import { MapContainer, TileLayer, CircleMarker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function LocationPicker({ startCenter, location, onPick }) {
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-[#e2e2dc]">
      <MapContainer
        center={[startCenter.lat, startCenter.lng]}
        zoom={12}
        style={{ height: 280, width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onPick={onPick} />
        <CircleMarker
          center={[location.lat, location.lng]}
          radius={9}
          pathOptions={{ color: "#2d3c29", fillColor: "#42543d", fillOpacity: 0.85 }}
        />
      </MapContainer>
      <p className="bg-[#f8f8f6] px-3 py-1.5 text-[11px] text-[#6e7269]">
        Click anywhere on the map to set your location.
      </p>
    </div>
  );
}