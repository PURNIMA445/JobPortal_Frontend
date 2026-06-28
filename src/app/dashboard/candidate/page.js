"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  getCandidateProfile,
  getAllJobs,
  getMyApplications,
  getNotifications,
  getUnreadCount
} from "@/lib/api";

export default function CandidateDashboard() {
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getCandidateProfile(),
      getAllJobs(),
      getMyApplications(),
      getNotifications(),
      getUnreadCount(),
    ])
      .then(([prof, jobList, apps, notifs, unread]) => {
        setProfile(prof);
        setJobs(jobList);
        setApplications(apps);
        setNotifications(notifs);
        setUnreadCount(unread);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    document.cookie = "token=; max-age=0; path=/";
    localStorage.clear();
    router.push("/login");
  };

  if (loading)
    return (
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
      <div className="max-w-6xl mx-auto px-6 pt-12">

        {/* HEADER */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="flex items-center gap-2 mb-2 text-[#7C9070]">
                <LeafIcon className="w-6 h-6" />
                <span className="font-serif italic text-lg">Candidate Portal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight m-0 text-[#1A1A1A]">
              Welcome, {profile?.fullName}
            </h1>
            <p className="text-[#6B7264] mt-2 text-lg flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-[#A3AEA0]" /> {profile?.location || "Location not specified"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
            {unreadCount > 0 && (
                <div className="bg-[#7C9070] text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm">
                    <BellIcon className="w-4 h-4" /> {unreadCount} unread
                </div>
            )}
            
            <button
              onClick={() => router.push("/profile/setup")}
              className="px-5 py-2.5 bg-white border border-[#E5E5E0] hover:bg-[#F2F1EC] text-[#1A1A1A] rounded-lg transition-colors font-medium text-sm shadow-sm flex items-center gap-2"
            >
              <SettingsIcon className="w-4 h-4" /> Edit Profile
            </button>

            <button
              onClick={logout}
              className="px-5 py-2.5 bg-white border border-[#E5E5E0] hover:bg-[#FFF0F0] text-[#D67373] hover:border-[#D67373] rounded-lg transition-colors font-medium text-sm shadow-sm flex items-center gap-2"
            >
              <LogOutIcon className="w-4 h-4" /> Logout
            </button>
          </div>
        </motion.div>

        {/* STATS */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >
          {[
            { label: "Jobs Available", value: jobs.length, icon: <BriefcaseIcon className="w-6 h-6 text-[#7C9070]" /> },
            { label: "My Applications", value: applications.length, icon: <FileTextIcon className="w-6 h-6 text-[#7C9070]" /> },
            { label: "Notifications", value: notifications.length, icon: <BellIcon className="w-6 h-6 text-[#7C9070]" /> },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-6 border border-[#E5E5E0] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between"
            >
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN: Content Heavy (Applications & Jobs) */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* APPLICATIONS */}
                <div>
                    <h2 className="font-serif text-2xl mb-4 text-[#1A1A1A]">My Applications</h2>
                    <div className="bg-white border border-[#E5E5E0] rounded-2xl shadow-sm overflow-hidden">
                        {applications.length === 0 ? (
                            <div className="p-10 text-center">
                                <div className="w-16 h-16 bg-[#F4F5F2] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileTextIcon className="w-8 h-8 text-[#A3AEA0]" />
                                </div>
                                <p className="text-[#6B7264] text-sm">No applications submitted yet.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-[#E5E5E0]">
                            {applications.map((app, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                    key={app.id}
                                    className="p-6 hover:bg-[#F9F8F4] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                                >
                                <div>
                                    <p className="font-serif text-lg font-medium text-[#1A1A1A] mb-1">
                                        {app.job.title}
                                    </p>
                                    <p className="text-sm text-[#6B7264] flex items-center gap-2">
                                        <BuildingIcon className="w-4 h-4 text-[#A3AEA0]" /> {app.job.company.name}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    {app.matchScore && (
                                        <span className="text-sm font-medium text-[#7C9070] bg-[#F1F4F0] px-3 py-1 rounded-lg">
                                            {app.matchScore}% Match
                                        </span>
                                    )}
                                    <span className={`text-xs font-medium px-3 py-1.5 rounded-full border ${badgeStyle(app.status)}`}>
                                        {app.status}
                                    </span>
                                </div>
                                </motion.div>
                            ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* JOBS */}
                <div>
                    <div className="flex justify-between items-end mb-4">
                        <h2 className="font-serif text-2xl text-[#1A1A1A] m-0">Recommended Jobs</h2>
                        <button
                            onClick={() => router.push("/jobs")}
                            className="text-sm text-[#7C9070] font-medium hover:text-[#5C7356] transition-colors flex items-center gap-1"
                        >
                            View All <ChevronRightIcon className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="bg-white border border-[#E5E5E0] rounded-2xl shadow-sm overflow-hidden">
                        {jobs.length === 0 ? (
                            <div className="p-8 text-center text-[#6B7264] text-sm">No jobs available right now.</div>
                        ) : (
                            <div className="divide-y divide-[#E5E5E0]">
                                {jobs.slice(0, 5).map((job, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                    key={job.id}
                                    className="p-6 hover:bg-[#F9F8F4] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                >
                                    <div>
                                        <p className="font-serif text-lg font-medium text-[#1A1A1A] mb-1">{job.title}</p>
                                        <p className="text-sm text-[#6B7264] flex items-center gap-x-3">
                                            <span className="flex items-center gap-1"><BuildingIcon className="w-4 h-4 text-[#A3AEA0]" /> {job.company.name}</span>
                                            <span className="flex items-center gap-1"><MapPinIcon className="w-4 h-4 text-[#A3AEA0]" /> {job.location}</span>
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => router.push(`/jobs/${job.id}`)}
                                        className="px-5 py-2 text-sm bg-white border border-[#E5E5E0] text-[#1A1A1A] rounded-lg hover:bg-[#7C9070] hover:text-white hover:border-[#7C9070] transition-colors shadow-sm whitespace-nowrap"
                                    >
                                        View Details
                                    </button>
                                </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Sidebar (Skills & Notifications) */}
            <div className="lg:col-span-1 space-y-8">
                
                {/* SKILLS */}
                <div className="bg-white border border-[#E5E5E0] rounded-2xl p-6 shadow-sm">
                    <h3 className="font-serif text-xl mb-4 text-[#1A1A1A]">My Skills</h3>
                    
                    {profile?.skills?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {profile.skills.map((skill) => (
                            <span
                                key={skill.id}
                                className="px-4 py-1.5 text-sm rounded-full bg-[#F9F8F4] text-[#6B7264] border border-[#E5E5E0]"
                            >
                                {skill.name}
                            </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-[#6B7264] text-sm">No skills added yet.</p>
                    )}
                </div>

                {/* NOTIFICATIONS */}
                {notifications.length > 0 && (
                    <div className="bg-white border border-[#E5E5E0] rounded-2xl p-6 shadow-sm">
                        <h3 className="font-serif text-xl mb-4 text-[#1A1A1A] flex items-center gap-2">
                            Recent Alerts
                        </h3>

                        <div className="space-y-4">
                            {notifications.slice(0, 5).map((n, idx) => (
                            <motion.div
                                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                                key={n.id}
                                className={`pb-4 border-b border-[#F4F5F2] last:border-0 last:pb-0 flex gap-3 ${
                                n.isRead ? "opacity-60" : "opacity-100"
                                }`}
                            >
                                <div className="mt-1">
                                    <div className={`w-2 h-2 rounded-full ${n.isRead ? 'bg-[#E5E5E0]' : 'bg-[#7C9070]'}`}></div>
                                </div>
                                <div>
                                    <p className="text-sm text-[#1A1A1A] leading-relaxed m-0">{n.message}</p>
                                    <span className="text-xs text-[#A3AEA0] mt-1 block">
                                        {new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}

/* STATUS BADGE */
function badgeStyle(status) {
  const map = {
    APPLIED: "bg-[#F4F5F2] text-[#6B7264] border-[#E5E5E0]", // Neutral
    REVIEWED: "bg-[#FFF4E5] text-[#B37B32] border-[#F0D8BA]", // Warm/Yellow
    SHORTLISTED: "bg-[#F1F4F0] text-[#5C7356] border-[#DCE4DA]", // Sage Green
    REJECTED: "bg-[#FFF0F0] text-[#D67373] border-[#FAD4D4]", // Soft Red
  };
  return map[status] || "bg-[#F4F5F2] text-[#6B7264] border-[#E5E5E0]";
}

// ---- Elegant SVGs ----

function SettingsIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>; }
function LogOutIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>; }
function BriefcaseIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>; }
function FileTextIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>; }
function BellIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>; }
function MapPinIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>; }
function BuildingIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>; }
function ChevronRightIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><path d="m9 18 6-6-6-6"/></svg>; }
function LoaderIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>; }
function LeafIcon(props) { return <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>; }