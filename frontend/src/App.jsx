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
  backgroundColor: "#f0fdfa",
  backgroundImage:
    "radial-gradient(circle at 12% 8%, rgba(20,184,166,0.20), transparent 40%)," +
    "radial-gradient(circle at 88% 18%, rgba(56,189,248,0.20), transparent 40%)," +
    "radial-gradient(circle at 50% 95%, rgba(167,243,208,0.40), transparent 45%)",
  backgroundAttachment: "fixed",
};

function PharmacyHeader() {
  return (
    <section className="mb-6 text-center">
      <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
        Stock smarter, <span className="text-teal-600">waste less</span>
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-slate-600">
        See the expected demand for any medicine over the next 4 weeks and get a suggested
        order quantity, so you stock what your customers will actually need.
      </p>
    </section>
  );
}

export default function App() {
  const [tab, setTab] = useState("patient");

  return (
    <div className="min-h-screen" style={BACKGROUND}>
      <div className="mx-auto max-w-3xl px-4 py-6">
        <header className="mb-6 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-lg font-bold text-white">
            +
          </span>
          <h1 className="text-2xl font-bold text-teal-800">MediFind AI</h1>
        </header>

        {tab === "patient" ? (
          <>
            <Hero />
            <StatsBar />
          </>
        ) : (
          <PharmacyHeader />
        )}

        <nav className="mb-6 flex gap-2 border-b border-teal-100">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={
                "-mb-px border-b-2 px-4 py-2 text-sm font-medium " +
                (tab === t.id
                  ? "border-teal-600 text-teal-700"
                  : "border-transparent text-gray-500 hover:text-gray-700")
              }
            >
              {t.label}
            </button>
          ))}
        </nav>

        {tab === "patient" ? <PatientPage /> : <PharmacyPage />}

        {tab === "patient" && <HowItWorks />}

        <footer className="mt-12 border-t border-teal-100 pt-4 text-center text-xs text-slate-500">
          MediFind AI is a portfolio project built with demo data. Stock predictions are
          estimates, not live inventory. Always confirm with the pharmacy and consult a doctor.
        </footer>
      </div>
    </div>
  );
}