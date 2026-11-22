export default function MedicineList({ results, selectedId, onSelect, details }) {
  return (
    <ul className="mt-6 space-y-3">
      {results.map((m) => (
        <li key={m.id}>
          <button
            onClick={() => onSelect(m)}
            className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition shadow-xs cursor-pointer ${
              selectedId === m.id
                ? "border-[var(--olive-primary)] bg-[var(--bg-card-hover)] ring-2 ring-[var(--olive-badge-bg)]"
                : "border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--border-focus)] hover:bg-[var(--bg-card-hover)]"
            }`}
          >
            <div>
              <p className="text-base font-semibold text-[var(--text-primary)]">{m.name}</p>
              <p className="text-xs text-[var(--text-muted)]">
                {m.generic_name} · {m.category}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-[var(--olive-primary)]">₹{m.base_price}</p>
              <p className="text-[11px] text-[var(--text-muted)]">match {Math.round(m.score)}%</p>
            </div>
          </button>

          {selectedId === m.id && details}
        </li>
      ))}
    </ul>
  );
}