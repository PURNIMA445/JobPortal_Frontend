"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#F5F2EB] text-gray-900 border-t border-gray-200">

      {/* ───── FLOATING SVG BACKGROUND WAVES ───── */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.svg
          viewBox="0 0 1440 320"
          className="absolute bottom-0 w-full h-full opacity-30"
          animate={{ x: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        >
          <path
            fill="#C5D3BA"
            d="M0,256L80,240C160,224,320,192,480,192C640,192,800,224,960,218.7C1120,213,1280,171,1360,149.3L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          />
        </motion.svg>

        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-[#7A8B6A]/20 rounded-full blur-2xl"
          animate={{ scale: [1, 1.2, 1], y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
        />

        <motion.div
          className="absolute bottom-10 right-20 w-40 h-40 bg-[#A7B99A]/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 7 }}
        />
      </div>

      {/* ───── CONTENT ───── */}
      <div className="relative container mx-auto px-6 py-14">

        <div className="grid md:grid-cols-3 gap-10">

          {/* BRAND */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h1 className="font-serif text-3xl font-bold">सीपसेतु</h1>

            <motion.div
              className="w-12 h-[2px] bg-[#7A8B6A] mt-2"
              animate={{ width: ["0%", "100%", "60%"] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <p className="text-sm text-gray-600 mt-4 leading-relaxed">
              Careers aren’t found. They’re built step by step, opportunity by opportunity.
            </p>
          </motion.div>

          {/* LINKS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-3"
          >
            <span className="text-xs uppercase tracking-widest text-gray-500">
              Quick Links
            </span>

            {[
              { name: "Home", href: "/" },
              { name: "Explore", href: "/explore" },
              { name: "Jobs", href: "/jobs" },
  
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Link
                  href={item.href}
                  className="text-sm hover:text-[#7A8B6A] transition"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* CONTACT INFO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            <span className="text-xs uppercase tracking-widest text-gray-500">
              Get in Touch
            </span>

            <p className="text-sm text-gray-600">
              Have questions or need support? Our team is here to help you navigate your career journey.
            </p>

            <div className="flex flex-col gap-2 mt-2">
              <a href="mailto:support@seepsetu.com" className="text-sm font-medium text-[#7A8B6A] hover:underline">
                support@seepsetu.com
              </a>
              <span className="text-sm text-gray-500">
                +977-1-2345678
              </span>
            </div>
          </motion.div>

        </div> {/* ✅ FIXED missing closing div */}

        {/* BOTTOM BAR */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mt-12 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-xs text-gray-500">
            © 2026 सीपसेतु. Built with care.
          </p>

          <div className="flex gap-6 text-xs text-gray-500">
            <motion.div whileHover={{ y: -2 }}>
              <Link href="/privacy">Privacy</Link>
            </motion.div>

            <motion.div whileHover={{ y: -2 }}>
              <Link href="/terms">Terms</Link>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </footer>
  );
}