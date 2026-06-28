"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const bgColors = ["bg-[#E5ECE4]", "bg-[#FBEBE5]", "bg-[#FDF4D4]"];
const logoBgColors = ["bg-[#E3EFFF] text-[#3B82F6]", "bg-[#111111] text-white", "bg-[#FFC107] text-white"];

export default function LatestOpportunitiesSection({ jobs = [] }) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="mt-24 max-w-6xl mx-auto relative z-10"
    >
      <div className="flex items-center justify-between mb-8 px-2 md:px-0">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Latest Opportunities</h2>
        <Link href="/jobs" className="text-[#7D9976] font-semibold text-sm hover:underline">View all</Link>
      </div>

      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2 md:px-0">
          {jobs.slice(0, 3).map((job, idx) => (
            <motion.div
              key={job.id}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => router.push(`/jobs/${job.id}`)}
              className="relative p-8 bg-white border border-[#E8E1D5] rounded-tl-[2.5rem] rounded-br-[2.5rem] rounded-tr-xl rounded-bl-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col group overflow-hidden"
            >
              {/* Subtle top accent bar */}
              <div className={`absolute top-0 left-0 w-full h-2 ${bgColors[idx % 3]}`}></div>

              <div className="flex justify-between items-start mb-6 mt-2">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl overflow-hidden shadow-sm group-hover:scale-110 transition-transform duration-300 ${logoBgColors[idx % 3]}`}>
                  {job.company?.logoUrl ? (
                    <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-cover" />
                  ) : (
                    job.company?.name ? job.company.name.charAt(0) : "W"
                  )}
                </div>
                <button className="text-gray-400 hover:text-[#7A8B6A] transition-colors p-2 bg-gray-50 rounded-full group-hover:bg-[#F5F2EB]">
                  <BookmarkIcon className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-[#7A8B6A] transition-colors">
                {job.title}
              </h3>
              <p className="text-gray-600 text-sm mb-5 font-medium">
                {job.company?.name || "Acme Inc."}
              </p>

              <div className="flex items-center gap-2 text-gray-500 text-sm mb-6 font-medium">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F5F2EB] text-[#7A8B6A]">
                  <MapPinIcon className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">{job.location}</span>
              </div>

              <div className="mt-auto flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                <span className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide">
                  {job.jobType ? job.jobType.replace('_', '-').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) : "Full-time"}
                </span>
                <span className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide">
                  {idx % 2 === 0 ? "Remote" : (idx % 3 === 0 ? "Hybrid" : "On-site")}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500 bg-white/50 backdrop-blur-md rounded-[2rem] border border-[#E8E1D5] shadow-sm">
          <p className="font-medium">Discovering latest roles...</p>
        </div>
      )}
    </motion.div>
  );
}

// SVGs for Job Cards
function MapPinIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>; }
function BookmarkIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>; }
