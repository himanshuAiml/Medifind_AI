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

  if (error) return <p className="mt-3 text-sm text-red-600">{error}</p>;
  if (!data) return <p className="mt-3 text-sm text-gray-500">Loading alternatives...</p>;

  const { medicine, alternatives } = data;

  return (
    <section className="mt-3 border-l-4 border-amber-500 pl-4">
      <h3 className="font-semibold text-gray-800">Same medicine, other brands</h3>
      <p className="mb-2 text-xs text-gray-500">
        Active ingredient: {medicine.generic_name}. {medicine.name} costs ₹{medicine.base_price}.
      </p>

      {alternatives.length === 0 ? (
        <p className="text-sm text-gray-600">No other brands found for this ingredient.</p>
      ) : (
        <ul className="space-y-2">
          {alternatives.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2"
            >
              <span className="text-sm font-medium text-gray-800">{a.name}</span>
              <span className="text-sm">
                <span className="font-semibold">₹{a.base_price}</span>{" "}
                {a.saving > 0 ? (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                    Save ₹{a.saving} ({a.saving_pct}%)
                  </span>
                ) : a.saving < 0 ? (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    ₹{Math.abs(a.saving)} more
                  </span>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-2 text-xs text-gray-500">
        Same ingredient does not always mean the same strength or suitability. Ask your pharmacist
        or doctor before switching.
      </p>
    </section>
  );
}