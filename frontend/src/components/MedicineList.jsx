export default function MedicineList({ results, selectedId, onSelect, details }) {
  return (
    <ul className="mt-6 space-y-3">
      {results.map((m) => (
        <li key={m.id}>
          <button
            onClick={() => onSelect(m)}
            className={`flex w-full items-center justify-between rounded-lg border p-4 text-left transition shadow-sm ${
              selectedId === m.id
                ? "border-teal-500 bg-slate-900 ring-1 ring-teal-500/40"
                : "border-slate-800 bg-slate-900/70 hover:border-slate-700 hover:bg-slate-900"
            }`}
          >
            <div>
              <p className="text-base font-semibold text-slate-100">{m.name}</p>
              <p className="text-sm text-slate-400">
                {m.generic_name} · {m.category}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-teal-400">₹{m.base_price}</p>
              <p className="text-xs text-slate-500">match {Math.round(m.score)}%</p>
            </div>
          </button>

          {selectedId === m.id && details}
        </li>
      ))}
    </ul>
  );
}