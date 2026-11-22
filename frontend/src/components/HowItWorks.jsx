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
    <section className="mt-14">
      <h2 className="mb-4 text-center text-lg font-bold text-[#1c1f1a]">How it works</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {STEPS.map((s) => (
          <div
            key={s.n}
            className="rounded-xl border border-[#cfccc2] bg-[#eae7de] p-4 shadow-xs"
          >
            <span className="mb-2.5 flex h-7 w-7 items-center justify-center rounded-full border border-[#b8c7b3] bg-[#d7e2d2] text-xs font-bold text-[#283823]">
              {s.n}
            </span>
            <h3 className="font-semibold text-[#1c1f1a]">{s.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-[#5e6358]">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}