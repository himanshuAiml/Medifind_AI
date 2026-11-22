import { chance } from "../chance";
import PharmacyMap from "./PharmacyMap";

export default function PharmacyList({
  medicine,
  pharmacies,
  loading,
  radiusKm,
  onRadiusChange,
  center,
}) {
  return (
    <section className="mt-4 border-l-4 border-[var(--olive-primary)] pl-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-[var(--text-primary)]">Pharmacies for {medicine.name}</h2>
        <select
          value={radiusKm}
          onChange={(e) => onRadiusChange(Number(e.target.value))}
          className="rounded-lg border border-[var(--border-focus)] bg-[var(--bg-card)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--olive-primary)] cursor-pointer"
        >
          {[2, 5, 10].map((km) => (
            <option key={km} value={km}>
              Within {km} km
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="mt-4 text-xs text-[var(--text-muted)]">Checking nearby pharmacies...</p>}
      {!loading && pharmacies.length === 0 && (
        <p className="mt-4 text-xs text-[var(--text-muted)]">No pharmacies found in this radius. Try selecting a larger distance.</p>
      )}

      {pharmacies.length > 0 && <PharmacyMap center={center} pharmacies={pharmacies} />}

      <ul className="mt-4 space-y-3">
        {pharmacies.map((p) => {
          const level = chance(p.probability);
          const percent = Math.round(p.probability * 100);
          return (
            <li key={p.id} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 shadow-xs">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">{p.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {p.distance_km} km away · {p.size} pharmacy
                  </p>
                </div>
                <p className={`text-base font-bold ${level.text}`}>{percent}%</p>
              </div>
              <div className="mt-3 h-2 rounded-full bg-[var(--track-bg)]">
                <div className={`h-2 rounded-full ${level.bar}`} style={{ width: `${percent}%` }} />
              </div>
              <p className={`mt-1 text-[11px] font-medium ${level.text}`}>{level.label}</p>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-[11px] leading-relaxed text-[var(--text-muted)]">
        Estimated from historical stocking patterns. Please call to confirm before traveling.
      </p>
    </section>
  );
}