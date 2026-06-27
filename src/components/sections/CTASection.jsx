"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CTASection({ isLoggedIn, type = "all" }) {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserRole(localStorage.getItem("role"));
    }
  }, []);

  const showCandidate = type === "all" || type === "candidate";
  const showRecruiter = type === "all" || type === "recruiter";

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[80%] bg-[#7A8B6A]/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {type === "all" && (
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
              Which path fits you?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Whether you're looking for your next big opportunity or searching for the perfect addition to your team, we have you covered.
            </p>
          </div>
        )}

        <div className={`grid gap-8 ${type === "all" ? 'md:grid-cols-2' : 'max-w-3xl mx-auto'}`}>
          
          {/* CANDIDATE PATH */}
          {showCandidate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-[#FDFBF7] border border-[#E8E1D5] rounded-[2.5rem] p-10 md:p-14 flex flex-col items-start relative overflow-hidden group shadow-sm hover:shadow-xl transition-shadow"
            >
              {/* SVG Illustration */}
              <motion.div 
                className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-8 border border-[#E8E1D5] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500"
              >
                <svg className="w-8 h-8 text-[#7A8B6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </motion.div>

              <div className="relative z-10 w-full flex-1 flex flex-col">
                <div className="inline-block px-3 py-1 bg-[#E8E1D5]/50 rounded-full text-xs font-bold text-[#7A8B6A] tracking-wider uppercase mb-4 self-start">
                  For Candidates
                </div>
                <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4 leading-tight">
                  Get matched with opportunities that actually fit your journey.
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Skip the noise. Build a profile that highlights your true potential and let the right roles come to you.
                </p>
                
                <div className="mt-auto">
                  {isLoggedIn && userRole === "RECRUITER" ? (
                    <button disabled className="px-8 py-4 bg-gray-200 text-gray-500 rounded-xl font-semibold text-lg shadow-sm flex items-center gap-2 opacity-80 cursor-not-allowed">
                      You are logged in as {userRole}
                    </button>
                  ) : (
                    <Link href={isLoggedIn ? "/dashboard/candidate" : "/get-started"}>
                      <button className="px-8 py-4 bg-[#7A8B6A] hover:bg-[#6c7d5c] text-white rounded-xl font-semibold text-lg transition-all shadow-md flex items-center gap-2 group-hover:gap-3">
                        {isLoggedIn ? "Go to Dashboard" : "Create Free Account"}
                        <svg className="w-5 h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </button>
                    </Link>
                  )}
                </div>
              </div>
              
              {/* Decorative blob */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#E8C98E]/10 rounded-full blur-3xl group-hover:bg-[#E8C98E]/20 transition-colors duration-500 pointer-events-none"></div>
            </motion.div>
          )}

          {/* RECRUITER PATH */}
          {showRecruiter && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: type === "all" ? 0.2 : 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-[#7A8B6A] border border-[#6c7d5c] rounded-[2.5rem] p-10 md:p-14 flex flex-col items-start relative overflow-hidden group shadow-md hover:shadow-2xl transition-shadow"
            >
              {/* SVG Illustration */}
              <motion.div 
                className="w-16 h-16 rounded-2xl bg-[#6c7d5c] flex items-center justify-center mb-8 border border-[#8A9B7A]/30 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500"
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </motion.div>

              <div className="relative z-10 w-full flex-1 flex flex-col">
                <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold text-white tracking-wider uppercase mb-4 self-start border border-white/10">
                  For Recruiters
                </div>
                <h2 className="text-3xl font-serif font-bold text-white mb-4 leading-tight">
                  Looking to hire exceptional talent without the noise?
                </h2>
                <p className="text-[#E8E1D5] mb-8 leading-relaxed">
                  Connect with highly qualified professionals actively seeking their next role. Post jobs and manage applications seamlessly.
                </p>
                
                <div className="mt-auto">
                  {isLoggedIn && userRole === "CANDIDATE" ? (
                    <button disabled className="px-8 py-4 bg-white/20 text-white rounded-xl font-semibold text-lg shadow-sm flex items-center gap-2 opacity-80 cursor-not-allowed">
                      You are logged in as {userRole}
                    </button>
                  ) : (
                    <Link href={isLoggedIn ? "/dashboard/recruiter" : "/get-started"}>
                      <button className="px-8 py-4 bg-white hover:bg-[#F5F2EB] text-[#7A8B6A] rounded-xl font-semibold text-lg transition-all shadow-md flex items-center gap-2 group-hover:gap-3">
                        {isLoggedIn ? "Go to Dashboard" : "Post a Job Now"}
                        <svg className="w-5 h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </button>
                    </Link>
                  )}
                </div>
              </div>
              
              {/* Decorative blob */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors duration-500 pointer-events-none"></div>
            </motion.div>
          )}

        </div>
      </div>
    </section>
  );
}
