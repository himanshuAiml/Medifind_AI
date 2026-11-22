export default function MedicineList({ results, selectedId, onSelect, details }) {
  return (
    <ul className="mt-6 space-y-3">
      {results.map((m) => (
        <li key={m.id}>
          <button
            onClick={() => onSelect(m)}
            className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition shadow-xs ${
              selectedId === m.id
                ? "border-[#42543d] bg-[#fbfcfb] ring-2 ring-[#e4ede1]"
                : "border-[#e2e2dc] bg-white hover:border-[#cfd3ca] hover:bg-[#fafaf8]"
            }`}
          >
            <div>
              <p className="text-base font-semibold text-[#1f221e]">{m.name}</p>
              <p className="text-xs text-[#6e7269]">
                {m.generic_name} · {m.category}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-[#384934]">₹{m.base_price}</p>
              <p className="text-[11px] text-[#8e9389]">match {Math.round(m.score)}%</p>
            </div>
          </button>

          {selectedId === m.id && details}
        </li>
      ))}
    </ul>
  );
}