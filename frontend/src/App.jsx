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
  backgroundColor: "#e4e1d9",
  minHeight: "100vh",
};

function PharmacyHeader() {
  return (
    <section className="mb-6 text-center">
      <h2 className="text-3xl font-bold tracking-tight text-[#1c1f1a]">
        Stock smarter, <span className="text-[#3a4d35]">waste less</span>
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-[#4e5348]">
        See the expected demand for any medicine over the next 4 weeks and get a suggested
        order quantity, so you stock what your customers will actually need.
      </p>
    </section>
  );
}

export default function App() {
  const [tab, setTab] = useState("patient");

  return (
    <div style={BACKGROUND} className="text-[#1c1f1a]">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <header className="mb-8 flex items-center justify-between border-b border-[#cfccc2] pb-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3a4d35] text-base font-bold text-[#f7f6f2] shadow-xs">
              +
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#1c1f1a]">MediFind</h1>
              <p className="text-[11px] font-medium uppercase tracking-wider text-[#63685e]">
                Medicine Availability Portal
              </p>
            </div>
          </div>
          <span className="rounded-full border border-[#b8c7b3] bg-[#d7e2d2] px-3 py-1 text-xs font-semibold text-[#283823]">
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

        <nav className="mb-6 flex gap-2 border-b border-[#cfccc2]">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={
                "-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors " +
                (tab === t.id
                  ? "border-[#3a4d35] text-[#283823] font-semibold"
                  : "border-transparent text-[#63685e] hover:text-[#1c1f1a]")
              }
            >
              {t.label}
            </button>
          ))}
        </nav>

        {tab === "patient" ? <PatientPage /> : <PharmacyPage />}

        {tab === "patient" && <HowItWorks />}

        <footer className="mt-14 border-t border-[#cfccc2] pt-5 text-center text-xs leading-relaxed text-[#70756a]">
          MediFind is a healthcare search platform built with demo data. Stock predictions are
          estimates, not live inventory. Always confirm with the pharmacy and consult a medical professional.
        </footer>
      </div>
    </div>
  );
}