"use client";

import { useEffect, useState } from "react";

export default function Work() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔗 CHANGE THIS to your Spring Boot URL
  const API_URL = "http://localhost:8080/api/jobs";

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const res = await fetch(API_URL);

        if (!res.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await res.json();
        setJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink font-serif p-6">
      {/* 📰 HEADER */}
      <div className="border-b-2 border-ink pb-4 mb-6 text-center">
        <h1 className="text-4xl font-bold tracking-widest">
          THE JOB CLASSIFIEDS
        </h1>
        <p className="text-xs font-type mt-1">
          Live Employment Listings • Powered by Registry API
        </p>
      </div>

      {/* ⚠️ STATES */}
      {loading && (
        <p className="text-center font-type text-sm">
          Loading today’s job listings...
        </p>
      )}

      {error && (
        <p className="text-center text-red-600 text-sm">
          Error: {error}
        </p>
      )}

      {!loading && !error && jobs.length === 0 && (
        <p className="text-center text-sm font-type">
          No job postings found in today’s edition.
        </p>
      )}

      {/* 🧾 JOB LIST */}
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {/* 📌 LEFT SIDEBAR */}
        <div className="border-2 border-ink bg-white p-4 h-fit">
          <h2 className="font-bold mb-3">Filing Cabinet</h2>

          <div className="space-y-2 text-sm font-type">
            <label className="flex gap-2 items-center">
              <input type="checkbox" /> Full Time
            </label>
            <label className="flex gap-2 items-center">
              <input type="checkbox" /> Contract
            </label>
            <label className="flex gap-2 items-center">
              <input type="checkbox" /> Remote
            </label>
          </div>

          <p className="text-xs mt-4 text-gray-600 font-type">
            Filters will be connected to API later.
          </p>
        </div>

        {/* 🗞️ MAIN BOARD */}
        <div className="md:col-span-2 space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border-2 border-ink bg-white p-4 shadow-[4px_4px_0px_#2B2B2B] hover:translate-y-0.5 transition"
            >
              {/* TITLE */}
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">{job.title}</h3>

                <span className="text-xs border border-ink px-2 py-1 bg-paper">
                  {job.type || "LISTED"}
                </span>
              </div>

              {/* COMPANY */}
              <p className="text-sm mt-1 font-type">
                {job.company}
              </p>

              {/* EXTRA INFO */}
              <div className="mt-2 text-sm font-type">
                💰 {job.salary || "Not disclosed"}
              </div>

              {/* DESCRIPTION (optional backend field) */}
              {job.description && (
                <p className="text-xs mt-2 text-gray-700 font-type line-clamp-2">
                  {job.description}
                </p>
              )}

              {/* BUTTON */}
              <button className="mt-3 bg-accent text-paper px-3 py-1 border-2 border-ink text-sm font-bold shadow-[2px_2px_0px_#2B2B2B]">
                VIEW POSTING
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}