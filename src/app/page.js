"use client";

import { useState, useEffect } from "react";
import { getAllJobs } from "@/lib/api";

import HeroSection from "@/components/sections/HeroSection";
import LatestOpportunitiesSection from "@/components/sections/LatestOpportunitiesSection";
import FeatureSection from "@/components/sections/FeatureSection";
import TopCompaniesSection from "@/components/sections/TopCompaniesSection";
import CTASection from "@/components/sections/CTASection";

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check for auth token to dynamically render CTA
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }

    // Fetch jobs for dynamic count and latest opportunities section
    getAllJobs()
      .then(data => {
        if (Array.isArray(data)) {
          setJobs(data.reverse()); // Reverse to show latest first (assuming ID order)
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-hidden selection:bg-[#7A8B6A] selection:text-white">
      {/* ───── HERO & LATEST SECTION ───── */}
      <div className="relative">
        <HeroSection jobsCount={jobs.length} isLoggedIn={isLoggedIn} />
        

        {/* ───── FEATURES SECTION ───── */}
      <FeatureSection />

        {/* We wrap the LatestOpportunities in a container that pulls it up a bit since they originally shared the same section padding */}
        <div className="relative -mt-16 pb-20 md:pb-32 px-6 z-10">
           <LatestOpportunitiesSection jobs={jobs} />
        </div>
      </div>

      {/* ───── TOP COMPANIES SECTION ───── */}
      <TopCompaniesSection />

      {/* ───── DUAL-PATH CTA SECTION ───── */}
      <CTASection isLoggedIn={isLoggedIn} />
    </div>
  );
}