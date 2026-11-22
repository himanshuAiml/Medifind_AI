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
        className="flex-1 rounded-lg border border-[#c4c1b5] bg-[#f0ede6] px-4 py-3 text-base text-[#1c1f1a] placeholder-[#7d8276] outline-none transition focus:border-[#3a4d35] focus:ring-2 focus:ring-[#d8e0d4]"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-[#3a4d35] px-6 py-3 font-medium text-[#f7f6f2] transition shadow-xs hover:bg-[#2b3a27] disabled:opacity-50"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}