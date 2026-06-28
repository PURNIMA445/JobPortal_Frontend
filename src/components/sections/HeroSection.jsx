"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection({ jobsCount = 0, isLoggedIn = false }) {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserRole(localStorage.getItem("role"));
    }
  }, []);
  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-32 px-6">
      {/* Background Decorative Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-[#F5F2EB] rounded-full blur-3xl opacity-70"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          className="absolute top-40 -left-20 w-72 h-72 bg-[#E8C98E]/20 rounded-full blur-3xl opacity-60"
        />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-[#7A8B6A]/5 rounded-[100%] blur-3xl"
        />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5F2EB] border border-[#E8E1D5] text-sm text-[#7A8B6A] font-medium mb-8 shadow-sm"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7A8B6A] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#7A8B6A]"></span>
          </span>
          {jobsCount > 0 ? `Over ${jobsCount} new opportunities this week` : "Discover new opportunities this week"}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-gray-900 leading-[1.1] mb-6"
        >
          Where your next <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7A8B6A] to-[#A7B99A]">
            great opportunity
          </span> awaits.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          We bridge the gap between exceptional talent and forward-thinking companies. Join our community to find work that feels like you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href={isLoggedIn ? (userRole === "RECRUITER" ? "/dashboard/recruiter" : "/dashboard/candidate") : "/get-started"}>
            <button className="w-full sm:w-auto px-8 py-4 bg-[#7A8B6A] hover:bg-[#6c7d5c] text-white rounded-xl font-medium text-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2">
              {isLoggedIn ? "Go to Dashboard" : "Get Started"}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
          </Link>
          <Link href="/jobs">
            <button className="w-full sm:w-auto px-8 py-4 bg-white border border-[#E8E1D5] hover:bg-[#F5F2EB] text-gray-800 rounded-xl font-medium text-lg transition-all shadow-sm flex items-center justify-center gap-2">
              Explore Jobs
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
