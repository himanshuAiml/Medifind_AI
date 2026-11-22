export default function MedicineList({ results, selectedId, onSelect, details }) {
  return (
    <ul className="mt-6 space-y-3">
      {results.map((m) => (
        <li key={m.id}>
          <button
            onClick={() => onSelect(m)}
            className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition shadow-xs ${
              selectedId === m.id
                ? "border-[#3a4d35] bg-[#eeebe2] ring-2 ring-[#cfdacb]"
                : "border-[#cfccc2] bg-[#eae7de] hover:border-[#b8b5a9] hover:bg-[#eeebe2]"
            }`}
          >
            <div>
              <p className="text-base font-semibold text-[#1c1f1a]">{m.name}</p>
              <p className="text-xs text-[#5e6358]">
                {m.generic_name} · {m.category}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-[#2d3e29]">₹{m.base_price}</p>
              <p className="text-[11px] text-[#787d72]">match {Math.round(m.score)}%</p>
            </div>
          </button>

          {selectedId === m.id && details}
        </li>
      ))}
    </ul>
  );
}