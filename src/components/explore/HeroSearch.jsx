"use client";

import { useState, useCallback } from "react";

const LOCATIONS = ["All Locations", "Remote", "On-site"];
const CATEGORIES = ["All Categories", "IT", "Design", "Marketing", "Finance"];

export default function HeroSearch({ onSearch }) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSearch({ query, location, category });
    },
    [query, location, category, onSearch]
  );

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-rose-50 via-pink-50 to-white pt-16 pb-20 px-4">
      {/* Animated background blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-100 rounded-full opacity-40 blur-3xl pointer-events-none animate-blob" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-pink-100 rounded-full opacity-40 blur-3xl pointer-events-none animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-64 h-64 bg-pink-50 rounded-full opacity-30 blur-3xl pointer-events-none animate-blob animation-delay-4000" />

      <div className="relative max-w-4xl mx-auto text-center">

        {/* Badge — fade + slide down */}
        <div className="inline-flex items-center gap-2 bg-white border border-rose-100 text-rose-500 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 shadow-sm animate-fade-in-down">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
          1,200+ jobs added this week
        </div>

        {/* Heading — fade + slide up, slight delay */}
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 leading-tight mb-3 animate-fade-in-up animation-delay-200">
          Find your next{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-400 to-pink-500">
            dream job
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-500 text-base sm:text-lg mb-10 max-w-xl mx-auto animate-fade-in-up animation-delay-400">
          Search thousands of jobs from top companies — remote, hybrid, or in-person.
        </p>

        {/* Search form — fade in last */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl shadow-rose-100 border border-rose-100 p-2 flex flex-col sm:flex-row gap-2 max-w-3xl mx-auto animate-fade-in-up animation-delay-600"
        >
          <div className="flex items-center gap-2 flex-1 bg-slate-50 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-rose-200 transition-all duration-200">
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Job title or company..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
            />
          </div>

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value === "All Locations" ? "" : e.target.value)}
            className="bg-slate-50 text-sm text-slate-600 rounded-xl px-4 py-3 outline-none border-0 cursor-pointer"
          >
            {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value === "All Categories" ? "" : e.target.value)}
            className="bg-slate-50 text-sm text-slate-600 rounded-xl px-4 py-3 outline-none border-0 cursor-pointer"
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>

          <button
            type="submit"
            className="bg-linear-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.03] active:scale-95 shrink-0"
          >
            Search Jobs
          </button>
        </form>

        {/* Popular tags */}
        <div className="mt-5 flex flex-wrap justify-center gap-2 animate-fade-in-up animation-delay-700">
          <span className="text-xs text-slate-400">Popular:</span>
          {["Remote", "React", "Design", "Marketing", "Finance"].map((tag) => (
            <button
              key={tag}
              onClick={() => { setQuery(tag); onSearch({ query: tag, location, category }); }}
              className="text-xs text-slate-500 hover:text-rose-500 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 px-3 py-1 rounded-full transition-all duration-150 hover:scale-105 active:scale-95"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}