"use client";

import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Frontend Developer",
    company: "Hired at Stripe",
    avatar: "PS",
    color: "#635BFF",
    quote:
      "I applied to 3 jobs on a Monday. By Wednesday I had two interview requests. hirespark is insanely fast.",
    stars: 5,
  },
  {
    name: "Marcus Lee",
    role: "Talent Lead",
    company: "Vercel",
    avatar: "ML",
    color: "#000000",
    quote:
      "We cut our time-to-hire from 6 weeks to 9 days. The candidate quality is genuinely better than any other platform.",
    stars: 5,
  },
  {
    name: "Aisha Okafor",
    role: "Product Designer",
    company: "Hired at Notion",
    avatar: "AO",
    color: "#191919",
    quote:
      "The one-click apply is a game changer. No more filling the same form 20 times. Just applied and got hired.",
    stars: 5,
  },
  {
    name: "David Park",
    role: "Engineering Manager",
    company: "Linear",
    avatar: "DP",
    color: "#5E6AD2",
    quote:
      "hirespark sent us 5 candidates. We hired 2 of them. That kind of hit rate is unheard of in recruiting.",
    stars: 5,
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export default function Testimonials() {
  return (
    <section className="px-4 py-16 bg-slate-50/60">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            💬 People love hirespark
          </h2>
          <p className="text-sm text-slate-500">
            Real stories from real people who found their match.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {TESTIMONIALS.map((t) => (
            <motion.div
              key={t.name}
              variants={cardVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="bg-white border border-rose-100 rounded-2xl p-5 flex flex-col gap-4 cursor-default"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <span key={i} className="text-amber-400 text-sm">★</span>
                ))}
              </div>

              <p className="text-sm text-slate-600 leading-relaxed flex-1">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm"
                  style={{ backgroundColor: t.color }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role} · {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}