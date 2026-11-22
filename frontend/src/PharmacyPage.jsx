import { useState } from "react";
import { searchMedicines, getDemandForecast } from "./api";
import ForecastChart from "./components/ForecastChart";

const BUFFER = 0.15; // 15% safety stock

export default function PharmacyPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setError("");
    setForecast(null);
    setSelected(null);
    try {
            const data = await searchMedicines(query);
      setResults(Array.isArray(data) ? data : data.results ?? []);
    } catch {
      setError("Search failed. Is the backend running?");
    }
  }

  async function handleSelect(med) {
    setSelected(med);
    setForecast(null);
    setError("");
    setLoading(true);
    try {
      setForecast(await getDemandForecast({ medicineId: med.id, days: 28 }));
    } catch {
      setError("Could not load the forecast.");
    } finally {
      setLoading(false);
    }
  }

  const total = forecast ? Math.round(forecast.total_units) : 0;
  const suggested = Math.ceil(total * (1 + BUFFER));

  return (
    <div>
      <p className="mb-4 text-xs text-[#6e7269]">
        Plan your pharmacy stock. Search a medicine to see its expected demand for the next 4 weeks.
      </p>

      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a medicine, e.g. dolo"
          className="flex-1 rounded-lg border border-[#cfd2cb] bg-white px-3.5 py-2 text-sm text-[#1f221e] placeholder-[#8f938a] outline-none transition focus:border-[#42543d] focus:ring-2 focus:ring-[#eef2ec]"
        />
        <button className="rounded-lg bg-[#3d4f39] px-4 py-2 text-sm font-medium text-white transition shadow-xs hover:bg-[#303f2c]">
          Search
        </button>
      </form>

      {error && <p className="mb-3 text-xs text-[#8c3e3e]">{error}</p>}

      <div className="mb-6 flex flex-wrap gap-2">
        {results.map((m) => (
          <button
            key={m.id}
            onClick={() => handleSelect(m)}
            className={
              "rounded-full border px-3 py-1 text-xs font-medium transition " +
              (selected?.id === m.id
                ? "border-[#42543d] bg-[#f0f5ee] text-[#344930]"
                : "border-[#e2e2dc] bg-white text-[#5c6057] hover:border-[#cfd3ca] hover:text-[#1f221e]")
            }
          >
            {m.name}
          </button>
        ))}
      </div>

      {loading && <p className="text-xs text-[#6e7269]">Loading forecast...</p>}

      {forecast && (
        <section className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#e2e2dc] bg-white p-4 shadow-xs">
              <p className="text-xs text-[#6e7269]">Expected demand, next 28 days</p>
              <p className="mt-1 text-2xl font-bold text-[#1f221e]">{total} units</p>
            </div>
            <div className="rounded-xl border border-[#d2dfcc] bg-[#f2f7ef] p-4 shadow-xs">
              <p className="text-xs text-[#384a34]">Suggested order (incl. 15% buffer)</p>
              <p className="mt-1 text-2xl font-bold text-[#384a34]">{suggested} units</p>
            </div>
          </div>

          <ForecastChart forecast={forecast} />

          <p className="text-[11px] leading-relaxed text-[#8e9389]">
            Forecast calculated from historical purchase patterns. Use as a planning guide alongside live inventory.
          </p>
        </section>
      )}
    </div>
  );
}