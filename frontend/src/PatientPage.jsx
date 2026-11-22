import { useState } from "react";
import SearchBar from "./components/SearchBar";
import MedicineList from "./components/MedicineList";
import PharmacyList from "./components/PharmacyList";
import AlternativesList from "./components/AlternativesList";
import LocationPicker from "./components/LocationPicker";
import { searchMedicines, getNearbyPharmacies } from "./api";

const DEMO_LOCATION = { lat: 27.4924, lng: 77.6737 }; // central Mathura, where our pharmacies are

function describe(source, loc) {
  const coords = `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`;
  if (source === "gps") return `your device location (${coords})`;
  if (source === "map") return `a point you picked (${coords})`;
  return "demo location (Mathura)";
}

export default function PatientPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const [selected, setSelected] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [pharmLoading, setPharmLoading] = useState(false);
  const [radiusKm, setRadiusKm] = useState(5);

  const [location, setLocation] = useState(DEMO_LOCATION);
  const [locSource, setLocSource] = useState("demo"); // "demo" | "gps" | "map"
  const [showPicker, setShowPicker] = useState(false);
  const [locBusy, setLocBusy] = useState(false);
  const [locError, setLocError] = useState("");

  async function handleSearch(query) {
    setLoading(true);
    setError("");
    setSelected(null);
    setPharmacies([]);
    try {
      const data = await searchMedicines(query);
      setResults(data.results);
      setSearched(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadPharmacies(medicine, radius, loc) {
    setPharmLoading(true);
    setError("");
    try {
      const data = await getNearbyPharmacies({
        ...loc,
        radiusKm: radius,
        medicineId: medicine.id,
      });
      setPharmacies(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setPharmLoading(false);
    }
  }

  function handleSelect(medicine) {
    if (selected?.id === medicine.id) {
      setSelected(null);
      setPharmacies([]);
      return;
    }
    setSelected(medicine);
    setPharmacies([]);
    loadPharmacies(medicine, radiusKm, location);
  }

  function handleRadiusChange(radius) {
    setRadiusKm(radius);
    if (selected) loadPharmacies(selected, radius, location);
  }

  function applyLocation(loc, source) {
    setLocation(loc);
    setLocSource(source);
    setLocError("");
    if (selected) loadPharmacies(selected, radiusKm, loc);
  }

  function handleUseMyLocation() {
    setLocError("");
    if (!navigator.geolocation) {
      setLocError("Your browser does not support location.");
      return;
    }
    setLocBusy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocBusy(false);
        applyLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }, "gps");
      },
      (err) => {
        setLocBusy(false);
        setLocError(
          err.code === 1
            ? "Location permission was denied. Allow it in the browser address bar and try again."
            : `Could not get your location (code ${err.code}: ${err.message}). Try picking a point on the map instead.`
        );
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 60000 }
    );
  }

  return (
    <div>
      <p className="mb-4 text-xs text-[#6e7269]">
        Search medicines and verify likelihood of availability at nearby pharmacies.
      </p>

      <div className="mb-4 rounded-xl border border-[#e2e2dc] bg-white p-3.5 shadow-xs">
        <p className="text-xs text-[#1f221e]">
          Searching near: <span className="font-semibold text-[#384934]">{describe(locSource, location)}</span>
        </p>

        <div className="mt-2.5 flex flex-wrap gap-2">
          <button
            onClick={handleUseMyLocation}
            disabled={locBusy}
            className="rounded-lg bg-[#3d4f39] px-3 py-1.5 text-xs font-medium text-white transition shadow-xs hover:bg-[#303f2c] disabled:opacity-60"
          >
            {locBusy ? "Finding you..." : "Use my location"}
          </button>
          <button
            onClick={() => setShowPicker((v) => !v)}
            className="rounded-lg border border-[#cfd2cb] bg-[#f8f8f6] px-3 py-1.5 text-xs font-medium text-[#384934] transition hover:bg-[#edebe7]"
          >
            {showPicker ? "Hide map" : "Pick on map"}
          </button>
          {locSource !== "demo" && (
            <button
              onClick={() => applyLocation(DEMO_LOCATION, "demo")}
              className="rounded-lg border border-[#cfd2cb] bg-[#f8f8f6] px-3 py-1.5 text-xs font-medium text-[#6e7269] transition hover:bg-[#edebe7]"
            >
              Use demo location
            </button>
          )}
        </div>

        {locError && <p className="mt-2 text-xs text-[#8c3e3e]">{locError}</p>}

        {showPicker && (
          <LocationPicker
            startCenter={DEMO_LOCATION}
            location={location}
            onPick={(loc) => applyLocation(loc, "map")}
          />
        )}

        {locSource !== "demo" && (
          <p className="mt-2 text-[11px] text-[#8e9389]">
            Our demo pharmacies are in Mathura. If your point is far from there, no pharmacies
            will appear within the radius.
          </p>
        )}
      </div>

      <SearchBar onSearch={handleSearch} loading={loading} />

      {error && <p className="mt-4 text-xs text-[#8c3e3e]">{error}</p>}
      {searched && !error && results.length === 0 && (
        <p className="mt-6 text-xs text-[#6e7269]">No medicine found. Try a different spelling.</p>
      )}

      <MedicineList
        results={results}
        selectedId={selected?.id}
        onSelect={handleSelect}
        details={
          selected && (
            <>
              <AlternativesList medicineId={selected.id} />
              <PharmacyList
                medicine={selected}
                pharmacies={pharmacies}
                loading={pharmLoading}
                radiusKm={radiusKm}
                onRadiusChange={handleRadiusChange}
                center={location}
              />
            </>
          )
        }
      />
    </div>
  );
}