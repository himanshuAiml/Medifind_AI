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
          className="rounded-xl border border-[#cfccc2] bg-[#eae7de] p-3.5 text-center shadow-xs"
        >
          <p className="text-2xl font-bold text-[#2d3e29]">{s.value}</p>
          <p className="mt-0.5 text-xs text-[#5e6358]">{s.label}</p>
        </div>
      ))}
    </div>
  );
}