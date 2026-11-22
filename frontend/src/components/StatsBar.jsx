import { useEffect, useState } from "react";
import { getStats } from "../api";

export default function StatsBar() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getStats().then(setStats).catch(() => setStats(null));
  }, []);

  if (!stats) return null;

  const items = [
    { value: stats.pharmacies, label: "Pharmacies listed" },
    { value: stats.medicines, label: "Medicines in catalog" },
    { value: stats.generics, label: "Active ingredients" },
  ];

  return (
    <div className="mb-6 grid grid-cols-3 gap-3">
      {items.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 text-center shadow-sm"
        >
          <p className="text-2xl font-bold text-teal-400">{s.value}</p>
          <p className="text-xs text-slate-400">{s.label}</p>
        </div>
      ))}
    </div>
  );
}