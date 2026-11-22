const CHIPS = [
  "Typo-tolerant search",
  "Stock prediction",
  "Cheaper alternatives",
  "Interactive map",
];

export default function Hero() {
  return (
    <section className="mb-6 text-center">
      <h2 className="text-3xl font-bold tracking-tight text-[#1f221e] sm:text-4xl">
        Find your medicine <span className="text-[#42543d]">before you step out</span>
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#5c6057]">
        Misspelled the name? Search understands common typos, calculates which nearby
        pharmacies likely have it in stock, and highlights lower-cost alternatives.
      </p>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {CHIPS.map((c) => (
          <span
            key={c}
            className="rounded-full border border-[#d8dfd4] bg-[#f2f6f0] px-3.5 py-1 text-xs font-medium text-[#384a34]"
          >
            {c}
          </span>
        ))}
      </div>

      <p className="mx-auto mt-5 max-w-xl rounded-lg border border-[#edd7d7] bg-[#fcf6f6] px-4 py-2.5 text-xs text-[#783636]">
        Medical emergency? Call <strong>112</strong> or ambulance <strong>108</strong> right away.
        MediFind is for locating pharmacy availability, not emergency care.
      </p>
    </section>
  );
}