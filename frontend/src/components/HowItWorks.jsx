const STEPS = [
  {
    n: "1",
    title: "Search",
    text: "Type the medicine name, even with spelling mistakes. Fuzzy matching finds it.",
  },
  {
    n: "2",
    title: "Check stock chance",
    text: "A trained model predicts which nearby pharmacies are likely to have it today.",
  },
  {
    n: "3",
    title: "Save money",
    text: "Compare other brands with the same ingredient and pick the cheaper one.",
  },
];

export default function HowItWorks() {
  return (
    <section className="mt-12">
      <h2 className="mb-4 text-center text-xl font-bold text-slate-100">How it works</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {STEPS.map((s) => (
          <div
            key={s.n}
            className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm"
          >
            <span className="mb-2.5 flex h-7 w-7 items-center justify-center rounded-full border border-teal-500/30 bg-teal-500/20 text-xs font-bold text-teal-300">
              {s.n}
            </span>
            <h3 className="font-semibold text-slate-100">{s.title}</h3>
            <p className="mt-1 text-sm text-slate-400">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}