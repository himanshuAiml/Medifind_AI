import { useEffect, useState } from "react";
import { getAlternatives } from "../api";

export default function AlternativesList({ medicineId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    setData(null);
    setError("");
    getAlternatives(medicineId)
      .then((d) => {
        if (!ignore) setData(d);
      })
      .catch(() => {
        if (!ignore) setError("Could not load alternatives.");
      });
    return () => {
      ignore = true;
    };
  }, [medicineId]);

  if (error) return <p className="mt-3 text-xs text-[#8c3636]">{error}</p>;
  if (!data) return <p className="mt-3 text-xs text-[var(--text-muted)]">Loading alternatives...</p>;

  const { medicine, alternatives } = data;

  return (
    <section className="mt-4 border-l-4 border-[#857041] pl-4">
      <h3 className="font-semibold text-[var(--text-primary)]">Same active ingredient, other brands</h3>
      <p className="mb-2 text-xs text-[var(--text-muted)]">
        Active ingredient: {medicine.generic_name}. {medicine.name} costs ₹{medicine.base_price}.
      </p>

      {alternatives.length === 0 ? (
        <p className="text-xs text-[var(--text-muted)]">No other brands found for this ingredient.</p>
      ) : (
        <ul className="space-y-2">
          {alternatives.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-2"
            >
              <span className="text-sm font-medium text-[var(--text-primary)]">{a.name}</span>
              <span className="text-sm text-[var(--text-primary)]">
                <span className="font-semibold">₹{a.base_price}</span>{" "}
                {a.saving > 0 ? (
                  <span className="rounded-full border border-[var(--olive-badge-border)] bg-[var(--olive-badge-bg)] px-2 py-0.5 text-xs font-semibold text-[var(--olive-badge-text)]">
                    Save ₹{a.saving} ({a.saving_pct}%)
                  </span>
                ) : a.saving < 0 ? (
                  <span className="rounded-full border border-[var(--border-color)] bg-[var(--bg-card-hover)] px-2 py-0.5 text-xs text-[var(--text-muted)]">
                    ₹{Math.abs(a.saving)} more
                  </span>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-2 text-[11px] leading-relaxed text-[var(--text-muted)]">
        Same ingredient does not always mean identical formulation. Check with your pharmacist or physician.
      </p>
    </section>
  );
}