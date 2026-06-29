"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import TopCompaniesSection from "@/components/sections/TopCompaniesSection";
import JobCard from "@/components/ui/JobCard";
import { getAllJobs, searchCompanies, getCandidateProfile, getMyJobs } from "@/lib/api";

export default function ExplorePage() {
  const router = useRouter();
  
  // State
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [popularSearches, setPopularSearches] = useState(["#Figma", "#React", "#Python", "#DataAnalysis"]);
  const [dynamicIndustries, setDynamicIndustries] = useState([]);
  const [dynamicSkills, setDynamicSkills] = useState([]);
  const [personalizedJobs, setPersonalizedJobs] = useState([]);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // 1. Fetch user role and recent searches
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) {
      setUserRole(role);
    }

    const savedSearches = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    if (savedSearches.length > 0) {
      setPopularSearches(savedSearches.slice(0, 5).map(s => `#${s}`));
    }

    const fetchData = async () => {
      try {
        // Fetch all jobs and companies simultaneously
        const [jobsResponse, companiesResponse] = await Promise.all([
          getAllJobs().catch(() => []),
          searchCompanies("").catch(() => [])
        ]);

        const allJobs = Array.isArray(jobsResponse) ? jobsResponse : [];
        const allCompanies = Array.isArray(companiesResponse) ? companiesResponse : [];

        // --- DYNAMIC INDUSTRIES ---
        const industryCounts = {};
        allCompanies.forEach(company => {
          if (company.industry) {
            industryCounts[company.industry] = (industryCounts[company.industry] || 0) + 1;
          }
        });
        
        const sortedIndustries = Object.entries(industryCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3);
          
        const industryStyling = [
          { icon: "💻", color: "bg-[#E3EFFF]", text: "text-[#3B82F6]" },
          { icon: "🎨", color: "bg-[#FBEBE5]", text: "text-[#D67C47]" },
          { icon: "🛠️", color: "bg-[#E5ECE4]", text: "text-[#7A8B6A]" }
        ];

        const mappedIndustries = sortedIndustries.map(([name, count], index) => {
          const style = industryStyling[index % 3];
          return {
            name,
            desc: `Explore ${count} companies in this booming sector.`,
            ...style
          };
        });

        if (mappedIndustries.length === 0) {
          setDynamicIndustries([
             { name: "Tech & Software", desc: "Build the future with code.", icon: "💻", color: "bg-[#E3EFFF]", text: "text-[#3B82F6]" },
             { name: "Creative & Design", desc: "Shape experiences.", icon: "🎨", color: "bg-[#FBEBE5]", text: "text-[#D67C47]" },
             { name: "Skilled Trades", desc: "Hands-on expertise.", icon: "🛠️", color: "bg-[#E5ECE4]", text: "text-[#7A8B6A]" }
          ]);
        } else {
          setDynamicIndustries(mappedIndustries);
        }

        // --- DYNAMIC SKILLS (Market Demand) ---
        const skillCounts = {};
        allJobs.forEach(job => {
          if (job.requiredSkills && Array.isArray(job.requiredSkills)) {
            job.requiredSkills.forEach(skill => {
              if (skill.name) {
                skillCounts[skill.name] = (skillCounts[skill.name] || 0) + 1;
              }
            });
          }
        });

        const sortedSkills = Object.entries(skillCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([name, count], index) => {
             let trend = "Stable";
             let icon = "📈";
             if (index < 2) { trend = "High Demand"; icon = "🚀"; }
             else if (index < 4) { trend = "Trending"; icon = "🔥"; }

             return { name, trend, icon, count };
          });
        
        if (sortedSkills.length > 0) {
           setDynamicSkills(sortedSkills);
        } else {
           setDynamicSkills([
              { name: "React", trend: "High Demand", icon: "🚀" },
              { name: "Figma", trend: "Trending", icon: "🔥" },
              { name: "Python", trend: "Stable", icon: "📈" }
           ]);
        }

        // --- PERSONALIZED SECTION ---
        if (role === "CANDIDATE") {
           try {
             const profile = await getCandidateProfile();
             if (profile && profile.skills && Array.isArray(profile.skills)) {
               const candidateSkills = profile.skills.map(s => s.name.toLowerCase());
               const recommended = allJobs.filter(job => {
                 if (!job.requiredSkills) return false;
                 return job.requiredSkills.some(js => candidateSkills.includes(js.name.toLowerCase()));
               });
               setPersonalizedJobs(recommended.slice(0, 3));
             }
           } catch (e) {
             console.error("Failed to fetch candidate profile", e);
           }
        } else if (role === "RECRUITER") {
           try {
             const myJobs = await getMyJobs();
             const myJobIds = Array.isArray(myJobs) ? myJobs.map(j => j.id) : [];
             const competitorJobs = allJobs.filter(job => !myJobIds.includes(job.id));
             setPersonalizedJobs(competitorJobs.slice(0, 3));
           } catch(e) {
             console.error("Failed to fetch recruiter jobs", e);
           }
        }

      } catch (err) {
        console.error("Error fetching explore data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (keyword.trim()) {
      const savedSearches = JSON.parse(localStorage.getItem("recentSearches") || "[]");
      const updated = [keyword.trim(), ...savedSearches.filter(s => s !== keyword.trim())].slice(0, 5);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      
      router.push(`/jobs?keyword=${encodeURIComponent(keyword)}`);
    }
  };

  const handleTagClick = (tag) => {
    const cleanTag = tag.replace('#', '');
    setKeyword(cleanTag);
    setTimeout(() => {
      router.push(`/jobs?keyword=${encodeURIComponent(cleanTag)}`);
    }, 50);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
          <svg className="w-10 h-10 text-[#7D9976]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-gray-900 pb-0">
      
      {/* ───── HERO SECTION ───── */}
      <div className="pt-24 pb-20 px-6 max-w-4xl mx-auto text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold text-[#111111] mb-6 tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Discover Your <span className="text-transparent bg-clip-text bg-linear-to-r from-[#7D9976] to-[#A7B99A] italic">Path</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto mb-10"
        >
          Explore top industries, trending skills, and the best employers hiring right now.
        </motion.p>
        
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSearch}
          className="relative max-w-2xl mx-auto bg-white rounded-full p-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#EBE8E0] flex items-center"
        >
          <div className="pl-4">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input 
            type="text" 
            placeholder="Search by job title, skill, or company..." 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 bg-transparent px-4 py-2 focus:outline-none text-gray-700"
          />
          <button type="submit" className="bg-[#7D9976] hover:bg-[#6A8564] text-white px-8 py-3 rounded-full font-medium transition-colors">
            Search
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center items-center gap-3 mt-8"
        >
          <span className="text-sm font-medium text-gray-500 mr-2">Your Recent Searches:</span>
          {popularSearches.map((tag) => (
            <button 
              key={tag} 
              onClick={() => handleTagClick(tag)} 
              className="bg-white border border-[#EAE5D9] text-gray-700 hover:bg-[#F0EBDF] px-4 py-1.5 rounded-full text-sm font-medium transition-colors shadow-sm"
            >
              {tag}
            </button>
          ))}
        </motion.div>
      </div>

      {/* ───── PERSONALIZED SECTION ───── */}
      {userRole && personalizedJobs.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 mt-4 mb-20">
          <div className="flex items-center justify-between mb-8 border-b border-[#EAE5D9] pb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              {userRole === "CANDIDATE" ? "Recommended For You" : "Market Competition"}
            </h2>
            <button onClick={() => router.push('/jobs')} className="text-[#7D9976] font-semibold hover:underline text-sm">View all matches</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {personalizedJobs.map(job => (
              <JobCard
                key={job.id}
                title={job.title}
                company={job.company?.name || "Acme Inc"}
                location={job.location}
                type={job.jobType ? job.jobType.replace('_', ' ') : "FULL TIME"}
                salary={job.salaryMax ? `$${job.salaryMin} - $${job.salaryMax}` : null}
                onClick={() => router.push(`/jobs/${job.id}`)}
                outerClassName="bg-white"
              />
            ))}
          </div>
        </div>
      )}

      {/* ───── EXPLORE INDUSTRIES GRID ───── */}
      <div className="max-w-6xl mx-auto px-6 mt-10 mb-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Explore Industries</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dynamicIndustries.map((ind, idx) => (
            <motion.div
              key={ind.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleTagClick(ind.name)}
              className={`relative p-8 rounded-4xl ${ind.color} group cursor-pointer overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-black/5`}
            >
              <div className="absolute -right-10 -bottom-10 opacity-20 group-hover:scale-110 transition-transform duration-500">
                <span className="text-9xl">{ind.icon}</span>
              </div>
              <div className={`w-14 h-14 bg-white/60 rounded-2xl flex items-center justify-center text-3xl mb-16 backdrop-blur-sm border border-white/40 shadow-sm ${ind.text}`}>
                {ind.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 capitalize">{ind.name}</h3>
              <p className="text-gray-700 font-medium relative z-10 max-w-[80%]">{ind.desc}</p>
              
              <div className="mt-8 flex items-center text-gray-900 font-semibold group-hover:translate-x-2 transition-transform">
                Explore roles <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ───── MARKET DEMAND BY SKILL ───── */}
      <div className="max-w-6xl mx-auto px-6 mb-24">
        <div className="bg-white rounded-3xl p-10 md:p-12 border border-[#EAE5D9] shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Market Demand by Skill</h2>
              <p className="text-gray-500">Discover which technical and soft skills are currently trending among top employers based on live job posts.</p>
            </div>
            <button onClick={() => router.push('/jobs')} className="text-[#7D9976] font-semibold hover:underline">View all insights</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dynamicSkills.map((skill, idx) => (
              <motion.div 
                key={skill.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => handleTagClick(skill.name)}
                className="flex items-center justify-between p-4 rounded-2xl border border-[#EAE5D9] hover:border-[#7D9976] bg-[#FCFBF8] hover:bg-white transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{skill.icon}</span>
                  <span className="font-bold text-gray-800 capitalize">{skill.name}</span>
                </div>
                {skill.trend === "High Demand" && (
                  <span className="bg-[#E5ECE4] text-[#7A8B6A] text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 group-hover:scale-105 transition-transform">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    High Demand
                  </span>
                )}
                {skill.trend === "Trending" && (
                  <span className="bg-[#FBEBE5] text-[#D67C47] text-xs font-bold px-2.5 py-1 rounded-full group-hover:scale-105 transition-transform">
                    Trending
                  </span>
                )}
                {skill.trend === "Stable" && (
                  <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2.5 py-1 rounded-full group-hover:scale-105 transition-transform">
                    Stable
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ───── FEATURED EMPLOYERS FROM BACKEND ───── */}
      <div className="bg-[#F6F4EE] pt-1 pb-1">
          <TopCompaniesSection title="Featured Employers" />
      </div>

    </div>
  );
}