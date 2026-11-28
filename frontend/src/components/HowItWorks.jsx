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
      <h2 className="mb-4 text-center text-xl font-bold text-slate-800">How it works</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {STEPS.map((s) => (
          <div
            key={s.n}
            className="rounded-xl border border-white bg-white/80 p-4 shadow-sm backdrop-blur"
          >
            <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
              {s.n}
            </span>
            <h3 className="font-semibold text-slate-800">{s.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}