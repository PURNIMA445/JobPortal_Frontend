"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

    if (loading) return <p style={{ padding: 40, fontFamily: "sans-serif" }}>Loading...</p>;

    return (
        <div style={{ fontFamily: "sans-serif", padding: 24, maxWidth: 900, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <h1 style={{ margin: 0 }}>Welcome, {profile?.fullName} 👋</h1>
                    <p style={{ color: "#666", margin: 0 }}>
                        {profile?.designation} at {profile?.company?.name}
                    </p>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                    <button onClick={() => setShowJobForm(!showJobForm)} style={btnPrimary}>
                        {showJobForm ? "Cancel" : "+ Post Job"}
                    </button>
                    <button onClick={logout} style={btnDanger}>Logout</button>
                    <button onClick={() => router.push("/recruiter/setup")} style={btnSecondary}>
                        Edit Profile
                    </button>
                </div>
                
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
                {[
                    { label: "Total Jobs Posted", value: jobs.length },
                    { label: "Open Jobs", value: jobs.filter(j => j.status === "OPEN").length },
                    { label: "Notifications", value: notifications.length },
                ].map(stat => (
                    <div key={stat.label} style={cardStyle}>
                        <h2 style={{ margin: 0, fontSize: 32 }}>{stat.value}</h2>
                        <p style={{ margin: 0, color: "#666" }}>{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Post Job Form */}
            {showJobForm && (
                <div style={{ ...cardStyle, marginBottom: 24 }}>
                    <h3>Post a New Job</h3>
                    <input style={inputStyle} placeholder="Job title *"
                        value={jobForm.title}
                        onChange={e => setJobForm(f => ({ ...f, title: e.target.value }))} />
                    <textarea style={{ ...inputStyle, height: 80 }} placeholder="Job description *"
                        value={jobForm.description}
                        onChange={e => setJobForm(f => ({ ...f, description: e.target.value }))} />
                    <input style={inputStyle} placeholder="Location"
                        value={jobForm.location}
                        onChange={e => setJobForm(f => ({ ...f, location: e.target.value }))} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <select style={inputStyle} value={jobForm.jobType}
                            onChange={e => setJobForm(f => ({ ...f, jobType: e.target.value }))}>
                            <option value="FULL_TIME">Full Time</option>
                            <option value="PART_TIME">Part Time</option>
                            <option value="CONTRACT">Contract</option>
                            <option value="REMOTE">Remote</option>
                        </select>
                        <select style={inputStyle} value={jobForm.experienceLevel}
                            onChange={e => setJobForm(f => ({ ...f, experienceLevel: e.target.value }))}>
                            <option value="JUNIOR">Junior</option>
                            <option value="MID">Mid</option>
                            <option value="SENIOR">Senior</option>
                        </select>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <input style={inputStyle} placeholder="Min salary"
                            type="number" value={jobForm.salaryMin}
                            onChange={e => setJobForm(f => ({ ...f, salaryMin: e.target.value }))} />
                        <input style={inputStyle} placeholder="Max salary"
                            type="number" value={jobForm.salaryMax}
                            onChange={e => setJobForm(f => ({ ...f, salaryMax: e.target.value }))} />
                    </div>
                    <label style={{ fontSize: 13, color: "#666" }}>Required Skills</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8, marginBottom: 12 }}>
                        {skills.map(skill => (
                            <button key={skill.id} onClick={() => toggleSkill(skill.id)}
                                style={{
                                    padding: "4px 12px", borderRadius: 20, fontSize: 13,
                                    border: "1px solid #ccc", cursor: "pointer",
                                    background: jobForm.requiredSkillIds.includes(skill.id) ? "#000" : "#fff",
                                    color: jobForm.requiredSkillIds.includes(skill.id) ? "#fff" : "#000",
                                }}>
                                {skill.name}
                            </button>
                        ))}
                    </div>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <button onClick={handlePostJob} disabled={posting} style={btnPrimary}>
                        {posting ? "Posting..." : "Post Job"}
                    </button>
                </div>
            )}

            {/* Notifications */}
            {notifications.length > 0 && (
                <div style={{ ...cardStyle, marginBottom: 24 }}>
                    <h3>🔔 Recent Notifications</h3>
                    {notifications.slice(0, 3).map(n => (
                        <div key={n.id} style={{ padding: "8px 0", borderBottom: "1px solid #eee", fontSize: 14 }}>
                            {n.message}
                        </div>
                    ))}
                </div>
            )}

            {/* Jobs List */}
            <div style={cardStyle}>
                <h3>My Posted Jobs</h3>
                {jobs.length === 0
                    ? <p style={{ color: "#999" }}>No jobs posted yet</p>
                    : jobs.map(job => (
                        <div key={job.id} style={{ padding: "14px 0", borderBottom: "1px solid #eee" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <strong>{job.title}</strong>
                                    <span style={{
                                        marginLeft: 10, fontSize: 12, padding: "2px 8px",
                                        borderRadius: 20,
                                        background: job.status === "OPEN" ? "#e8f5e9" : "#ffebee",
                                        color: job.status === "OPEN" ? "#2e7d32" : "#c62828",
                                    }}>
                                        {job.status}
                                    </span>
                                </div>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <button
                                        onClick={() => router.push(`/jobs/${job.id}`)}
                                        style={btnSmall}>
                                        View Applicants
                                    </button>
                                    {job.status === "OPEN" && (
                                        <button onClick={() => handleCloseJob(job.id)}
                                            style={{ ...btnSmall, background: "#ff4444" }}>
                                            Close
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>
                                {job.location} · {job.jobType} · {job.experienceLevel}
                                {job.salaryMin && ` · $${job.salaryMin} - $${job.salaryMax}`}
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

const cardStyle = {
    background: "#fff", border: "1px solid #eee",
    borderRadius: 10, padding: 20, marginBottom: 0,
};
const inputStyle = {
    display: "block", width: "100%", padding: "8px 12px",
    marginTop: 4, marginBottom: 8, border: "1px solid #ccc",
    borderRadius: 6, fontSize: 14, boxSizing: "border-box",
};
const btnPrimary = {
    padding: "10px 20px", background: "#000", color: "#fff",
    border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14,
};
const btnDanger = {
    padding: "10px 20px", background: "#ff4444", color: "#fff",
    border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14,
};
const btnSmall = {
    padding: "4px 12px", background: "#000", color: "#fff",
    border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12,
};
const btnSecondary = {
    padding: "10px 20px", background: "#fff",
    border: "1px solid #ccc", borderRadius: 6,
    cursor: "pointer", fontSize: 14,
};