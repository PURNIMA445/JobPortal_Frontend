"use client";

import { motion } from "framer-motion";

function BrassTack() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20 drop-shadow-md">
      <circle cx="12" cy="10" r="5" fill="#D1C3AD" stroke="#B8A88E" strokeWidth="1" />
      <circle cx="10" cy="8" r="2" fill="#FFF" fillOpacity="0.6" />
      <path d="M12 15 L11.5 22 L12.5 22 Z" fill="#8C7C61" />
    </svg>
  );
}

export default function FeatureSection() {
  return (
    <section className="py-24 bg-[#F9F8F4] border-t border-[#E8E1D5]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Why choose सीपसेतु?</h2>
          <p className="text-gray-600 text-lg">We've reimagined the job search process to be intuitive, transparent, and focused on finding the right cultural fit.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 pt-4">
          {[
            { title: "Curated Opportunities", desc: "Access high-quality roles at vetted companies. We filter the noise so you can focus on what matters.", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /> },
            { title: "Direct Connection", desc: "Bypass the endless waiting. Connect directly with hiring managers and specialized recruiters.", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /> },
            { title: "Smart Matching", desc: "Our algorithm highlights roles that align with your unique skills, experience, and career goals.", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /> }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="relative p-2.5 rounded-[2rem] bg-[#E5ECE4] shadow-sm transition-transform duration-300 group"
            >
              <BrassTack />
              <div className="bg-white rounded-3xl p-8 h-full border border-white/50 shadow-sm relative flex flex-col">
                <div className="w-12 h-12 bg-[#F5F2EB] rounded-xl flex items-center justify-center text-[#7A8B6A] mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">{feature.icon}</svg>
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
