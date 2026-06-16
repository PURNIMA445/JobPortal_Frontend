"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllJobs, searchJobs } from "@/lib/api";

export default function JobsPage() {
    const router = useRouter();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        getAllJobs()
            .then(setJobs)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSearch = async (e) => {
        const val = e.target.value;
        setKeyword(val);
        if (val.length < 2) {
            getAllJobs().then(setJobs);
            return;
        }
        try {
            const results = await searchJobs(val);
            setJobs(results);
        } catch {
            console.error("Search failed");
        }
    };

    if (loading) return (
        <p style={{ padding: 40, fontFamily: "sans-serif" }}>Loading jobs...</p>
    );

    return (
        <div style={{ fontFamily: "sans-serif", padding: 24, maxWidth: 900, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h1 style={{ margin: 0 }}>All Jobs</h1>
                <button onClick={() => router.back()} style={btnSecondary}>
                    ← Back
                </button>
            </div>

            {/* Search */}
            <input
                style={{ ...inputStyle, marginBottom: 24 }}
                placeholder="Search jobs by title or keyword..."
                value={keyword}
                onChange={handleSearch}
            />

            {/* Job list */}
            {jobs.length === 0
                ? <p style={{ color: "#999" }}>No jobs found</p>
                : jobs.map(job => (
                    <div key={job.id} style={cardStyle}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                                <h3 style={{ margin: "0 0 4px" }}>{job.title}</h3>
                                <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
                                    {job.company.name} · {job.location}
                                </p>
                            </div>
                            <button
                                onClick={() => router.push(`/jobs/${job.id}`)}
                                style={btnPrimary}>
                                View →
                            </button>
                        </div>
                        <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <span style={tagStyle}>{job.jobType}</span>
                            <span style={tagStyle}>{job.experienceLevel}</span>
                            {job.salaryMin && (
                                <span style={tagStyle}>
                                    ${job.salaryMin} - ${job.salaryMax}
                                </span>
                            )}
                            <span style={{
                                ...tagStyle,
                                background: job.status === "OPEN" ? "#e8f5e9" : "#ffebee",
                                color: job.status === "OPEN" ? "#2e7d32" : "#c62828",
                            }}>
                                {job.status}
                            </span>
                        </div>
                        {job.requiredSkills?.length > 0 && (
                            <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
                                {job.requiredSkills.map(s => (
                                    <span key={s.id} style={skillTag}>{s.name}</span>
                                ))}
                            </div>
                        )}
                    </div>
                ))
            }
        </div>
    );
}

const cardStyle = {
    border: "1px solid #eee", borderRadius: 10,
    padding: 20, marginBottom: 16,
};
const inputStyle = {
    display: "block", width: "100%", padding: "10px 14px",
    border: "1px solid #ccc", borderRadius: 8,
    fontSize: 14, boxSizing: "border-box",
};
const btnPrimary = {
    padding: "8px 16px", background: "#000", color: "#fff",
    border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13,
};
const btnSecondary = {
    padding: "8px 16px", background: "#fff", border: "1px solid #ccc",
    borderRadius: 6, cursor: "pointer", fontSize: 13,
};
const tagStyle = {
    background: "#f0f0f0", padding: "3px 10px",
    borderRadius: 20, fontSize: 12,
};
const skillTag = {
    background: "#e8f0fe", color: "#1a56db",
    padding: "2px 8px", borderRadius: 20, fontSize: 12,
};