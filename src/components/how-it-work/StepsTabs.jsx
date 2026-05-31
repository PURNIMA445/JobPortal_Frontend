"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SEEKER_STEPS = [
  {
    number: "01",
    icon: "🔍",
    title: "Create your profile",
    description:
      "Sign up in under 2 minutes. Add your skills, experience, and what you're looking for. The more detail, the better matches you'll get.",
    color: "from-rose-400 to-pink-500",
    bg: "from-rose-50 to-pink-50",
    border: "border-rose-100",
    tag: "Takes 2 mins",
  },
  {
    number: "02",
    icon: "⚡",
    title: "Get matched instantly",
    description:
      "Our smart matching engine scans thousands of live roles and surfaces the ones that actually fit — by skill, location, salary, and culture.",
    color: "from-violet-400 to-purple-500",
    bg: "from-violet-50 to-purple-50",
    border: "border-violet-100",
    tag: "AI-powered",
  },
  {
    number: "03",
    icon: "📩",
    title: "Apply with one click",
    description:
      "Your profile is your application. No cover letters. No re-entering your resume. Just hit Apply and we handle the rest.",
    color: "from-sky-400 to-blue-500",
    bg: "from-sky-50 to-blue-50",
    border: "border-sky-100",
    tag: "No friction",
  },
  {
    number: "04",
    icon: "🎉",
    title: "Land the interview",
    description:
      "Track your applications in real time. Hear back faster. Get interview tips tailored to each company you applied to.",
    color: "from-emerald-400 to-green-500",
    bg: "from-emerald-50 to-green-50",
    border: "border-emerald-100",
    tag: "Real-time updates",
  },
];

const RECRUITER_STEPS = [
  {
    number: "01",
    icon: "🏢",
    title: "Set up your company page",
    description:
      "Create a branded company profile that attracts the right candidates. Showcase culture, benefits, and your mission.",
    color: "from-orange-400 to-amber-500",
    bg: "from-orange-50 to-amber-50",
    border: "border-orange-100",
    tag: "5 mins setup",
  },
  {
    number: "02",
    icon: "📝",
    title: "Post your job",
    description:
      "Write your job description or let our AI draft one for you. Set salary, location, required skills, and publish instantly.",
    color: "from-rose-400 to-pink-500",
    bg: "from-rose-50 to-pink-50",
    border: "border-rose-100",
    tag: "AI draft assist",
  },
  {
    number: "03",
    icon: "🎯",
    title: "We surface the right talent",
    description:
      "Stop sifting through irrelevant applications. We rank candidates by fit score and surface the best ones automatically.",
    color: "from-violet-400 to-purple-500",
    bg: "from-violet-50 to-purple-50",
    border: "border-violet-100",
    tag: "Smart ranking",
  },
  {
    number: "04",
    icon: "🤝",
    title: "Hire with confidence",
    description:
      "Message candidates directly, schedule interviews in-platform, and make offers — all from one clean dashboard.",
    color: "from-emerald-400 to-green-500",
    bg: "from-emerald-50 to-green-50",
    border: "border-emerald-100",
    tag: "All-in-one",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function StepCard({ step, index }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative bg-gradient-to-br ${step.bg} border ${step.border} rounded-2xl p-6 cursor-default group overflow-hidden`}
    >
      {/* Big number watermark */}
      <span className="absolute -right-2 -top-4 text-7xl font-black text-black/5 select-none pointer-events-none">
        {step.number}
      </span>

      <div className="flex items-start justify-between mb-4">
        <motion.span
          whileHover={{ rotate: [0, -10, 10, -6, 0], scale: 1.2 }}
          transition={{ duration: 0.4 }}
          className="text-3xl"
        >
          {step.icon}
        </motion.span>
        <span className={`text-xs font-semibold text-white bg-gradient-to-r ${step.color} px-2.5 py-1 rounded-full shadow-sm`}>
          {step.tag}
        </span>
      </div>

      <h3 className="text-base font-bold text-slate-800 mb-2">{step.title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>

      {/* Connector arrow (hidden on last card) */}
      {index < 3 && (
        <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
          <div className="w-8 h-8 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function StepsTabs() {
  const [active, setActive] = useState("seekers");
  const steps = active === "seekers" ? SEEKER_STEPS : RECRUITER_STEPS;

  return (
    <section className="px-4 py-16 max-w-7xl mx-auto">
      {/* Tab switcher */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex justify-center mb-12"
      >
        <div className="inline-flex bg-slate-100 rounded-2xl p-1.5 gap-1">
          {["seekers", "recruiters"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`relative px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 capitalize ${
                active === tab ? "text-white" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {active === tab && (
                <motion.div
                  layoutId="tab-pill"
                  className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-500 rounded-xl shadow-md"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                {tab === "seekers" ? "👤 Job Seekers" : "🏢 Recruiters"}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Steps grid with AnimatePresence for tab switch */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 relative"
        >
          {steps.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}