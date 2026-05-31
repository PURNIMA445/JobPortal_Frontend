"use client";

const TYPE_FILTERS = ["All", "Full-time", "Part-time", "Contract"];

function JobCard({ job, index }) {
  return (
    <div
      className="bg-white border border-rose-100 rounded-2xl p-5 hover:shadow-xl hover:shadow-rose-100 hover:-translate-y-1 hover:border-rose-200 transition-all duration-300 cursor-pointer group animate-fade-in-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"
          style={{ backgroundColor: job.color }}
        >
          {job.logo}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-800 group-hover:text-rose-500 transition-colors duration-200 truncate">
            {job.title}
          </h3>
          <p className="text-xs text-slate-500">{job.company} · {job.location}</p>
        </div>
        <span className="text-xs font-medium text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full shrink-0">
          {job.type}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {job.skills.map((s) => (
          <span key={s} className="text-xs text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md hover:border-rose-200 hover:text-rose-500 hover:bg-rose-50 transition-all duration-150 cursor-pointer">
            {s}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">{job.salary}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">{job.postedAt}</span>
          <button className="text-xs font-semibold text-white bg-linear-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md hover:shadow-rose-200">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default function JobListings({ jobs, activeType, onTypeChange, loading }) {
  return (
    <section className="px-4 py-12 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-fade-in-up">
        <div>
          <h2 className="text-xl font-bold text-slate-800">All Jobs</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {jobs.length} {jobs.length === 1 ? "result" : "results"} found
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {TYPE_FILTERS.map((t) => (
            <button
              key={t}
              onClick={() => onTypeChange(t === "All" ? "" : t)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-150 hover:scale-105 active:scale-95 ${
                (t === "All" && !activeType) || t === activeType
                  ? "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-200"
                  : "bg-white text-slate-600 border-slate-200 hover:border-rose-200 hover:text-rose-500"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-rose-100 rounded-2xl p-5 animate-pulse">
              <div className="flex gap-3 mb-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl" />
                <div className="flex-1">
                  <div className="h-3.5 bg-slate-100 rounded mb-2 w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
              <div className="flex gap-1.5 mb-4">
                <div className="h-5 w-16 bg-slate-100 rounded-md" />
                <div className="h-5 w-12 bg-slate-100 rounded-md" />
              </div>
              <div className="h-3 bg-slate-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 animate-fade-in-up">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-slate-600 font-medium">No jobs found</p>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job, i) => (
            <JobCard key={job.id} job={job} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}