"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { searchCompanies } from "@/lib/api";

// Removed BrassTack for distinct shape

export default function TopCompaniesSection({ 
  title = "Top Companies Hiring Right Now",
  subtitle = "Create a profile to apply directly to active openings at these industry-leading organizations." 
}) {
  const router = useRouter();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    searchCompanies("")
      .then((data) => {
        if (Array.isArray(data)) {
          // Just take the first 8 companies for the showcase
          setCompanies(data.slice(0, 8));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (companies.length === 0) return null;

  return (
    <section className="w-full">
      {/* ───── BEIGE HEADER SECTION ───── */}
      <div className="pt-16 pb-8 bg-[#FDFBF7]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#1C1F1A] mb-3">
            {title}
          </h2>
          <p className="text-[#6B7264] text-base md:text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>
      </div>

      {/* ───── GREEN CARDS SECTION ───── */}
      <div className="py-10 md:py-16 bg-[#7A8B6A] relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E8C98E]/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {companies.map((company, i) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                onClick={() => router.push(`/jobs?keyword=${encodeURIComponent(company.name)}`)}
                className="bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 relative overflow-hidden flex flex-col h-full"
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#7D9976] to-[#A7B99A] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#FDFBF7] flex items-center justify-center shadow-sm border border-[#EAE5D9] overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    {company.logoUrl ? (
                      <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-gray-400">
                        {company.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#7D9976] group-hover:text-white transition-colors">
                    <svg className="w-5 h-5 -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                  </div>
                </div>

                <div className="mt-auto">
                  <h3 className="font-bold text-xl text-gray-900 group-hover:text-[#7D9976] transition-colors mb-1 line-clamp-1">
                    {company.name}
                  </h3>
                  {company.industry ? (
                    <p className="text-sm text-gray-500 line-clamp-1 font-medium">{company.industry}</p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Industry not specified</p>
                  )}
                  
                  <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2">
                    <span className="bg-[#F5F2EB] text-[#6A7B5C] text-xs font-bold px-3 py-1 rounded-full">
                      Actively Hiring
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
