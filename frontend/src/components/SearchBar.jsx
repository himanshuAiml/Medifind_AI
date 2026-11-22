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
        className="flex-1 rounded-lg border border-slate-700 bg-slate-900/95 px-4 py-3 text-base text-slate-100 placeholder-slate-500 outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-teal-600 px-6 py-3 font-medium text-white transition hover:bg-teal-500 disabled:opacity-50"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}