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
        className="flex-1 rounded-lg border border-[#cfd2cb] bg-white px-4 py-3 text-base text-[#1f221e] placeholder-[#8f938a] outline-none transition focus:border-[#42543d] focus:ring-2 focus:ring-[#eef2ec]"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-[#3d4f39] px-6 py-3 font-medium text-white transition shadow-xs hover:bg-[#303f2c] disabled:opacity-50"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}