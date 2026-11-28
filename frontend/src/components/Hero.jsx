const CHIPS = [
  "Typo-tolerant search",
  "ML stock prediction",
  "Cheaper brands",
  "Live map",
];

export default function Hero() {
  return (
    <section className="mb-6 text-center">
      <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        Find your medicine <span className="text-teal-600">before you step out</span>
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-slate-600">
        Misspelled the name? No problem. Our search understands you, predicts which nearby
        pharmacies are likely to have it in stock, and shows cheaper alternatives.
      </p>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {CHIPS.map((c) => (
          <span
            key={c}
            className="rounded-full border border-teal-200 bg-white/80 px-3 py-1 text-xs font-medium text-teal-700"
          >
            {c}
          </span>
        ))}
      </div>

      <p className="mx-auto mt-5 max-w-xl rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
        Medical emergency? Call <strong>112</strong> or ambulance <strong>108</strong> right away.
        MediFind is for finding medicines, not for emergencies.
      </p>
    </section>
  );
}