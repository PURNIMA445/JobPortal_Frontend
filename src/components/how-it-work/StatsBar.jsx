"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const STATS = [
  { value: 48000, suffix: "+", label: "Jobs posted", icon: "💼" },
  { value: 12000, suffix: "+", label: "Companies hiring", icon: "🏢" },
  { value: 98, suffix: "%", label: "Satisfaction rate", icon: "⭐" },
  { value: 3, suffix: "days", label: "Avg. time to hire", icon: "⚡" },
];

function CountUp({ target, suffix, active }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [active, target]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="px-4 py-14 bg-gradient-to-br from-rose-500 to-pink-600">
      <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center text-white">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex flex-col items-center gap-1"
          >
            <span className="text-2xl mb-1">{stat.icon}</span>
            <p className="text-3xl sm:text-4xl font-black tracking-tight">
              <CountUp target={stat.value} suffix={stat.suffix} active={inView} />
            </p>
            <p className="text-sm text-rose-100 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}