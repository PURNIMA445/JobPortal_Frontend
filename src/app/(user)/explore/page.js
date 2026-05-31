"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import HeroSearch from "@/components/explore/HeroSearch";
import JobListings from "@/components/explore/JobListings";
import CategoryGrid from "@/components/explore/CategoryGrid";
import TrendingSkills from "@/components/explore/TrendingSkills";
import CompaniesHiring from "@/components/explore/CompaniesHiring";

// Dynamic import for heavy carousel
const FeaturedCarousel = dynamic(
  () => import("@/components/explore/FeaturedCarousel"),
  { ssr: false, loading: () => <div className="h-48" /> }
);

export default function ExplorePage() {
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ query: "", location: "", category: "", type: "" });

  // Fetch jobs from API
  const fetchJobs = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v))
      ).toString();
      const res = await fetch(`/api/jobs${qs ? `?${qs}` : ""}`);
      const data = await res.json();
      setAllJobs(data.jobs);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Featured jobs (memoized slice)
  const featuredJobs = useMemo(() => allJobs.filter((j) => j.featured), [allJobs]);

  const handleSearch = useCallback(
    ({ query, location, category }) => {
      const next = { ...filters, query, location, category };
      setFilters(next);
      fetchJobs(next);
    },
    [filters, fetchJobs]
  );

  const handleTypeChange = useCallback(
    (type) => {
      const next = { ...filters, type };
      setFilters(next);
      fetchJobs(next);
    },
    [filters, fetchJobs]
  );

  const handleSkillClick = useCallback(
    (skill) => {
      const next = { ...filters, query: skill };
      setFilters(next);
      fetchJobs(next);
    },
    [filters, fetchJobs]
  );

  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero Search */}
      <HeroSearch onSearch={handleSearch} />

      {/* 2. Featured Carousel */}
      <FeaturedCarousel jobs={featuredJobs} />

      {/* 3. Category Grid */}
      <CategoryGrid />

      {/* 4. Trending Skills */}
      <TrendingSkills onSkillClick={handleSkillClick} />

      {/* 5. Companies Hiring */}
      <CompaniesHiring />

      {/* 6. Job Listings */}
      <JobListings
        jobs={allJobs}
        activeType={filters.type}
        onTypeChange={handleTypeChange}
        loading={loading}
      />

      {/* Footer spacer */}
      <div className="h-16" />
    </main>
  );
}