"use client";

import { useRouter } from "next/navigation";
import { BsSearch } from "react-icons/bs";

export default function SearchBar() {
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchQuery = e.target.search.value.trim();
    if (searchQuery) {
      router.push(`/apps/search?q=${encodeURIComponent(searchQuery)}`); // Updated path
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto">
      <input
        type="search"
        name="search"
        placeholder="Search apps..."
        className="w-full px-6 py-4 rounded-full bg-zinc-900/50 border border-zinc-800 focus:border-blue-500 focus:outline-none text-white pr-12"
      />
      <button
        type="submit"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
      >
        <BsSearch size={18} />
      </button>
    </form>
  );
}
