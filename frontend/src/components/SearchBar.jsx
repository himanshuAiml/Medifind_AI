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
        placeholder="Search a medicine, e.g. paracetmol"
        className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-lg outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-200"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-teal-700 px-6 py-3 font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}