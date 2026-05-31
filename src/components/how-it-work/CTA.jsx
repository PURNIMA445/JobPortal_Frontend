"use client";

import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative max-w-4xl mx-auto bg-gradient-to-br from-rose-400 to-pink-600 rounded-3xl px-8 py-14 text-center overflow-hidden shadow-2xl shadow-rose-200"
      >
        {/* Background decoration */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-white/80 text-sm font-medium mb-3 uppercase tracking-widest"
        >
          Ready to get started?
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold text-white mb-4"
        >
          Your next chapter starts here.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.28, duration: 0.5 }}
          className="text-white/75 text-sm sm:text-base max-w-md mx-auto mb-8"
        >
          Join 48,000+ professionals and 12,000+ companies already using hirespark.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.36, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <motion.a
            href="/get-started"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="bg-white text-rose-500 font-semibold text-sm px-7 py-3 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200"
          >
            Sign up free →
          </motion.a>
          <motion.a
            href="/explore"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold text-sm px-7 py-3 rounded-xl transition-colors duration-200"
          >
            Browse jobs
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}