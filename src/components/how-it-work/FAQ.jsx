"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    q: "Is hirespark free for job seekers?",
    a: "Yes, completely free. Create a profile, browse jobs, and apply — no hidden fees, ever.",
  },
  {
    q: "How does the matching algorithm work?",
    a: "We analyze your skills, experience level, location preference, and salary expectations, then rank open roles by fit score. The more complete your profile, the sharper your matches.",
  },
  {
    q: "How long does it take to hear back after applying?",
    a: "Most candidates hear back within 1–3 business days. We notify you in real time the moment a recruiter views or responds to your application.",
  },
  {
    q: "Can I apply to multiple jobs at once?",
    a: "Absolutely. Your profile acts as a universal application. Apply to as many roles as you like — each application is tracked separately in your dashboard.",
  },
  {
    q: "How do recruiters post jobs?",
    a: "Sign up as a recruiter, create your company page, and click 'Post a Job'. You can write the description yourself or use our AI draft tool. Jobs go live instantly.",
  },
  {
    q: "What makes hirespark different from LinkedIn or Indeed?",
    a: "We focus on quality over volume. No spam applications. No irrelevant job blasts. Just precise matching between people and roles that genuinely fit — for both sides.",
  },
];

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="border border-rose-100 rounded-2xl overflow-hidden bg-white"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left group"
      >
        <span className="text-sm font-semibold text-slate-700 group-hover:text-rose-500 transition-colors duration-200">
          {faq.q}
        </span>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="w-6 h-6 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0 ml-3"
        >
          <svg className="w-3 h-3 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-sm text-slate-500 leading-relaxed px-5 pb-5">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section className="px-4 py-16 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          🙋 Frequently asked questions
        </h2>
        <p className="text-sm text-slate-500">Everything you need to know.</p>
      </motion.div>

      <div className="flex flex-col gap-3">
        {FAQS.map((faq, i) => (
          <FAQItem key={faq.q} faq={faq} index={i} />
        ))}
      </div>
    </section>
  );
}