"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const initialMockCandidates = [
  {
    id: 1,
    name: "Sarah Williams",
    avatar: "SW",
    role: "Senior React Engineer",
    exp: 8,
    techMatch: 98,
    notes: "Exceptional system design skills. Matches all required tech stack including React, TypeScript, and GraphQL.",
    color: "bg-[#7A8B6A]"
  },
  {
    id: 2,
    name: "James Chen",
    avatar: "JC",
    role: "Full Stack Developer",
    exp: 4,
    techMatch: 95,
    notes: "Strong technical match but slightly lower years of experience. High potential for growth.",
    color: "bg-[#C8A96E]"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    avatar: "ER",
    role: "Frontend Engineer",
    exp: 10,
    techMatch: 75,
    notes: "Great overall experience but missing some modern framework requirements like Next.js.",
    color: "bg-[#D67373]"
  },
  {
    id: 4,
    name: "Michael Taylor",
    avatar: "MT",
    role: "Junior Web Developer",
    exp: 2,
    techMatch: 60,
    notes: "Junior candidate. Strong fundamentals but lacks required enterprise architecture experience.",
    color: "bg-gray-400"
  }
];

export default function RecruitersLanding() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Interactive Simulator State
  const [isScanning, setIsScanning] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Senior Software Engineer");
  const [prioritizeExp, setPrioritizeExp] = useState(false);
  const [prioritizeTech, setPrioritizeTech] = useState(true);
  const [mockCandidates, setMockCandidates] = useState(initialMockCandidates);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    let role = null;
    let token = null;

    if (typeof window !== "undefined") {
      role = localStorage.getItem("role");
      token = localStorage.getItem("token");
      setUserRole(role);
    }
    
    if (role === "RECRUITER" && token) {
      fetch("http://localhost:8080/api/candidate/search", {
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.text();
      })
      .then(text => {
        if (!text) return [];
        return JSON.parse(text);
      })
      .then(data => {
        if(Array.isArray(data)) {
          setCandidates(data);
        }
      })
      .catch(err => console.error("Failed to fetch candidates:", err))
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleCalibration = () => {
    setIsScanning(true);
    
    setTimeout(() => {
      // Simulate an AI sorting operation
      const sorted = [...mockCandidates].sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;
        
        if (prioritizeExp) {
          scoreA += a.exp * 10;
          scoreB += b.exp * 10;
        }
        if (prioritizeTech) {
          scoreA += a.techMatch;
          scoreB += b.techMatch;
        }
        // If neither are prioritized, just shuffle randomly for effect
        if (!prioritizeExp && !prioritizeTech) {
          return Math.random() - 0.5;
        }
        
        return scoreB - scoreA;
      });
      
      setMockCandidates(sorted);
      setIsScanning(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#1C1F1A] selection:bg-[#7A8B6A] selection:text-white pb-20">
      
      {/* ───── HERO SECTION ───── */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-6 bg-[#FDFBF7] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#7A8B6A]/10 rounded-bl-[120px] blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-[#C8A96E]/10 rounded-tr-[120px] blur-[100px]"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-5 py-2 rounded-full bg-white border border-[#E8E1D5] text-[#7A8B6A] font-medium text-xs tracking-wider uppercase mb-8 shadow-sm"
          >
            For Enterprise Hiring Teams
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-medium text-[#1C1F1A] leading-[1.1] tracking-tight mb-6"
          >
            Hire 10x faster with <br className="hidden md:block" />
            <span className="text-[#7A8B6A] italic">AI-powered screening.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-[#6B7264] max-w-2xl mx-auto mb-10 leading-relaxed font-light"
          >
            Stop reading hundreds of unqualified resumes. Our intelligent ATS instantly ranks candidates based on skill gaps, exact experience matches, and deep domain expertise.
          </motion.p>
        </div>
      </section>

      {/* ───── THE HOOK: SMART SCREENING TEASER ───── */}
      <section className="py-20 px-6 bg-white relative z-20 border-t border-[#E8E1D5]">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#1C1F1A] mb-4">Experience the AI Advantage</h2>
            <p className="text-[#6B7264] max-w-2xl mx-auto text-lg">
              Adjust your hiring priorities below and watch our AI instantly parse, rank, and calibrate the talent pool.
            </p>
          </div>

          <div className="bg-[#FDFBF7] rounded-[2rem] shadow-sm border border-[#E8E1D5] overflow-hidden flex flex-col lg:flex-row">
            
            {/* LEFT PANEL: CONTROL PANEL */}
            <div className="w-full lg:w-[380px] bg-white border-r border-[#E8E1D5] p-8 flex flex-col relative z-10">
              <h3 className="text-[11px] font-bold text-[#A3AEA0] uppercase tracking-widest mb-6">Calibration Controls</h3>
              
              <div className="space-y-6 flex-1">
                {/* Role Select */}
                <div>
                  <label className="block text-sm font-medium text-[#1C1F1A] mb-2">Target Role</label>
                  <select 
                    className="w-full bg-[#FDFBF7] border border-[#E8E1D5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A8B6A]/50 appearance-none"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    <option value="Senior Software Engineer">Senior Software Engineer</option>
                    <option value="UX Designer">UX Designer</option>
                    <option value="Product Manager">Product Manager</option>
                  </select>
                </div>

                {/* Toggles */}
                <div className="pt-2">
                  <label className="block text-sm font-medium text-[#1C1F1A] mb-4">Screening Priorities</label>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-[#6B7264]">Prioritize Years of Exp.</span>
                    <button 
                      onClick={() => setPrioritizeExp(!prioritizeExp)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${prioritizeExp ? 'bg-[#7A8B6A]' : 'bg-gray-200'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${prioritizeExp ? 'left-7' : 'left-1'}`}></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6B7264]">Prioritize Tech Stack</span>
                    <button 
                      onClick={() => setPrioritizeTech(!prioritizeTech)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${prioritizeTech ? 'bg-[#7A8B6A]' : 'bg-gray-200'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${prioritizeTech ? 'left-7' : 'left-1'}`}></span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-[#E8E1D5]">
                <button 
                  onClick={handleCalibration}
                  disabled={isScanning}
                  className="w-full py-4 bg-[#7A8B6A] hover:bg-[#687A5D] text-white rounded-xl font-medium text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-80"
                >
                  {isScanning ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                        <svg className="w-4 h-4 text-[#C8A96E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      </motion.div>
                      Calibrating AI...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 text-[#C8A96E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      Test AI Calibration
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* RIGHT PANEL: APPLICANT POOL */}
            <div className="flex-1 p-8 md:p-10 relative">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-serif font-medium text-[#1C1F1A]">Applicant Pool</h3>
                <span className="text-xs font-bold text-[#A3AEA0] bg-white border border-[#E8E1D5] px-3 py-1.5 rounded-full shadow-sm">
                  Top 4 Matches
                </span>
              </div>

              <div className="relative min-h-[400px]">
                {/* Scanning Overlay */}
                <AnimatePresence>
                  {isScanning && (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-0 z-20 bg-[#FDFBF7]/80 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center border border-[#E8E1D5]/50"
                    >
                      <div className="w-12 h-12 border-4 border-[#E8E1D5] border-t-[#7A8B6A] rounded-full animate-spin mb-4"></div>
                      <p className="text-[#1C1F1A] font-serif font-medium">Re-ranking candidates...</p>
                      <p className="text-xs text-[#6B7264] mt-1">Applying new priority weights.</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-3 relative z-10">
                  <AnimatePresence>
                    {mockCandidates.map((candidate, index) => (
                      <motion.div 
                        key={candidate.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="bg-white rounded-2xl border border-[#E8E1D5] p-5 shadow-sm hover:shadow-md transition-shadow group flex flex-col sm:flex-row sm:items-center gap-4 relative"
                      >
                        {/* Rank Badge */}
                        <div className="absolute -left-3 -top-3 w-7 h-7 bg-[#1C1F1A] text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm z-10">
                          {index + 1}
                        </div>

                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-serif font-medium text-lg shrink-0 shadow-inner ${candidate.color}`}>
                          {candidate.avatar}
                        </div>

                        <div className="flex-1">
                          <h4 className="font-medium text-[#1C1F1A] text-base leading-tight mb-1">{candidate.name}</h4>
                          <p className="text-xs text-[#6B7264]">{candidate.role}</p>
                        </div>

                        <div className="flex gap-2">
                          <div className="px-3 py-1.5 bg-[#FDFBF7] border border-[#E8E1D5] rounded-lg flex flex-col items-center justify-center w-20">
                            <span className="text-sm font-bold text-[#1C1F1A] leading-none">{candidate.exp}</span>
                            <span className="text-[9px] text-[#A3AEA0] uppercase font-bold tracking-wider mt-1">Years</span>
                          </div>
                          <div className="px-3 py-1.5 bg-[#F0F2EB] border border-[#E2E6DD] rounded-lg flex flex-col items-center justify-center w-20">
                            <span className="text-sm font-bold text-[#5C7356] leading-none">{candidate.techMatch}%</span>
                            <span className="text-[9px] text-[#5C7356]/70 uppercase font-bold tracking-wider mt-1">Match</span>
                          </div>
                        </div>

                        {/* Tooltip Hover Area */}
                        <div className="relative group/tooltip shrink-0 self-start sm:self-center">
                          <div className="cursor-help px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium text-gray-500 hover:text-[#7A8B6A] hover:border-[#7A8B6A]/30 transition-colors flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Why this rank?
                          </div>
                          
                          {/* The Tooltip */}
                          <div className="absolute right-0 bottom-full mb-2 w-64 bg-[#1C1F1A] text-white p-4 rounded-xl shadow-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50 origin-bottom-right translate-y-2 group-hover/tooltip:translate-y-0 duration-200">
                            <div className="text-[10px] uppercase tracking-widest text-[#A3AEA0] font-bold mb-1.5">AI Reasoning</div>
                            <p className="text-xs leading-relaxed text-gray-200">{candidate.notes}</p>
                            {/* Little triangle pointer */}
                            <div className="absolute top-full right-6 w-3 h-3 bg-[#1C1F1A] transform rotate-45 -mt-1.5"></div>
                          </div>
                        </div>

                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ───── THE DIRECTORY: VETTED TALENT ───── */}
      <section className="pt-24 pb-24 bg-[#FDFBF7]">
        <div className="max-w-6xl mx-auto px-6">
          
          {userRole === "RECRUITER" ? (
            <>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#1C1F1A] mb-4">Discover Top Talent</h2>
                <p className="text-[#6B7264] text-lg max-w-2xl mx-auto">These elite professionals are currently active on our platform and open to new opportunities.</p>
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="w-10 h-10 border-4 border-[#E8E1D5] border-t-[#7A8B6A] rounded-full animate-spin"></div>
                </div>
              ) : candidates.length === 0 ? (
                 <div className="text-center py-16 text-[#6B7264] bg-white border border-[#E8E1D5] rounded-3xl shadow-sm max-w-2xl mx-auto">
                   <div className="w-16 h-16 bg-[#F9F8F4] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E8E1D5]">
                     <svg className="w-8 h-8 text-[#A3AEA0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                   </div>
                   <p className="font-medium text-[#1C1F1A]">No public profiles available right now.</p>
                   <p className="text-sm mt-1">Candidates are joining daily. Check back soon.</p>
                 </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {candidates.slice(0, 6).map((candidate) => (
                    <div key={candidate.id} className="bg-white p-8 rounded-3xl border border-[#E8E1D5] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden flex flex-col h-full">
                      
                      <div className="flex items-center gap-5 mb-5">
                        <div className="w-16 h-16 bg-[#7A8B6A] text-white rounded-full flex items-center justify-center font-serif text-2xl shadow-sm shrink-0">
                          {candidate.fullName ? candidate.fullName.charAt(0) : "C"}
                        </div>
                        <div>
                          <h3 className="font-serif font-medium text-xl text-[#1C1F1A] group-hover:text-[#7A8B6A] transition-colors">{candidate.fullName}</h3>
                          <p className="text-sm text-[#6B7264] flex items-center gap-1.5 mt-1">
                            <svg className="w-4 h-4 text-[#A3AEA0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {candidate.location || "Remote"}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-[#1C1F1A] mb-6 line-clamp-3 leading-relaxed flex-grow">
                        {candidate.bio || "Experienced professional seeking new opportunities in a dynamic environment."}
                      </p>

                      <div className="mb-8 pt-4 border-t border-[#F9F8F4]">
                        <p className="text-[10px] font-bold text-[#A3AEA0] mb-3 uppercase tracking-widest">Verified Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {candidate.skills?.slice(0, 3).map(skill => (
                            <span key={skill.id} className="px-3 py-1.5 bg-[#F9F8F4] text-[#6B7264] text-xs font-medium rounded-lg border border-[#E8E1D5]">
                              {skill.name}
                            </span>
                          ))}
                          {candidate.skills?.length > 3 && (
                            <span className="px-3 py-1.5 bg-white text-[#A3AEA0] text-xs font-medium rounded-lg border border-[#E8E1D5] border-dashed">
                              +{candidate.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      <Link href={`/dashboard/recruiter/candidate/${candidate.id}`} className="mt-auto">
                        <button className="w-full py-3.5 bg-white border border-[#E8E1D5] group-hover:bg-[#FDFBF7] group-hover:border-[#7A8B6A] group-hover:text-[#7A8B6A] text-[#1C1F1A] font-medium rounded-xl transition-all shadow-sm">
                          View Full Resume
                        </button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#1C1F1A] mb-4">Vetted Talent</h2>
                <p className="text-[#6B7264] text-lg max-w-2xl mx-auto">To protect candidate privacy, full profiles are hidden until you create a verified employer account. Here is a preview of our active talent.</p>
              </div>

              <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Teaser Card 1 */}
                  <div className="bg-white p-8 rounded-3xl border border-[#E8E1D5] shadow-sm relative overflow-hidden flex flex-col h-full">
                    <div className="flex items-center gap-5 mb-6 select-none opacity-60">
                      <div className="w-16 h-16 bg-gray-200 rounded-full shrink-0 filter blur-sm"></div>
                      <div className="flex-1 filter blur-sm">
                        <div className="h-5 w-32 bg-gray-300 rounded mb-2"></div>
                        <div className="h-3 w-24 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <h3 className="font-serif font-medium text-xl text-[#1C1F1A] mb-2">Software Engineer</h3>
                    <p className="text-sm text-[#6B7264] mb-6 flex gap-3 font-medium">
                      <span>📍 San Francisco, CA</span>
                      <span>💼 5 Yrs Exp</span>
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-3 py-1.5 bg-[#F9F8F4] text-[#6B7264] text-xs font-medium rounded-lg border border-[#E8E1D5]">React</span>
                      <span className="px-3 py-1.5 bg-[#F9F8F4] text-[#6B7264] text-xs font-medium rounded-lg border border-[#E8E1D5]">Node.js</span>
                      <span className="px-3 py-1.5 bg-[#F9F8F4] text-[#6B7264] text-xs font-medium rounded-lg border border-[#E8E1D5]">TypeScript</span>
                    </div>
                  </div>

                  {/* Teaser Card 2 */}
                  <div className="bg-white p-8 rounded-3xl border border-[#E8E1D5] shadow-sm relative overflow-hidden flex flex-col h-full hidden md:flex">
                    <div className="flex items-center gap-5 mb-6 select-none opacity-60">
                      <div className="w-16 h-16 bg-gray-200 rounded-full shrink-0 filter blur-sm"></div>
                      <div className="flex-1 filter blur-sm">
                        <div className="h-5 w-36 bg-gray-300 rounded mb-2"></div>
                        <div className="h-3 w-20 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <h3 className="font-serif font-medium text-xl text-[#1C1F1A] mb-2">Product Manager</h3>
                    <p className="text-sm text-[#6B7264] mb-6 flex gap-3 font-medium">
                      <span>📍 New York, NY</span>
                      <span>💼 8 Yrs Exp</span>
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-3 py-1.5 bg-[#F9F8F4] text-[#6B7264] text-xs font-medium rounded-lg border border-[#E8E1D5]">Agile</span>
                      <span className="px-3 py-1.5 bg-[#F9F8F4] text-[#6B7264] text-xs font-medium rounded-lg border border-[#E8E1D5]">Jira</span>
                      <span className="px-3 py-1.5 bg-[#F9F8F4] text-[#6B7264] text-xs font-medium rounded-lg border border-[#E8E1D5]">Strategy</span>
                    </div>
                  </div>

                  {/* Teaser Card 3 */}
                  <div className="bg-white p-8 rounded-3xl border border-[#E8E1D5] shadow-sm relative overflow-hidden flex flex-col h-full hidden lg:flex">
                    <div className="flex items-center gap-5 mb-6 select-none opacity-60">
                      <div className="w-16 h-16 bg-gray-200 rounded-full shrink-0 filter blur-sm"></div>
                      <div className="flex-1 filter blur-sm">
                        <div className="h-5 w-28 bg-gray-300 rounded mb-2"></div>
                        <div className="h-3 w-28 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <h3 className="font-serif font-medium text-xl text-[#1C1F1A] mb-2">Data Scientist</h3>
                    <p className="text-sm text-[#6B7264] mb-6 flex gap-3 font-medium">
                      <span>📍 Remote</span>
                      <span>💼 4 Yrs Exp</span>
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-3 py-1.5 bg-[#F9F8F4] text-[#6B7264] text-xs font-medium rounded-lg border border-[#E8E1D5]">Python</span>
                      <span className="px-3 py-1.5 bg-[#F9F8F4] text-[#6B7264] text-xs font-medium rounded-lg border border-[#E8E1D5]">TensorFlow</span>
                      <span className="px-3 py-1.5 bg-[#F9F8F4] text-[#6B7264] text-xs font-medium rounded-lg border border-[#E8E1D5]">SQL</span>
                    </div>
                  </div>
                </div>

                {/* Glassmorphism Lock Overlay */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/30 backdrop-blur-[4px] rounded-[2rem]">
                  <div className="bg-white p-8 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-[#E8E1D5] text-center max-w-sm transform transition-transform hover:scale-105 duration-300">
                    <div className="w-16 h-16 bg-[#FDFBF7] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#E8E1D5] shadow-inner">
                      <svg className="w-7 h-7 text-[#7A8B6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <h4 className="text-xl font-serif font-medium text-[#1C1F1A] mb-3">Profiles are locked</h4>
                    <p className="text-sm text-[#6B7264] mb-8 leading-relaxed">Create a free employer account to reveal candidate identities, view full resumes, and reach out directly.</p>
                    <Link href="/get-started">
                      <button className="w-full py-3.5 bg-[#7A8B6A] hover:bg-[#687A5D] text-white font-medium rounded-xl transition-all shadow-md">
                        Create Recuiter Account to Reveal
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </section>

    </div>
  );
}