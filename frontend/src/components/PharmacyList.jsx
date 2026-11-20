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
    <section className="mt-3 border-l-4 border-teal-600 pl-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-800">Pharmacies for {medicine.name}</h2>
        <select
          value={radiusKm}
          onChange={(e) => onRadiusChange(Number(e.target.value))}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          {[2, 5, 10].map((km) => (
            <option key={km} value={km}>
              Within {km} km
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="mt-4 text-slate-500">Checking pharmacies...</p>}
      {!loading && pharmacies.length === 0 && (
        <p className="mt-4 text-slate-500">No pharmacies in this radius. Try a larger one.</p>
      )}

      {pharmacies.length > 0 && <PharmacyMap center={center} pharmacies={pharmacies} />}

      <ul className="mt-4 space-y-3">
        {pharmacies.map((p) => {
          const level = chance(p.probability);
          const percent = Math.round(p.probability * 100);
          return (
            <li key={p.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-800">{p.name}</p>
                  <p className="text-sm text-slate-500">
                    {p.distance_km} km away · {p.size} pharmacy
                  </p>
                </div>
                <p className={`text-lg font-bold ${level.text}`}>{percent}%</p>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-100">
                <div className={`h-2 rounded-full ${level.bar}`} style={{ width: `${percent}%` }} />
              </div>
              <p className={`mt-1 text-xs ${level.text}`}>{level.label}</p>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-xs text-slate-400">
        Predicted from historical stock patterns, not live inventory. Please confirm with the pharmacy.
      </p>
    </section>
  );
}