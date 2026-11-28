export default function MedicineList({ results, selectedId, onSelect, details }) {
  return (
    <ul className="mt-6 space-y-3">
      {results.map((m) => (
        <li key={m.id}>
          <button
            onClick={() => onSelect(m)}
            className={`flex w-full items-center justify-between rounded-lg border bg-white p-4 text-left shadow-sm hover:border-teal-500 ${
              selectedId === m.id ? "border-teal-600 ring-2 ring-teal-100" : "border-slate-200"
            }`}
          >
            <div>
              <p className="text-lg font-semibold text-slate-800">{m.name}</p>
              <p className="text-sm text-slate-500">
                {m.generic_name} · {m.category}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-teal-700">₹{m.base_price}</p>
              <p className="text-xs text-slate-400">match {Math.round(m.score)}%</p>
            </div>
          </button>

          {selectedId === m.id && details}
        </li>
      ))}
    </ul>
  );
}