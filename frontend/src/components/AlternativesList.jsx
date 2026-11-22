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
  if (!data) return <p className="mt-3 text-xs text-[#5e6358]">Loading alternatives...</p>;

  const { medicine, alternatives } = data;

  return (
    <section className="mt-4 border-l-4 border-[#857041] pl-4">
      <h3 className="font-semibold text-[#1c1f1a]">Same active ingredient, other brands</h3>
      <p className="mb-2 text-xs text-[#5e6358]">
        Active ingredient: {medicine.generic_name}. {medicine.name} costs ₹{medicine.base_price}.
      </p>

      {alternatives.length === 0 ? (
        <p className="text-xs text-[#5e6358]">No other brands found for this ingredient.</p>
      ) : (
        <ul className="space-y-2">
          {alternatives.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between rounded-lg border border-[#cfccc2] bg-[#eae7de] px-3 py-2"
            >
              <span className="text-sm font-medium text-[#1c1f1a]">{a.name}</span>
              <span className="text-sm text-[#1c1f1a]">
                <span className="font-semibold">₹{a.base_price}</span>{" "}
                {a.saving > 0 ? (
                  <span className="rounded-full border border-[#b8c7b3] bg-[#d7e2d2] px-2 py-0.5 text-xs font-semibold text-[#253620]">
                    Save ₹{a.saving} ({a.saving_pct}%)
                  </span>
                ) : a.saving < 0 ? (
                  <span className="rounded-full border border-[#cfccc0] bg-[#dedbd0] px-2 py-0.5 text-xs text-[#5e6358]">
                    ₹{Math.abs(a.saving)} more
                  </span>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-2 text-[11px] leading-relaxed text-[#787d72]">
        Same ingredient does not always mean identical formulation. Check with your pharmacist or physician.
      </p>
    </section>
  );
}