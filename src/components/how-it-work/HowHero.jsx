"use client";

import { motion } from "framer-motion";

export default function HowHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-white pt-20 pb-16 px-4 text-center">
      {/* Blobs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-rose-100 rounded-full opacity-30 blur-3xl pointer-events-none animate-blob" />
      <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-pink-100 rounded-full opacity-30 blur-3xl pointer-events-none animate-blob animation-delay-2000" />

      <div className="relative max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-white border border-rose-100 text-rose-500 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
          Simple. Fast. Effective.
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-bold text-slate-800 leading-tight mb-4"
        >
          How{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500">
            hirespark
          </span>{" "}
          works
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto mb-8"
        >
          Whether you're looking for your next role or your next hire — we make
          the process feel effortless.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <a
            href="/explore"
            className="bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.03] active:scale-95 transition-all duration-200"
          >
            Find Jobs
          </a>
          <a
            href="/recruiters"
            className="bg-white border border-rose-200 text-rose-500 hover:bg-rose-50 text-sm font-semibold px-6 py-3 rounded-xl hover:scale-[1.03] active:scale-95 transition-all duration-200"
          >
            Post a Job
          </a>
        </motion.div>
      </div>
    </section>
  );
}