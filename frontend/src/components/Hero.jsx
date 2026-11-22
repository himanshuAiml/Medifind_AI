const CHIPS = [
  "Typo-tolerant search",
  "Stock prediction",
  "Cheaper alternatives",
  "Interactive map",
];

export default function Hero() {
  return (
    <section className="mb-6 text-center">
      <h2 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
        Find your medicine <span className="text-teal-400">before you step out</span>
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-slate-400">
        Misspelled the name? Search understands common typos, calculates which nearby
        pharmacies likely have it in stock, and highlights lower-cost alternatives.
      </p>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {CHIPS.map((c) => (
          <span
            key={c}
            className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-300"
          >
            {c}
          </span>
        ))}
      </div>

      <p className="mx-auto mt-5 max-w-xl rounded-lg border border-rose-900/40 bg-rose-950/30 px-4 py-2 text-xs text-rose-300">
        Medical emergency? Call <strong>112</strong> or ambulance <strong>108</strong> right away.
        MediFind is for locating pharmacy availability, not emergency care.
      </p>
    </section>
  );
}