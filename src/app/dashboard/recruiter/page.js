"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    getRecruiterProfile, getMyJobs, getNotifications,
    closeJob, createJob, getAllSkills
} from "@/lib/api";

export default function RecruiterDashboard() {
    const router = useRouter();
    const [profile, setProfile] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showJobForm, setShowJobForm] = useState(false);
    const [jobForm, setJobForm] = useState({
        title: "", description: "", location: "",
        jobType: "FULL_TIME", experienceLevel: "MID",
        salaryMin: "", salaryMax: "",
        companyId: null, requiredSkillIds: [],
    });
    const [posting, setPosting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        Promise.all([
            getRecruiterProfile(),
            getMyJobs(),
            getNotifications(),
            getAllSkills(),
        ]).then(([prof, jobList, notifs, skillList]) => {
            setProfile(prof);
            setJobs(jobList);
            setNotifications(notifs);
            setSkills(skillList);
            setJobForm(f => ({ ...f, companyId: prof.company?.id }));
        }).catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const toggleSkill = (id) => {
        setJobForm(f => ({
            ...f,
            requiredSkillIds: f.requiredSkillIds.includes(id)
                ? f.requiredSkillIds.filter(s => s !== id)
                : [...f.requiredSkillIds, id],
        }));
    };

    const handlePostJob = async () => {
        setPosting(true);
        setError(null);
        try {
            const posted = await createJob({
                ...jobForm,
                salaryMin: parseFloat(jobForm.salaryMin) || null,
                salaryMax: parseFloat(jobForm.salaryMax) || null,
            });
            setJobs(j => [posted, ...j]);
            setShowJobForm(false);
            setJobForm(f => ({
                ...f, title: "", description: "", location: "",
                requiredSkillIds: [], salaryMin: "", salaryMax: "",
            }));
        } catch (err) {
            setError(err.message);
        } finally {
            setPosting(false);
        }
    };

    const handleCloseJob = async (jobId) => {
        try {
            const updated = await closeJob(jobId);
            setJobs(j => j.map(job => job.id === jobId ? updated : job));
        } catch (err) {
            alert(err.message);
        }
    };

    const logout = () => {
        document.cookie = "token=; max-age=0; path=/";
        localStorage.clear();
        router.push("/login");
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9F8F4]">
            <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            >
                <LoaderIcon className="w-10 h-10 text-[#7C9070]" />
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F9F8F4] text-[#1C1F1A] font-sans pb-20 selection:bg-[#7C9070] selection:text-white">
            <div className="max-w-5xl mx-auto px-6 pt-12">
                
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
                >
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-[#7C9070]">
                            <LeafIcon className="w-6 h-6" />
                            <span className="font-serif italic text-lg">Dashboard</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight m-0 text-[#1A1A1A]">
                            Welcome, {profile?.fullName}
                        </h1>
                        <p className="text-[#6B7264] mt-2 text-lg">
                            {profile?.designation} at {profile?.company?.name}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button onClick={() => setShowJobForm(!showJobForm)} 
                                className="px-5 py-2.5 bg-[#7C9070] hover:bg-[#687A5D] text-white rounded-lg transition-colors font-medium text-sm shadow-sm flex items-center gap-2">
                            {showJobForm ? <XIcon className="w-4 h-4"/> : <PlusIcon className="w-4 h-4"/>}
                            {showJobForm ? "Cancel Posting" : "Post a Job"}
                        </button>
                        <button onClick={() => router.push("/recruiter/setup")} 
                                className="px-5 py-2.5 bg-white border border-[#E5E5E0] hover:bg-[#F2F1EC] text-[#1A1A1A] rounded-lg transition-colors font-medium text-sm shadow-sm flex items-center gap-2">
                            <SettingsIcon className="w-4 h-4"/>
                            Settings
                        </button>
                        <button onClick={logout} 
                                className="px-5 py-2.5 bg-white border border-[#E5E5E0] hover:bg-[#FFF0F0] text-[#D67373] hover:border-[#D67373] rounded-lg transition-colors font-medium text-sm shadow-sm flex items-center gap-2">
                            <LogOutIcon className="w-4 h-4"/>
                            Logout
                        </button>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
                >
                    {[
                        { label: "Total Jobs Posted", value: jobs.length, icon: <BriefcaseIcon className="w-6 h-6 text-[#7C9070]" /> },
                        { label: "Active Openings", value: jobs.filter(j => j.status === "OPEN").length, icon: <ActivityIcon className="w-6 h-6 text-[#7C9070]" /> },
                        { label: "New Notifications", value: notifications.length, icon: <BellIcon className="w-6 h-6 text-[#7C9070]" /> },
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-6 border border-[#E5E5E0] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-[#6B7264] mb-1">{stat.label}</p>
                                <h2 className="text-3xl font-serif font-medium m-0 text-[#1A1A1A]">{stat.value}</h2>
                            </div>
                            <div className="bg-[#F4F5F2] p-3 rounded-full">
                                {stat.icon}
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Post Job Form (Matching the Image UI) */}
                <AnimatePresence>
                    {showJobForm && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0, scale: 0.98 }}
                            animate={{ opacity: 1, height: "auto", scale: 1 }}
                            exit={{ opacity: 0, height: 0, scale: 0.98 }}
                            className="overflow-hidden mb-10"
                        >
                            <div className="bg-white border border-[#E5E5E0] rounded-2xl p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                                <h3 className="font-serif text-3xl mb-2 text-[#1A1A1A]">Create a new listing</h3>
                                <p className="text-[#6B7264] mb-8 text-sm">Find the talent that truly fits your team.</p>
                                
                                <div className="space-y-6">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Job Title</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input className="w-full pl-11 pr-4 py-3 bg-white border border-[#E5E5E0] rounded-xl text-sm focus:outline-none focus:border-[#7C9070] focus:ring-1 focus:ring-[#7C9070] transition-colors placeholder-gray-400 text-[#1A1A1A]" 
                                                placeholder="e.g. Senior Frontend Developer"
                                                value={jobForm.title} onChange={e => setJobForm(f => ({ ...f, title: e.target.value }))} />
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Location</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <MapPinIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input className="w-full pl-11 pr-4 py-3 bg-white border border-[#E5E5E0] rounded-xl text-sm focus:outline-none focus:border-[#7C9070] focus:ring-1 focus:ring-[#7C9070] transition-colors placeholder-gray-400 text-[#1A1A1A]" 
                                                placeholder="e.g. Remote, Amman, etc."
                                                value={jobForm.location} onChange={e => setJobForm(f => ({ ...f, location: e.target.value }))} />
                                        </div>
                                    </div>

                                    {/* Type & Experience */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Job Type</label>
                                            <div className="relative">
                                                <select className="w-full pl-4 pr-10 py-3 bg-white border border-[#E5E5E0] rounded-xl text-sm focus:outline-none focus:border-[#7C9070] focus:ring-1 focus:ring-[#7C9070] appearance-none text-[#1A1A1A]" 
                                                    value={jobForm.jobType} onChange={e => setJobForm(f => ({ ...f, jobType: e.target.value }))}>
                                                    <option value="FULL_TIME">Full Time</option>
                                                    <option value="PART_TIME">Part Time</option>
                                                    <option value="CONTRACT">Contract</option>
                                                    <option value="REMOTE">Remote</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                    <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Experience Level</label>
                                            <div className="relative">
                                                <select className="w-full pl-4 pr-10 py-3 bg-white border border-[#E5E5E0] rounded-xl text-sm focus:outline-none focus:border-[#7C9070] focus:ring-1 focus:ring-[#7C9070] appearance-none text-[#1A1A1A]" 
                                                    value={jobForm.experienceLevel} onChange={e => setJobForm(f => ({ ...f, experienceLevel: e.target.value }))}>
                                                    <option value="JUNIOR">Junior</option>
                                                    <option value="MID">Mid-Level</option>
                                                    <option value="SENIOR">Senior</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                    <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Salary */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Minimum Salary <span className="text-gray-400 font-normal">(optional)</span></label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <DollarSignIcon className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <input className="w-full pl-10 pr-4 py-3 bg-white border border-[#E5E5E0] rounded-xl text-sm focus:outline-none focus:border-[#7C9070] focus:ring-1 focus:ring-[#7C9070] transition-colors placeholder-gray-400" 
                                                    type="number" placeholder="0" value={jobForm.salaryMin} onChange={e => setJobForm(f => ({ ...f, salaryMin: e.target.value }))} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Maximum Salary <span className="text-gray-400 font-normal">(optional)</span></label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <DollarSignIcon className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <input className="w-full pl-10 pr-4 py-3 bg-white border border-[#E5E5E0] rounded-xl text-sm focus:outline-none focus:border-[#7C9070] focus:ring-1 focus:ring-[#7C9070] transition-colors placeholder-gray-400" 
                                                    type="number" placeholder="0" value={jobForm.salaryMax} onChange={e => setJobForm(f => ({ ...f, salaryMax: e.target.value }))} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Job Description</label>
                                        <textarea className="w-full px-4 py-3 bg-white border border-[#E5E5E0] rounded-xl text-sm focus:outline-none focus:border-[#7C9070] focus:ring-1 focus:ring-[#7C9070] transition-colors placeholder-gray-400 text-[#1A1A1A] min-h-[120px] resize-y" 
                                            placeholder="Describe the role, responsibilities, and ideal candidate..."
                                            value={jobForm.description} onChange={e => setJobForm(f => ({ ...f, description: e.target.value }))} />
                                    </div>

                                    {/* Skills */}
                                    <div>
                                        <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Required Skills</label>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {skills.map(skill => {
                                                const isSelected = jobForm.requiredSkillIds.includes(skill.id);
                                                return (
                                                    <button key={skill.id} onClick={() => toggleSkill(skill.id)}
                                                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                                                            isSelected 
                                                            ? "bg-[#7C9070] border-[#7C9070] text-white shadow-sm" 
                                                            : "bg-white border-[#E5E5E0] text-[#6B7264] hover:bg-[#F9F8F4]"
                                                        }`}>
                                                        {skill.name}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-[#FFF0F0] text-[#D67373] text-sm rounded-xl border border-[#FAD4D4] flex items-center gap-2">
                                            <AlertCircleIcon className="w-5 h-5"/> {error}
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-[#E5E5E0]">
                                        <button onClick={handlePostJob} disabled={posting} 
                                            className="w-full py-3.5 bg-[#7C9070] hover:bg-[#687A5D] text-white rounded-xl font-medium transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-sm">
                                            {posting ? <LoaderIcon className="w-5 h-5 animate-spin" /> : null}
                                            {posting ? "Publishing listing..." : "Publish Job Listing"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Jobs List */}
                    <div className="lg:col-span-2">
                        <h2 className="font-serif text-2xl mb-4 text-[#1A1A1A]">My Posted Jobs</h2>
                        <div className="space-y-4">
                            {jobs.length === 0 ? (
                                <div className="bg-white border border-[#E5E5E0] rounded-2xl p-10 text-center shadow-sm">
                                    <div className="w-16 h-16 bg-[#F4F5F2] rounded-full flex items-center justify-center mx-auto mb-4">
                                        <BriefcaseIcon className="w-8 h-8 text-[#A3AEA0]" />
                                    </div>
                                    <h3 className="font-serif text-xl mb-2 text-[#1A1A1A]">No jobs posted yet</h3>
                                    <p className="text-[#6B7264] text-sm mb-6">Create your first job listing to start receiving applications.</p>
                                    <button onClick={() => setShowJobForm(true)} className="px-5 py-2.5 bg-white border border-[#E5E5E0] hover:bg-[#F9F8F4] text-[#1A1A1A] rounded-lg transition-colors font-medium text-sm shadow-sm">
                                        + Post your first job
                                    </button>
                                </div>
                            ) : (
                                jobs.map((job, idx) => (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                        key={job.id} 
                                        className="bg-white border border-[#E5E5E0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col md:flex-row md:items-center justify-between gap-4"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-serif font-medium text-[#1A1A1A] m-0">{job.title}</h3>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                                    job.status === "OPEN" 
                                                    ? "bg-[#F1F4F0] text-[#5C7356] border-[#DCE4DA]" 
                                                    : "bg-[#F9F9F9] text-[#888] border-[#E5E5E0]"
                                                }`}>
                                                    {job.status}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#6B7264]">
                                                <span className="flex items-center gap-1.5"><MapPinIcon className="w-4 h-4 text-[#A3AEA0]" /> {job.location || "Location not specified"}</span>
                                                <span className="flex items-center gap-1.5"><BriefcaseIcon className="w-4 h-4 text-[#A3AEA0]" /> {job.jobType.replace('_', ' ')}</span>
                                                <span className="flex items-center gap-1.5"><StarIcon className="w-4 h-4 text-[#A3AEA0]" /> {job.experienceLevel}</span>
                                                {job.salaryMin && <span className="flex items-center gap-1.5 text-[#5C7356] font-medium"><DollarSignIcon className="w-4 h-4"/>{job.salaryMin} - {job.salaryMax}</span>}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 mt-4 md:mt-0">
                                            <button onClick={() => router.push(`/jobs/${job.id}`)} 
                                                className="px-4 py-2 bg-[#F9F8F4] hover:bg-[#EAE8E1] text-[#1A1A1A] rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                                <UsersIcon className="w-4 h-4" /> View Applicants
                                            </button>
                                            {job.status === "OPEN" && (
                                                <button onClick={() => handleCloseJob(job.id)} 
                                                    className="p-2 text-[#A3AEA0] hover:bg-[#FFF0F0] hover:text-[#D67373] rounded-lg transition-colors" title="Close Job">
                                                    <ArchiveIcon className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Notifications Sidebar */}
                    <div className="lg:col-span-1">
                        <h2 className="font-serif text-2xl mb-4 text-[#1A1A1A]">Activity</h2>
                        <div className="bg-white border border-[#E5E5E0] rounded-2xl p-6 shadow-sm">
                            {notifications.length === 0 ? (
                                <p className="text-[#6B7264] text-sm text-center py-4">No recent activity.</p>
                            ) : (
                                <div className="space-y-4">
                                    {notifications.slice(0, 5).map((n, idx) => (
                                        <motion.div 
                                            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                                            key={n.id} 
                                            className="flex gap-3 pb-4 border-b border-[#F4F5F2] last:border-0 last:pb-0"
                                        >
                                            <div className="mt-0.5">
                                                <div className="w-2 h-2 rounded-full bg-[#7C9070]"></div>
                                            </div>
                                            <p className="text-sm text-[#1A1A1A] leading-relaxed m-0">{n.message}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ---- Elegant SVGs ----

function PlusIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><path d="M12 5v14M5 12h14"/></svg>; }
function XIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><path d="M18 6 6 18M6 6l12 12"/></svg>; }
function SettingsIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>; }
function LogOutIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>; }
function BriefcaseIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>; }
function ActivityIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>; }
function BellIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>; }
function MapPinIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>; }
function DollarSignIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>; }
function ChevronDownIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><path d="m6 9 6 6 6-6"/></svg>; }
function UsersIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function ArchiveIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>; }
function StarIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>; }
function AlertCircleIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>; }
function LoaderIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>; }
function LeafIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>; }