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
      <p className="mb-4 text-sm text-slate-400">
        Plan your stock. Search a medicine to see its expected demand for the next 4 weeks.
      </p>

      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a medicine, e.g. dolo"
          className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-teal-500"
        />
        <button className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500">
          Search
        </button>
      </form>

      {error && <p className="mb-3 text-sm text-rose-400">{error}</p>}

      <div className="mb-6 flex flex-wrap gap-2">
        {results.map((m) => (
          <button
            key={m.id}
            onClick={() => handleSelect(m)}
            className={
              "rounded-full border px-3 py-1 text-xs font-medium transition " +
              (selected?.id === m.id
                ? "border-teal-500 bg-teal-950/70 text-teal-300"
                : "border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700 hover:text-slate-100")
            }
          >
            {m.name}
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-slate-400">Loading forecast...</p>}

      {forecast && (
        <section className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
              <p className="text-xs text-slate-400">Expected demand, next 28 days</p>
              <p className="mt-1 text-2xl font-bold text-slate-100">{total} units</p>
            </div>
            <div className="rounded-xl border border-teal-800/60 bg-teal-950/40 p-4">
              <p className="text-xs text-teal-300">Suggested order (incl. 15% buffer)</p>
              <p className="mt-1 text-2xl font-bold text-teal-300">{suggested} units</p>
            </div>
          </div>

          <ForecastChart forecast={forecast} />

          <p className="text-xs text-slate-500">
            Forecast from historical sales patterns (trend, weekends, seasonality). It is an
            estimate. Adjust for current stock and local events.
          </p>
        </section>
      )}
    </div>
  );
}