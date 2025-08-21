import { useState } from "react";

export type SearchBarProps = {
  isSearchActive: boolean;
  setIsSearchActive: (active: boolean) => void;
};

export default function SearchBar({ isSearchActive, setIsSearchActive }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    console.log("Searching:", query);
    // You can integrate your Databricks call here
  };

  return (
    <div
      className={`relative w-full transition-all duration-300 ${
        isSearchActive ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className="flex items-center bg-white rounded-lg shadow-md overflow-hidden"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask AA Architect..."
          className="flex-grow px-4 py-3 text-gray-800 focus:outline-none"
        />
        <button
          type="submit"
          className="px-5 py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </form>
    </div>
  );
}