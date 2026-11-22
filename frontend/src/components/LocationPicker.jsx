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
    <div className="mt-3 overflow-hidden rounded-xl border border-[var(--border-color)]">
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
          pathOptions={{ color: "#253420", fillColor: "#3a4d35", fillOpacity: 0.85 }}
        />
      </MapContainer>
      <p className="bg-[var(--bg-card)] px-3 py-1.5 text-[11px] text-[var(--text-muted)]">
        Click anywhere on the map to set your location.
      </p>
    </div>
  );
}