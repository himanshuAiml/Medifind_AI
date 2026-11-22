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
      <p className="mb-4 text-xs text-[var(--text-muted)]">
        Plan your pharmacy stock. Search a medicine to see its expected demand for the next 4 weeks.
      </p>

      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a medicine, e.g. dolo"
          className="flex-1 rounded-lg border border-[var(--border-focus)] bg-[var(--bg-input)] px-3.5 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition focus:border-[var(--olive-primary)] focus:ring-2 focus:ring-[var(--olive-badge-bg)]"
        />
        <button className="rounded-lg bg-[var(--olive-primary)] px-4 py-2 text-sm font-medium text-[#f7f6f2] transition shadow-xs hover:bg-[var(--olive-hover)] cursor-pointer">
          Search
        </button>
      </form>

      {error && <p className="mb-3 text-xs text-[#8c3636]">{error}</p>}

      <div className="mb-6 flex flex-wrap gap-2">
        {results.map((m) => (
          <button
            key={m.id}
            onClick={() => handleSelect(m)}
            className={
              "rounded-full border px-3 py-1 text-xs font-medium transition cursor-pointer " +
              (selected?.id === m.id
                ? "border-[var(--olive-primary)] bg-[var(--olive-badge-bg)] text-[var(--olive-badge-text)] font-semibold"
                : "border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[var(--border-focus)] hover:text-[var(--text-primary)]")
            }
          >
            {m.name}
          </button>
        ))}
      </div>

      {loading && <p className="text-xs text-[var(--text-muted)]">Loading forecast...</p>}

      {forecast && (
        <section className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 shadow-xs">
              <p className="text-xs text-[var(--text-muted)]">Expected demand, next 28 days</p>
              <p className="mt-1 text-2xl font-bold text-[var(--text-primary)]">{total} units</p>
            </div>
            <div className="rounded-xl border border-[var(--olive-badge-border)] bg-[var(--olive-badge-bg)] p-4 shadow-xs">
              <p className="text-xs text-[var(--olive-badge-text)]">Suggested order (incl. 15% buffer)</p>
              <p className="mt-1 text-2xl font-bold text-[var(--olive-badge-text)]">{suggested} units</p>
            </div>
          </div>

          <ForecastChart forecast={forecast} />

          <p className="text-[11px] leading-relaxed text-[var(--text-muted)]">
            Forecast calculated from historical purchase patterns. Use as a planning guide alongside live inventory.
          </p>
        </section>
      )}
    </div>
  );
}