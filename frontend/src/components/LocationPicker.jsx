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
    <div className="mt-3 overflow-hidden rounded-lg border border-slate-800">
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
          pathOptions={{ color: "#0f766e", fillColor: "#14b8a6", fillOpacity: 0.85 }}
        />
      </MapContainer>
      <p className="bg-slate-900 px-3 py-1.5 text-xs text-slate-400">
        Click anywhere on the map to set your location.
      </p>
    </div>
  );
}