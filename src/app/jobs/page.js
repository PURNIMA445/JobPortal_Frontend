"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getAllJobs, searchJobs } from "@/lib/api";

const bgColors = ["bg-[#E5ECE4]", "bg-[#FBEBE5]", "bg-[#FDF4D4]"];
const logoBgColors = ["bg-[#E3EFFF] text-[#3B82F6]", "bg-[#111111] text-white", "bg-[#FFC107] text-white"];

function JobsPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Initialize state from URL params
    const initialKeyword = searchParams.get("keyword") || searchParams.get("title") || "";
    const initialLocation = searchParams.get("location") || "";
    
    const [keyword, setKeyword] = useState(initialKeyword);
    const [location, setLocation] = useState(initialLocation);
    const [selectedJobType, setSelectedJobType] = useState("");
    const [selectedExperience, setSelectedExperience] = useState("");
    const [greeting, setGreeting] = useState("Good morning");

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good morning");
        else if (hour < 18) setGreeting("Good afternoon");
        else setGreeting("Good evening");

        // Injecting fonts for accurate replication of the design
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=Playfair+Display:wght@700&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        // Fetch jobs based on initial query parameters
        if (initialKeyword || initialLocation) {
            searchJobs(initialKeyword || initialLocation)
                .then(setJobs)
                .catch(console.error)
                .finally(() => setLoading(false));
        } else {
            getAllJobs()
                .then(setJobs)
                .catch(console.error)
                .finally(() => setLoading(false));
        }

        return () => {
            if (document.head.contains(link)) document.head.removeChild(link);
        }
    }, [initialKeyword, initialLocation]);

    const handleSearch = async () => {
        setLoading(true);
        try {
            if (keyword.length > 1) {
                const results = await searchJobs(keyword);
                setJobs(results);
            } else {
                const results = await getAllJobs();
                setJobs(results);
            }
        } catch {
            console.error("Search failed");
        } finally {
            setLoading(false);
        }
    };

    // Client-side filtering based on backend enum fields and location input
    const filteredJobs = jobs.filter(job => {
        let match = true;
        if (selectedJobType && job.jobType !== selectedJobType) match = false;
        if (selectedExperience && job.experienceLevel !== selectedExperience) match = false;
        if (location && job.location && !job.location.toLowerCase().includes(location.toLowerCase())) match = false;
        return match;
    });

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
                <LoaderIcon className="w-10 h-10 text-[#7D9976]" />
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans text-gray-900 pb-20 overflow-x-hidden relative">

            <EnvelopeGraphic />

            {/* HERO HEADER */}
            <div className="pt-24 pb-16 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
                <div className="max-w-3xl relative">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[#D67C47] text-3xl md:text-4xl mb-4"
                        style={{ fontFamily: "'Caveat', cursive" }}
                    >
                        {greeting}
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl text-[#111111] leading-[1.1] mb-12 tracking-tight"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Find work that<br />feels like you.
                    </motion.h1>

                    <CircularStamp />
                </div>

                {/* SEARCH BAR (ALL IN ONE) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full bg-white rounded-3xl lg:rounded-full p-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#EBE8E0] flex flex-col lg:flex-row items-center gap-2 lg:gap-0 mt-8"
                >
                    <div className="flex-[1.5] flex items-center px-4 w-full lg:w-auto">
                        <SearchIcon className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                        <input
                            className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 py-2"
                            placeholder="Job title, keywords, or company"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    
                    <div className="hidden lg:block w-px h-8 bg-gray-200 mx-2 shrink-0"></div>
                    <div className="w-full lg:hidden h-px bg-gray-100 my-1"></div>
                    
                    <div className="flex-1 flex items-center px-4 w-full lg:w-auto">
                        <MapPinIcon className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                        <input
                            className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 py-2"
                            placeholder="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>

                    <div className="hidden lg:block w-px h-8 bg-gray-200 mx-2 shrink-0"></div>
                    <div className="w-full lg:hidden h-px bg-gray-100 my-1"></div>

                    <div className="flex-1 flex items-center px-4 w-full lg:w-auto relative group">
                        <select 
                            value={selectedJobType} 
                            onChange={(e) => setSelectedJobType(e.target.value)}
                            className="w-full bg-transparent text-gray-700 py-2 focus:outline-none cursor-pointer appearance-none pr-8"
                        >
                            <option value="">Any Job Type</option>
                            <option value="FULL_TIME">Full Time</option>
                            <option value="PART_TIME">Part Time</option>
                            <option value="CONTRACT">Contract</option>
                            <option value="REMOTE">Remote</option>
                        </select>
                        <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-4 pointer-events-none" />
                    </div>

                    <div className="hidden lg:block w-px h-8 bg-gray-200 mx-2 shrink-0"></div>
                    <div className="w-full lg:hidden h-px bg-gray-100 my-1"></div>

                    <div className="flex-1 flex items-center px-4 w-full lg:w-auto relative group">
                        <select 
                            value={selectedExperience} 
                            onChange={(e) => setSelectedExperience(e.target.value)}
                            className="w-full bg-transparent text-gray-700 py-2 focus:outline-none cursor-pointer appearance-none pr-8"
                        >
                            <option value="">Any Experience</option>
                            <option value="JUNIOR">Junior</option>
                            <option value="MID">Mid-Level</option>
                            <option value="SENIOR">Senior</option>
                        </select>
                        <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-4 pointer-events-none" />
                    </div>

                    <button
                        onClick={handleSearch}
                        className="w-full lg:w-auto bg-[#7D9976] hover:bg-[#6A8564] text-white px-8 py-3 rounded-full font-medium transition-colors lg:ml-2 mt-2 lg:mt-0"
                    >
                        Search
                    </button>
                </motion.div>

                {/* POPULAR SEARCHES */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap items-center gap-3 mt-8"
                >
                    <span className="font-semibold text-gray-800 text-sm mr-2">Popular Searches:</span>
                    {["UI/UX Designer", "Software Engineer", "Data Analyst", "Product Manager"].map((tag) => (
                        <button key={tag} onClick={() => setKeyword(tag)} className="bg-[#FCF9F3] border border-[#EAE5D9] text-gray-700 hover:bg-[#F0EBDF] px-4 py-1.5 rounded-full text-sm font-medium transition-colors">
                            {tag}
                        </button>
                    ))}
                </motion.div>
            </div>

            {/* JOBS SECTION */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 mt-4">
                <div className="flex items-center justify-between mb-10 border-t border-[#EAE5D9] pt-10">
                    <h2 className="text-xl font-bold text-gray-900">Featured Opportunities <span className="text-gray-400 text-sm ml-2 font-normal">({filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found)</span></h2>
                    <a href="#" className="text-[#7D9976] font-semibold text-sm hover:underline">View all</a>
                </div>

                {filteredJobs.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 font-medium bg-white/50 rounded-3xl border border-[#EAE5D9]">No jobs found matching your criteria.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {filteredJobs.map((job, idx) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
                                    key={job.id}
                                    className={`relative p-2.5 rounded-3xl ${bgColors[idx % 3]} shadow-sm hover:-translate-y-1 transition-transform duration-300 cursor-pointer`}
                                    onClick={() => router.push(`/jobs/${job.id}`)}
                                >
                                    <BrassTack />
                                    <div className="bg-white rounded-2xl p-6 h-full border border-white/50 shadow-sm relative flex flex-col">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl ${logoBgColors[idx % 3]}`}>
                                                {idx === 0 ? <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L2 21h20L12 3zm0 4.2L17.2 18H6.8L12 7.2z" /></svg> : job.company?.name ? job.company.name.charAt(0) : "W"}
                                            </div>
                                            <button className="text-gray-400 hover:text-gray-900 transition-colors">
                                                <BookmarkIcon className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                                            {job.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4 font-medium">
                                            {job.company?.name || "Acme Inc."}
                                        </p>

                                        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-6 font-medium">
                                            <MapPinIcon className="w-4 h-4" />
                                            <span className="truncate">{job.location}</span>
                                        </div>

                                        <div className="mt-auto flex flex-wrap gap-2">
                                            <span className="bg-[#FDFBF7] border border-[#EAE5D9] text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                {job.jobType ? job.jobType.replace('_', '-').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) : "Full-time"}
                                            </span>
                                            <span className="bg-[#FDFBF7] border border-[#EAE5D9] text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                {idx % 2 === 0 ? "Remote" : (idx % 3 === 0 ? "Hybrid" : "On-site")}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function JobsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
                <LoaderIcon className="w-10 h-10 text-[#7D9976] animate-[spin_1.5s_linear_infinite]" />
            </div>
        }>
            <JobsPageContent />
        </Suspense>
    );
}

// ---- SVGs ----
function ChevronDownIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><path d="m6 9 6 6 6-6"/></svg>; }
function LoaderIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>; }
function SearchIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>; }
function MapPinIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>; }
function BookmarkIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>; }

function CircularStamp() {
    return (
        <div className="absolute top-4 md:top-10 right-0 md:right-10 w-28 h-28 md:w-32 md:h-32 hidden sm:block">
            <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_20s_linear_infinite]">
                <path id="textPath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
                <text className="text-[8.5px] font-bold tracking-[0.18em]" fill="#C3A679">
                    <textPath href="#textPath" startOffset="0%">
                        MEANINGFUL WORK • BETTER FUTURE •
                    </textPath>
                </text>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C3A679" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 1 8.3C18 16 14 20 11 20z" />
                    <path d="M11 20c2-5 3-7 6-10" />
                </svg>
            </div>
        </div>
    );
}

function EnvelopeGraphic() {
    return (
        <div className="absolute top-0 right-0 w-[400px] h-[300px] overflow-hidden pointer-events-none hidden md:block opacity-90">
            <motion.div
                initial={{ opacity: 0, x: 100, y: -100 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute top-[-25%] right-[-15%] w-full h-full origin-top-right rotate-[-20deg]"
            >
                <svg viewBox="0 0 300 200" className="w-full h-full drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="20" y="20" width="260" height="160" fill="#F8F4EC" stroke="#E6DEC9" strokeWidth="1" rx="4" />
                    <path d="M20 20 L150 110 L280 20" fill="#F2EBE0" stroke="#E6DEC9" strokeWidth="1" />

                    <g transform="translate(20, 20)">
                        <path d="M0 0 L20 0 L15 15 L-5 15 Z" fill="#D67C47" />
                        <path d="M35 0 L55 0 L50 15 L30 15 Z" fill="#799471" />
                        <path d="M70 0 L90 0 L85 15 L65 15 Z" fill="#D67C47" />
                        <path d="M105 0 L125 0 L120 15 L100 15 Z" fill="#799471" />
                        <path d="M140 0 L160 0 L155 15 L135 15 Z" fill="#D67C47" />
                        <path d="M175 0 L195 0 L190 15 L170 15 Z" fill="#799471" />
                        <path d="M210 0 L230 0 L225 15 L205 15 Z" fill="#D67C47" />
                        <path d="M245 0 L265 0 L260 15 L240 15 Z" fill="#799471" />
                    </g>

                    <rect x="200" y="40" width="50" height="60" fill="#FCFBF8" stroke="#D3C5B0" strokeWidth="2" strokeDasharray="4 2" />
                    <path d="M215 80 Q225 55 235 80 T235 95" stroke="#799471" strokeWidth="2" fill="none" />
                    <circle cx="225" cy="65" r="12" stroke="#D67C47" strokeWidth="1.5" fill="none" />
                </svg>
            </motion.div>
        </div>
    );
}

function BrassTack() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20 drop-shadow-md">
            <circle cx="12" cy="10" r="5" fill="#D1C3AD" stroke="#B8A88E" strokeWidth="1" />
            <circle cx="10" cy="8" r="2" fill="#FFF" fillOpacity="0.6" />
            <path d="M12 15 L11.5 22 L12.5 22 Z" fill="#8C7C61" />
        </svg>
    )
}
