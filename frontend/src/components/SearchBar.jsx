import { useState } from "react";

export default function SearchBar({ onSearch, loading }) {
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (text.trim()) onSearch(text.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Search a medicine, e.g. paracetamol or dolo"
        className="flex-1 rounded-lg border border-[var(--border-focus)] bg-[var(--bg-input)] px-4 py-3 text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition focus:border-[var(--olive-primary)] focus:ring-2 focus:ring-[var(--olive-badge-bg)]"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-[var(--olive-primary)] px-6 py-3 font-medium text-[#f7f6f2] transition shadow-xs hover:bg-[var(--olive-hover)] disabled:opacity-50 cursor-pointer"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}