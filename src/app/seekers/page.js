"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import TopCompaniesSection from "@/components/sections/TopCompaniesSection";
import CTASection from "@/components/sections/CTASection";

export default function SeekersLanding() {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      handleUpload(selected);
    } else {
      setError("Please upload a valid PDF document.");
    }
  };

  const handleUpload = async (selectedFile) => {
    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("/api/upload-resume", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to analyze resume");
      }

      const data = await res.json();
      
      // Artificial delay to build anticipation
      setTimeout(() => {
        setAnalysisResult(data);
        setIsAnalyzing(false);
      }, 2000);

    } catch (err) {
      setError("Our AI is currently taking a breather. Please try again in a moment.");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#1C1F1A] selection:bg-[#7A8B6A] selection:text-white pb-20">
      
      {/* ───── HERO SECTION ───── */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[#FDFBF7]">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#E8E1D5]/20 rounded-bl-[120px]"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-5 py-2 rounded-full bg-white border border-[#E8E1D5] text-[#7A8B6A] font-medium text-xs tracking-wider uppercase mb-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
          >
            For Ambitious Professionals
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-medium text-[#1C1F1A] leading-[1.1] mb-6 tracking-tight"
          >
            Don't just apply. <br />
            <span className="text-[#7A8B6A] italic">Get matched.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-[#6B7264] mb-12 leading-relaxed max-w-2xl mx-auto"
          >
            Upload your CV below to instantly discover your AI Profile Score, identify critical keyword gaps, and see exactly how top employers evaluate your experience.
          </motion.p>
        </div>
      </section>

      {/* ───── THE HOOK: CV SCANNER ───── */}
      <section className="py-10 px-6 -mt-12 relative z-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E8E1D5] overflow-hidden min-h-[440px]">
            
            <AnimatePresence mode="wait">
              {/* STATE 1: UPLOAD */}
              {!isAnalyzing && !analysisResult && (
                <motion.div 
                  key="upload"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="p-12 text-center flex flex-col items-center justify-center min-h-[440px]"
                >
                  <div className="w-24 h-24 bg-[#F9F8F4] rounded-full flex items-center justify-center mb-8 border border-[#E8E1D5] shadow-inner">
                    <svg className="w-10 h-10 text-[#7A8B6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
                  </div>
                  <h3 className="text-3xl font-serif font-medium text-[#1C1F1A] mb-4">Analyze your resume</h3>
                  <p className="text-[#6B7264] mb-10 max-w-md text-lg">
                    Discover exactly what recruiters see. Our AI engine extracts your core competencies and aligns them with active market demand.
                  </p>
                  
                  <input 
                    type="file" 
                    accept=".pdf" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-8 py-4 bg-[#7A8B6A] hover:bg-[#687A5D] text-white font-medium rounded-xl transition-all shadow-md flex items-center gap-3 text-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    Upload Resume (PDF)
                  </button>
                  <p className="text-sm text-[#A3AEA0] mt-6">We respect your privacy. Files are analyzed securely and never shared.</p>
                  {error && <p className="text-[#D67373] text-sm mt-4 font-medium">{error}</p>}
                </motion.div>
              )}

              {/* STATE 2: ANALYZING */}
              {isAnalyzing && (
                <motion.div 
                  key="analyzing"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="p-12 text-center flex flex-col items-center justify-center min-h-[440px] bg-[#FDFBF7]"
                >
                  <div className="relative mb-8">
                     <motion.div 
                       animate={{ rotate: 360 }}
                       transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                       className="w-24 h-24"
                     >
                       <div className="absolute inset-0 border-4 border-[#E8E1D5] rounded-full"></div>
                       <div className="absolute inset-0 border-4 border-[#7A8B6A] rounded-full border-t-transparent border-l-transparent"></div>
                     </motion.div>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-8 h-8 text-[#7A8B6A] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                     </div>
                  </div>
                  <h3 className="text-3xl font-serif font-medium text-[#1C1F1A] mb-3">Processing data matrix...</h3>
                  <p className="text-[#6B7264] text-lg animate-pulse">Extracting technical stack, parsing domain expertise, and cross-referencing active roles.</p>
                </motion.div>
              )}

              {/* STATE 3: RESULTS & FREEMIUM WALL */}
              {!isAnalyzing && analysisResult && (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="relative min-h-[440px] bg-[#FDFBF7] overflow-hidden"
                >
                  {/* The Teaser Content */}
                  <div className="p-8 md:p-12">
                    <div className="flex items-center justify-between mb-10">
                      <div>
                        <h3 className="text-3xl font-serif font-medium text-[#1C1F1A] mb-2">Analysis Complete</h3>
                        <p className="text-[#6B7264]">Here is a high-level overview of your professional profile.</p>
                      </div>
                      <div className="w-20 h-20 rounded-full border-[6px] border-[#7A8B6A] flex flex-col items-center justify-center bg-white shadow-sm">
                        <span className="text-2xl font-bold text-[#7A8B6A] leading-none">84</span>
                        <span className="text-[9px] font-bold text-[#A3AEA0] uppercase tracking-wider">Score</span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-10">
                      <div className="bg-white p-6 rounded-2xl border border-[#E8E1D5] shadow-sm">
                         <p className="text-xs font-bold text-[#A3AEA0] uppercase tracking-wider mb-2">Detected Domain</p>
                         <p className="text-xl font-medium text-[#1C1F1A] capitalize">{analysisResult.domain || "General Professional"}</p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border border-[#E8E1D5] shadow-sm">
                         <p className="text-xs font-bold text-[#A3AEA0] uppercase tracking-wider mb-2">Experience Level</p>
                         <p className="text-xl font-medium text-[#1C1F1A]">{analysisResult.yearsExperience || "0"} Years Estimated</p>
                      </div>
                    </div>

                    <div className="mb-8">
                      <p className="text-sm font-bold text-[#1C1F1A] mb-4 uppercase tracking-wide">Top Extracted Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.skills?.slice(0, 5).map(skill => (
                          <span key={skill} className="px-4 py-2 bg-[#F0F2EB] text-[#5C7356] text-sm rounded-xl font-medium border border-[#E2E6DD]">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Fake Blurred Section for Freemium Wall */}
                    <div className="relative mt-12 filter blur-[8px] opacity-30 select-none">
                      <p className="text-sm font-bold text-[#1C1F1A] mb-4 uppercase tracking-wide">Critical Keyword Gaps & Active Matches</p>
                      <div className="bg-white h-28 rounded-2xl border border-[#E8E1D5] mb-4"></div>
                      <div className="bg-white h-28 rounded-2xl border border-[#E8E1D5]"></div>
                    </div>
                  </div>

                  {/* The Premium Lock Wall */}
                  <div className="absolute inset-0 bottom-0 top-1/2 bg-gradient-to-t from-white via-white/95 to-transparent flex flex-col items-center justify-end pb-12 px-6">
                    <div className="bg-white p-8 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-[#E8E1D5] text-center max-w-lg w-full transform translate-y-4">
                      <div className="w-16 h-16 bg-[#FDFBF7] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#E8E1D5]">
                        <svg className="w-7 h-7 text-[#C8A96E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      </div>
                      <h4 className="text-2xl font-serif font-medium text-[#1C1F1A] mb-3">Unlock 14 Matched Jobs</h4>
                      <p className="text-[#6B7264] text-base mb-8 leading-relaxed">Create a free account to view your full AI analysis, identify critical resume gaps, and see which premium companies are actively searching for your exact skill set.</p>
                      <Link href="/get-started">
                        <button className="w-full py-4 bg-[#7A8B6A] hover:bg-[#687A5D] text-white font-medium text-lg rounded-xl transition-all shadow-md">
                          Create Free Account
                        </button>
                      </Link>
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </section>

      {/* ───── THE DIRECTORY: TOP COMPANIES ───── */}
      <TopCompaniesSection />

      {/* ───── CTA SECTION ───── */}
      <CTASection type="candidate" />

    </div>
  );
}