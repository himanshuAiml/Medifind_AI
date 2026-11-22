const CHIPS = [
  "Typo-tolerant search",
  "Stock prediction",
  "Cheaper alternatives",
  "Interactive map",
];

export default function Hero() {
  return (
    <section className="mb-6 text-center">
      <h2 className="text-3xl font-bold tracking-tight text-[#1c1f1a] sm:text-4xl">
        Find your medicine <span className="text-[#3a4d35]">before you step out</span>
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#4e5348]">
        Misspelled the name? Search understands common typos, calculates which nearby
        pharmacies likely have it in stock, and highlights lower-cost alternatives.
      </p>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {CHIPS.map((c) => (
          <span
            key={c}
            className="rounded-full border border-[#cfccc0] bg-[#eae7de] px-3.5 py-1 text-xs font-medium text-[#2d3a28]"
          >
            {c}
          </span>
        ))}
      </div>

      <p className="mx-auto mt-5 max-w-xl rounded-lg border border-[#d8c2c2] bg-[#ebd8d8] px-4 py-2.5 text-xs text-[#6e2c2c]">
        Medical emergency? Call <strong>112</strong> or ambulance <strong>108</strong> right away.
        MediFind is for locating pharmacy availability, not emergency care.
      </p>
    </section>
  );
}