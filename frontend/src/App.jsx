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
  backgroundColor: "#f8f8f5",
  minHeight: "100vh",
};

function PharmacyHeader() {
  return (
    <section className="mb-6 text-center">
      <h2 className="text-3xl font-bold tracking-tight text-[#1f221e]">
        Stock smarter, <span className="text-[#42543d]">waste less</span>
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-[#5c6057]">
        See the expected demand for any medicine over the next 4 weeks and get a suggested
        order quantity, so you stock what your customers will actually need.
      </p>
    </section>
  );
}

export default function App() {
  const [tab, setTab] = useState("patient");

  return (
    <div style={BACKGROUND} className="text-[#1f221e]">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <header className="mb-8 flex items-center justify-between border-b border-[#e4e4dd] pb-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#42543d] text-base font-bold text-white shadow-xs">
              +
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#1f221e]">MediFind</h1>
              <p className="text-[11px] font-medium uppercase tracking-wider text-[#73776e]">
                Medicine Availability Portal
              </p>
            </div>
          </div>
          <span className="rounded-full border border-[#d5ded2] bg-[#edf2ea] px-3 py-1 text-xs font-medium text-[#384934]">
            Live Catalog
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

        <nav className="mb-6 flex gap-2 border-b border-[#e4e4dd]">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={
                "-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors " +
                (tab === t.id
                  ? "border-[#42543d] text-[#384934]"
                  : "border-transparent text-[#73776e] hover:text-[#1f221e]")
              }
            >
              {t.label}
            </button>
          ))}
        </nav>

        {tab === "patient" ? <PatientPage /> : <PharmacyPage />}

        {tab === "patient" && <HowItWorks />}

        <footer className="mt-14 border-t border-[#e4e4dd] pt-5 text-center text-xs leading-relaxed text-[#7e8278]">
          MediFind is a healthcare search platform built with demo data. Stock predictions are
          estimates, not live inventory. Always confirm with the pharmacy and consult a medical professional.
        </footer>
      </div>
    </div>
  );
}