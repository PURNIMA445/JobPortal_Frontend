"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    getJob, applyToJob, saveJob, unsaveJob,
    getJobApplications, updateApplicationStatus
} from "@/lib/api";

function JobDetail() {
    const router = useRouter();
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [coverLetter, setCoverLetter] = useState("");
    const [showApplyForm, setShowApplyForm] = useState(false);
    const [applied, setApplied] = useState(false);
    const [saved, setSaved] = useState(false);
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const role = typeof window !== "undefined"
        ? localStorage.getItem("role") : null;

    useEffect(() => {
        console.log("role:", role);
        console.log("id:", id);
        getJob(id)
            .then(setJob)
            .catch(console.error)
            .finally(() => setLoading(false));

        // if recruiter, load applications
        if (role === "RECRUITER") {
            getJobApplications(id)
                .then(setApplications)
                .catch(console.error);
        }
    }, [id]);

    const handleApply = async () => {
        setApplying(true);
        setError(null);
        try {
            await applyToJob(id, coverLetter);
            setApplied(true);
            setShowApplyForm(false);
            setSuccess("Application submitted successfully!");
        } catch (err) {
            setError(err.message);
        } finally {
            setApplying(false);
        }
    };

    const handleSave = async () => {
        try {
            if (saved) {
                await unsaveJob(id);
                setSaved(false);
            } else {
                await saveJob(id);
                setSaved(true);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleStatusUpdate = async (applicationId, status) => {
        try {
            const updated = await updateApplicationStatus(applicationId, status);
            setApplications(apps =>
                apps.map(app => app.id === applicationId ? updated : app)
            );
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return (
        <p style={{ padding: 40, fontFamily: "sans-serif" }}>Loading...</p>
    );

    if (!job) return (
        <p style={{ padding: 40, fontFamily: "sans-serif" }}>Job not found</p>
    );

    return (
        <div style={{ fontFamily: "sans-serif", padding: 24, maxWidth: 800, margin: "0 auto" }}>
            <button onClick={() => router.back()} style={{ ...btnSecondary, marginBottom: 20 }}>
                ← Back
            </button>

            {/* Job Header */}
            <div style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                        <h1 style={{ margin: "0 0 6px" }}>{job.title}</h1>
                        <p style={{ margin: 0, color: "#666" }}>
                            {job.company.name} · {job.location}
                        </p>
                    </div>
                    <span style={{
                        padding: "4px 12px", borderRadius: 20, fontSize: 13,
                        background: job.status === "OPEN" ? "#e8f5e9" : "#ffebee",
                        color: job.status === "OPEN" ? "#2e7d32" : "#c62828",
                    }}>
                        {job.status}
                    </span>
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
                    <span style={tagStyle}>{job.jobType}</span>
                    <span style={tagStyle}>{job.experienceLevel}</span>
                    {job.salaryMin && (
                        <span style={tagStyle}>
                            ${job.salaryMin} - ${job.salaryMax}
                        </span>
                    )}
                </div>

                {/* Required Skills */}
                {job.requiredSkills?.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                        <strong style={{ fontSize: 14 }}>Required Skills</strong>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                            {job.requiredSkills.map(s => (
                                <span key={s.id} style={skillTag}>{s.name}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Description */}
                <div style={{ marginTop: 20 }}>
                    <strong>Job Description</strong>
                    <p style={{ color: "#444", lineHeight: 1.7, marginTop: 8 }}>
                        {job.description}
                    </p>
                </div>

                {/* Company Info */}
                <div style={{ marginTop: 16, padding: 16, background: "#f9f9f9", borderRadius: 8 }}>
                    <strong>{job.company.name}</strong>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "#666" }}>
                        {job.company.industry} · {job.company.location}
                    </p>
                    {job.company.websiteUrl && (
                        <a href={job.company.websiteUrl} target="_blank"
                            style={{ fontSize: 13, color: "#1a56db" }}>
                            {job.company.websiteUrl}
                        </a>
                    )}
                </div>

                {/* Candidate Actions */}
                {role === "CANDIDATE" && (
                    <div style={{ marginTop: 20 }}>
                        {success && <p style={{ color: "green" }}>{success}</p>}
                        {error && <p style={{ color: "red" }}>{error}</p>}

                        {!applied && job.status === "OPEN" && (
                            <>
                                <button onClick={handleSave}
                                    style={{ ...btnSecondary, marginRight: 12 }}>
                                    {saved ? "★ Saved" : "☆ Save Job"}
                                </button>
                                <button
                                    onClick={() => setShowApplyForm(!showApplyForm)}
                                    style={btnPrimary}>
                                    {showApplyForm ? "Cancel" : "Apply Now"}
                                </button>

                                {showApplyForm && (
                                    <div style={{ marginTop: 16 }}>
                                        <label style={{ fontSize: 14 }}>
                                            Cover Letter (optional)
                                        </label>
                                        <textarea
                                            style={{ ...inputStyle, height: 100, marginTop: 6 }}
                                            placeholder="Tell the recruiter why you're a good fit..."
                                            value={coverLetter}
                                            onChange={e => setCoverLetter(e.target.value)}
                                        />
                                        <button onClick={handleApply}
                                            disabled={applying} style={btnPrimary}>
                                            {applying ? "Submitting..." : "Submit Application"}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        {applied && (
                            <p style={{ color: "green", fontWeight: 500 }}>
                                ✓ You have applied to this job
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Recruiter: Applications List */}
            {role === "RECRUITER" && (
                <div style={{ ...cardStyle, marginTop: 24 }}>
                    <h3>Applications ({applications.length})</h3>
                    {applications.map(app => (
                        <div key={app.id} style={{
                            padding: "16px 0",
                            borderBottom: "1px solid #eee"
                        }}>
                            {/* Candidate info */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div>
                                    <strong style={{ fontSize: 16 }}>{app.candidateName}</strong>
                                    <span style={{ ...statusBadge(app.status), marginLeft: 10 }}>
                                        {app.status}
                                    </span>
                                </div>
                                {/* Score badges */}
                                <div style={{ textAlign: "right" }}>
                                    {app.matchScore
                                        ? <div style={{ color: "green", fontWeight: 600 }}>
                                            {app.matchScore}% match
                                        </div>
                                        : <div style={{ color: "#aaa", fontSize: 13 }}>
                                            Score not checked yet
                                        </div>
                                    }
                                    {app.rankScore && (
                                        <div style={{ fontSize: 12, color: "#666" }}>
                                            Rank score: {app.rankScore?.toFixed(1)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Cover letter */}
                            {app.coverLetter && (
                                <div style={{
                                    margin: "10px 0",
                                    padding: 12,
                                    background: "#f9f9f9",
                                    borderRadius: 6,
                                    fontSize: 13,
                                    color: "#444"
                                }}>
                                    <strong>Cover Letter:</strong> {app.coverLetter}
                                </div>
                            )}

                            {/* Applied date */}
                            <p style={{ fontSize: 12, color: "#aaa", margin: "6px 0" }}>
                                Applied: {new Date(app.appliedAt).toLocaleDateString()}
                            </p>

                            {/* Action buttons */}
                            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                                <span style={{ fontSize: 13, color: "#666", alignSelf: "center" }}>
                                    Update status:
                                </span>
                                {["REVIEWED", "SHORTLISTED", "REJECTED"].map(s => (
                                    <button key={s}
                                        onClick={() => handleStatusUpdate(app.id, s)}
                                        style={{
                                            padding: "6px 14px", fontSize: 12,
                                            border: "1px solid #ccc",
                                            borderRadius: 20, cursor: "pointer",
                                            background: app.status === s ? "#000" : "#fff",
                                            color: app.status === s ? "#fff" : "#000",
                                            fontWeight: app.status === s ? 600 : 400,
                                        }}>
                                        {s === "REVIEWED" ? "👁 Review" :
                                            s === "SHORTLISTED" ? "✓ Shortlist" : "✗ Reject"}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
export default function JobDetailPage() {
    return (
        <Suspense fallback={<p style={{ padding: 40, fontFamily: "sans-serif" }}>Loading...</p>}>
            <JobDetail />
        </Suspense>
    );
}
const cardStyle = {
    border: "1px solid #eee", borderRadius: 10, padding: 24,
};
const inputStyle = {
    display: "block", width: "100%", padding: "8px 12px",
    border: "1px solid #ccc", borderRadius: 6,
    fontSize: 14, boxSizing: "border-box",
};
const btnPrimary = {
    padding: "10px 20px", background: "#000", color: "#fff",
    border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14,
};
const btnSecondary = {
    padding: "8px 16px", background: "#fff", border: "1px solid #ccc",
    borderRadius: 6, cursor: "pointer", fontSize: 13,
};
const tagStyle = {
    background: "#f0f0f0", padding: "4px 12px",
    borderRadius: 20, fontSize: 13,
};
const skillTag = {
    background: "#e8f0fe", color: "#1a56db",
    padding: "3px 10px", borderRadius: 20, fontSize: 13,
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