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
    <section className="mt-3 border-l-4 border-teal-500 pl-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-slate-100">Pharmacies for {medicine.name}</h2>
        <select
          value={radiusKm}
          onChange={(e) => onRadiusChange(Number(e.target.value))}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-200 outline-none focus:border-teal-500"
        >
          {[2, 5, 10].map((km) => (
            <option key={km} value={km} className="bg-slate-900 text-slate-200">
              Within {km} km
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="mt-4 text-slate-400">Checking pharmacies...</p>}
      {!loading && pharmacies.length === 0 && (
        <p className="mt-4 text-slate-400">No pharmacies in this radius. Try a larger one.</p>
      )}

      {pharmacies.length > 0 && <PharmacyMap center={center} pharmacies={pharmacies} />}

      <ul className="mt-4 space-y-3">
        {pharmacies.map((p) => {
          const level = chance(p.probability);
          const percent = Math.round(p.probability * 100);
          return (
            <li key={p.id} className="rounded-lg border border-slate-800 bg-slate-900/90 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-100">{p.name}</p>
                  <p className="text-sm text-slate-400">
                    {p.distance_km} km away · {p.size} pharmacy
                  </p>
                </div>
                <p className={`text-base font-bold ${level.text}`}>{percent}%</p>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-800">
                <div className={`h-2 rounded-full ${level.bar}`} style={{ width: `${percent}%` }} />
              </div>
              <p className={`mt-1 text-xs ${level.text}`}>{level.label}</p>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-xs text-slate-500">
        Predicted from historical stock patterns, not live inventory. Please confirm with the pharmacy.
      </p>
    </section>
  );
}