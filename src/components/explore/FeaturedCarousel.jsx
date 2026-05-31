"use client";

import { useRef } from "react";

function JobCard({ job, index }) {
  return (
    <div
      className="shrink-0 w-72 bg-white rounded-2xl border border-rose-100 p-5 hover:shadow-xl hover:shadow-rose-100 hover:-translate-y-2 hover:border-rose-200 transition-all duration-300 cursor-pointer group animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-110 transition-transform duration-300"
          style={{ backgroundColor: job.color }}
        >
          {job.logo}
        </div>
        <span className="text-xs font-medium text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full">
          {job.type}
        </span>
      </div>

      <h3 className="text-sm font-semibold text-slate-800 mb-1 group-hover:text-rose-500 transition-colors duration-200">
        {job.title}
      </h3>
      <p className="text-xs text-slate-500 mb-3">{job.company} · {job.location}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {job.skills.slice(0, 2).map((s) => (
          <span key={s} className="text-xs text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
            {s}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">{job.salary}</span>
        <span className="text-xs text-slate-400">{job.postedAt}</span>
      </div>
    </div>
  );
}

export default function FeaturedCarousel({ jobs }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 300, behavior: "smooth" });
    }
  };

  if (!jobs?.length) return null;

  return (
    <section className="px-4 py-12 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="animate-fade-in-left">
          <h2 className="text-xl font-bold text-slate-800">🔥 Featured Jobs</h2>
          <p className="text-sm text-slate-500 mt-0.5">Hand-picked trending opportunities</p>
        </div>
        <div className="flex gap-2 animate-fade-in-right">
          <button
            onClick={() => scroll(-1)}
            className="w-9 h-9 rounded-full border border-rose-100 bg-white hover:bg-rose-50 hover:border-rose-300 hover:scale-110 active:scale-95 flex items-center justify-center transition-all duration-150"
          >
            <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-9 h-9 rounded-full border border-rose-100 bg-white hover:bg-rose-50 hover:border-rose-300 hover:scale-110 active:scale-95 flex items-center justify-center transition-all duration-150"
          >
            <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {jobs.map((job, i) => (
          <JobCard key={job.id} job={job} index={i} />
        ))}
      </div>
    </section>
  );
}