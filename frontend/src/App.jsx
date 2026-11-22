import { useState } from "react";
import PatientPage from "./PatientPage";
import PharmacyPage from "./PharmacyPage";
import Hero from "./components/Hero";
import StatsBar from "./components/StatsBar";
import HowItWorks from "./components/HowItWorks";

const TABS = [
  { id: "patient", label: "Find medicine" },
  { id: "pharmacy", label: "For pharmacies" },
];

const BACKGROUND = {
  backgroundColor: "#0b0f17",
  backgroundImage:
    "radial-gradient(circle at 15% 10%, rgba(20,184,166,0.08), transparent 35%)," +
    "radial-gradient(circle at 85% 20%, rgba(14,165,233,0.06), transparent 35%)",
  backgroundAttachment: "fixed",
};

function PharmacyHeader() {
  return (
    <section className="mb-6 text-center">
      <h2 className="text-3xl font-extrabold tracking-tight text-slate-100">
        Stock smarter, <span className="text-teal-400">waste less</span>
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-slate-400">
        See the expected demand for any medicine over the next 4 weeks and get a suggested
        order quantity, so you stock what your customers will actually need.
      </p>
    </section>
  );
}

export default function App() {
  const [tab, setTab] = useState("patient");

  return (
    <div className="min-h-screen text-slate-100" style={BACKGROUND}>
      <div className="mx-auto max-w-3xl px-4 py-6">
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500 text-base font-black text-slate-950 shadow-sm">
              +
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-100">MediFind</h1>
          </div>
          <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs text-slate-400">
            Medicine Locator
          </span>
        </header>

        {tab === "patient" ? (
          <>
            <Hero />
            <StatsBar />
          </>
        ) : (
          <PharmacyHeader />
        )}

        <nav className="mb-6 flex gap-2 border-b border-slate-800">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={
                "-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors " +
                (tab === t.id
                  ? "border-teal-400 text-teal-300"
                  : "border-transparent text-slate-400 hover:text-slate-200")
              }
            >
              {t.label}
            </button>
          ))}
        </nav>

        {tab === "patient" ? <PatientPage /> : <PharmacyPage />}

        {tab === "patient" && <HowItWorks />}

        <footer className="mt-12 border-t border-slate-800/80 pt-4 text-center text-xs text-slate-500">
          MediFind is a healthcare search project built with demo data. Stock predictions are
          estimates, not live inventory. Always confirm with the pharmacy and consult a doctor.
        </footer>
      </div>
    </div>
  );
}