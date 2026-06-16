"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCandidateProfile, getAllJobs, getMyApplications, 
         getNotifications, getUnreadCount } from "@/lib/api";

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
        ]).then(([prof, jobList, apps, notifs, unread]) => {
            setProfile(prof);
            setJobs(jobList);
            setApplications(apps);
            setNotifications(notifs);
            setUnreadCount(unread);
        }).catch(console.error)
          .finally(() => setLoading(false));
    }, []);

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
                    <p style={{ color: "#666", margin: 0 }}>{profile?.location}</p>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ background: "#000", color: "#fff", padding: "4px 10px", borderRadius: 20, fontSize: 13 }}>
                        🔔 {unreadCount} unread
                    </span>
                    <button onClick={() => router.push("/profile/setup")} style={btnSecondary}>
                        Edit Profile
                    </button>
                    <button onClick={logout} style={btnDanger}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
                {[
                    { label: "Jobs Available", value: jobs.length },
                    { label: "My Applications", value: applications.length },
                    { label: "Notifications", value: notifications.length },
                ].map(stat => (
                    <div key={stat.label} style={cardStyle}>
                        <h2 style={{ margin: 0, fontSize: 32 }}>{stat.value}</h2>
                        <p style={{ margin: 0, color: "#666" }}>{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Skills */}
            <div style={{ ...cardStyle, marginBottom: 24 }}>
                <h3>My Skills</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {profile?.skills?.map(skill => (
                        <span key={skill.id} style={tagStyle}>{skill.name}</span>
                    ))}
                </div>
            </div>

            {/* Notifications */}
            {notifications.length > 0 && (
                <div style={{ ...cardStyle, marginBottom: 24 }}>
                    <h3>🔔 Notifications</h3>
                    {notifications.slice(0, 3).map(n => (
                        <div key={n.id} style={{
                            padding: "10px 0",
                            borderBottom: "1px solid #eee",
                            color: n.isRead ? "#999" : "#000"
                        }}>
                            {n.message}
                            <span style={{ fontSize: 11, color: "#aaa", marginLeft: 8 }}>
                                {new Date(n.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* My Applications */}
            <div style={{ ...cardStyle, marginBottom: 24 }}>
                <h3>My Applications</h3>
                {applications.length === 0
                    ? <p style={{ color: "#999" }}>No applications yet</p>
                    : applications.map(app => (
                        <div key={app.id} style={{ padding: "12px 0", borderBottom: "1px solid #eee" }}>
                            <strong>{app.job.title}</strong> at {app.job.company.name}
                            <span style={{ ...statusBadge(app.status), marginLeft: 12 }}>
                                {app.status}
                            </span>
                            {app.matchScore && (
                                <span style={{ marginLeft: 12, color: "green", fontSize: 13 }}>
                                    {app.matchScore}% match
                                </span>
                            )}
                        </div>
                    ))
                }
            </div>

            {/* Job Listings */}
            <div style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3>Available Jobs</h3>
                    <button onClick={() => router.push("/jobs")} style={btnSecondary}>
                        View All →
                    </button>
                </div>
                {jobs.slice(0, 5).map(job => (
                    <div key={job.id} style={{ padding: "12px 0", borderBottom: "1px solid #eee" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                                <strong>{job.title}</strong>
                                <span style={{ color: "#666", marginLeft: 8 }}>
                                    {job.company.name}
                                </span>
                            </div>
                            <button
                                onClick={() => router.push(`/jobs/${job.id}`)}
                                style={btnSmall}>
                                View →
                            </button>
                        </div>
                        <div style={{ marginTop: 4, fontSize: 13, color: "#888" }}>
                            {job.location} · {job.jobType} · {job.experienceLevel}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const cardStyle = {
    background: "#fff", border: "1px solid #eee",
    borderRadius: 10, padding: 20,
};

const tagStyle = {
    background: "#f0f0f0", padding: "4px 10px",
    borderRadius: 20, fontSize: 13,
};

const btnSecondary = {
    padding: "8px 16px", background: "#fff",
    border: "1px solid #ccc", borderRadius: 6,
    cursor: "pointer", fontSize: 13,
};

const btnDanger = {
    padding: "8px 16px", background: "#ff4444",
    color: "#fff", border: "none",
    borderRadius: 6, cursor: "pointer", fontSize: 13,
};

const btnSmall = {
    padding: "4px 12px", background: "#000",
    color: "#fff", border: "none",
    borderRadius: 4, cursor: "pointer", fontSize: 12,
};

function statusBadge(status) {
    const colors = {
        APPLIED: { background: "#e3f2fd", color: "#1565c0" },
        REVIEWED: { background: "#fff3e0", color: "#e65100" },
        SHORTLISTED: { background: "#e8f5e9", color: "#2e7d32" },
        REJECTED: { background: "#ffebee", color: "#c62828" },
    };
    return {
        ...colors[status],
        padding: "2px 8px", borderRadius: 20, fontSize: 12,
    };
}