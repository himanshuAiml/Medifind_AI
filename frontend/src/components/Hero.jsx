const CHIPS = [
  "Typo-tolerant search",
  "Stock prediction",
  "Cheaper alternatives",
  "Interactive map",
];

export default function Hero() {
  return (
    <section className="mb-6 text-center">
      <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
        Find your medicine <span className="text-[var(--olive-primary)]">before you step out</span>
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
        Misspelled the name? Search understands common typos, calculates which nearby
        pharmacies likely have it in stock, and highlights lower-cost alternatives.
      </p>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {CHIPS.map((c) => (
          <span
            key={c}
            className="rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] px-3.5 py-1 text-xs font-medium text-[var(--text-secondary)]"
          >
            {c}
          </span>
        ))}
      </div>

      <p className="mx-auto mt-5 max-w-xl rounded-lg border border-[var(--emergency-border)] bg-[var(--emergency-bg)] px-4 py-2.5 text-xs text-[var(--emergency-text)]">
        Medical emergency? Call <strong>112</strong> or ambulance <strong>108</strong> right away.
        MediFind is for locating pharmacy availability, not emergency care.
      </p>
    </section>
  );
}