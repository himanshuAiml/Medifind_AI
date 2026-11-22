import { useState, useEffect } from "react";
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
  backgroundColor: "var(--bg-page)",
  minHeight: "100vh",
};

function PharmacyHeader() {
  return (
    <section className="mb-6 text-center">
      <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
        Stock smarter, <span className="text-[var(--olive-primary)]">waste less</span>
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
        See the expected demand for any medicine over the next 4 weeks and get a suggested
        order quantity, so you stock what your customers will actually need.
      </p>
    </section>
  );
}

export default function App() {
  const [tab, setTab] = useState("patient");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [darkMode]);

  return (
    <div style={BACKGROUND} className="text-[var(--text-primary)] transition-colors duration-200">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <header className="mb-8 flex items-center justify-between border-b border-[var(--border-color)] pb-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--olive-primary)] text-base font-bold text-[#f7f6f2] shadow-xs">
              +
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">MediFind</h1>
              <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
                Medicine Availability Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setDarkMode((d) => !d)}
              className="flex items-center gap-1.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)] transition hover:border-[var(--border-focus)] hover:text-[var(--text-primary)] shadow-xs cursor-pointer"
              aria-label="Toggle dark mode"
              title={darkMode ? "Switch to soothing light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <>
                  <svg className="h-3.5 w-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                  <span>Light</span>
                </>
              ) : (
                <>
                  <svg className="h-3.5 w-3.5 text-[#5e6358]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                  <span>Dark</span>
                </>
              )}
            </button>
            <span className="hidden sm:inline-block rounded-full border border-[var(--olive-badge-border)] bg-[var(--olive-badge-bg)] px-3 py-1 text-xs font-semibold text-[var(--olive-badge-text)]">
              Live Catalog
            </span>
          </div>
        </header>

        {tab === "patient" ? (
          <>
            <Hero />
            <StatsBar />
          </>
        ) : (
          <PharmacyHeader />
        )}

        <nav className="mb-6 flex gap-2 border-b border-[var(--border-color)]">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={
                "-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors " +
                (tab === t.id
                  ? "border-[var(--olive-primary)] text-[var(--text-primary)] font-semibold"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]")
              }
            >
              {t.label}
            </button>
          ))}
        </nav>

        {tab === "patient" ? <PatientPage /> : <PharmacyPage />}

        {tab === "patient" && <HowItWorks />}

        <footer className="mt-14 border-t border-[var(--border-color)] pt-5 text-center text-xs leading-relaxed text-[var(--text-muted)]">
          MediFind is a healthcare search platform built with demo data. Stock predictions are
          estimates, not live inventory. Always confirm with the pharmacy and consult a medical professional.
        </footer>
      </div>
    </div>
  );
}