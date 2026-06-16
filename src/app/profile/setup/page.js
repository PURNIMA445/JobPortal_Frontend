"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllSkills, createCandidateProfile, updateCandidateProfile, getCandidateProfile } from "@/lib/api";
export default function CandidateSetupPage() {
    const router = useRouter();
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        location: "",
        bio: "",
        experienceYears: 0,
        skillIds: [],
        projects: [],
    });
    const [project, setProject] = useState({
        title: "",
        description: "",
        techStack: "",
        projectUrl: "",
        complexity: "BEGINNER",
    });

    useEffect(() => {
        async function loadData() {
            const skillList = await getAllSkills();
            setSkills(skillList);
    
            try {
                // try to fetch existing profile
                const existing = await getCandidateProfile();
                // pre-fill form with existing data
                setForm({
                    fullName: existing.fullName || "",
                    phone: existing.phone || "",
                    location: existing.location || "",
                    bio: existing.bio || "",
                    experienceYears: existing.experienceYears || 0,
                    skillIds: existing.skills?.map(s => s.id) || [],
                    projects: existing.projects?.map(p => ({
                        title: p.title,
                        description: p.description || "",
                        techStack: p.techStack || "",
                        projectUrl: p.projectUrl || "",
                        complexity: p.complexity || "BEGINNER",
                    })) || [],
                });
            } catch {
                // no profile yet — form stays empty, that's fine
            }
        }
        loadData();
    }, []);

    const toggleSkill = (id) => {
        setForm(f => ({
            ...f,
            skillIds: f.skillIds.includes(id)
                ? f.skillIds.filter(s => s !== id)
                : [...f.skillIds, id],
        }));
    };

    const addProject = () => {
        if (!project.title) return;
        setForm(f => ({ ...f, projects: [...f.projects, project] }));
        setProject({
            title: "", description: "",
            techStack: "", projectUrl: "", complexity: "BEGINNER"
        });
    };

    const removeProject = (index) => {
        setForm(f => ({
            ...f,
            projects: f.projects.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            try {
                await getCandidateProfile();
                // profile exists → update
                await updateCandidateProfile(form);
            } catch {
                // no profile → create
                await createCandidateProfile(form);
            }
            router.push("/dashboard/candidate");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: "40px auto", padding: "0 20px", fontFamily: "sans-serif" }}>
            <h1>Set up your profile</h1>

            <div style={{ marginBottom: 16 }}>
                <label>Full Name *</label>
                <input style={inputStyle}
                    value={form.fullName}
                    onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                    placeholder="Your full name" />
            </div>

            <div style={{ marginBottom: 16 }}>
                <label>Phone</label>
                <input style={inputStyle}
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="98XXXXXXXX" />
            </div>

            <div style={{ marginBottom: 16 }}>
                <label>Location</label>
                <input style={inputStyle}
                    value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    placeholder="Kathmandu, Nepal" />
            </div>

            <div style={{ marginBottom: 16 }}>
                <label>Bio</label>
                <textarea style={{ ...inputStyle, height: 80 }}
                    value={form.bio}
                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                    placeholder="Short summary about yourself" />
            </div>

            <div style={{ marginBottom: 16 }}>
                <label>Experience (years)</label>
                <input style={inputStyle} type="number" min={0}
                    value={form.experienceYears}
                    onChange={e => setForm(f => ({
                        ...f, experienceYears: parseInt(e.target.value) || 0
                    }))} />
            </div>

            <div style={{ marginBottom: 16 }}>
                <label>Skills</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                    {skills.map(skill => (
                        <button key={skill.id}
                            onClick={() => toggleSkill(skill.id)}
                            style={{
                                padding: "6px 12px",
                                borderRadius: 20,
                                border: "1px solid #ccc",
                                background: form.skillIds.includes(skill.id) ? "#000" : "#fff",
                                color: form.skillIds.includes(skill.id) ? "#fff" : "#000",
                                cursor: "pointer",
                            }}>
                            {skill.name}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: 16 }}>
                <label>Projects</label>
                {form.projects.map((p, i) => (
                    <div key={i} style={{ background: "#f5f5f5", padding: 12, borderRadius: 8, marginTop: 8 }}>
                        <strong>{p.title}</strong> — {p.complexity}
                        <button onClick={() => removeProject(i)}
                            style={{ marginLeft: 12, color: "red", border: "none", background: "none", cursor: "pointer" }}>
                            Remove
                        </button>
                    </div>
                ))}
                <div style={{ border: "1px solid #eee", padding: 12, borderRadius: 8, marginTop: 8 }}>
                    <input style={inputStyle} placeholder="Project title *"
                        value={project.title}
                        onChange={e => setProject(p => ({ ...p, title: e.target.value }))} />
                    <textarea style={{ ...inputStyle, height: 60 }} placeholder="Description"
                        value={project.description}
                        onChange={e => setProject(p => ({ ...p, description: e.target.value }))} />
                    <input style={inputStyle} placeholder="Tech stack (e.g. React, Node.js)"
                        value={project.techStack}
                        onChange={e => setProject(p => ({ ...p, techStack: e.target.value }))} />
                    <input style={inputStyle} placeholder="GitHub / Live URL"
                        value={project.projectUrl}
                        onChange={e => setProject(p => ({ ...p, projectUrl: e.target.value }))} />
                    <select style={inputStyle} value={project.complexity}
                        onChange={e => setProject(p => ({ ...p, complexity: e.target.value }))}>
                        <option value="BEGINNER">Beginner</option>
                        <option value="INTERMEDIATE">Intermediate</option>
                        <option value="ADVANCED">Advanced</option>
                    </select>
                    <button onClick={addProject} style={btnStyle}>Add Project</button>
                </div>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button onClick={handleSubmit} disabled={loading} style={btnStyle}>
                {loading ? "Saving..." : "Save Profile →"}
            </button>
        </div>
    );
}

const inputStyle = {
    display: "block", width: "100%", padding: "8px 12px",
    marginTop: 4, marginBottom: 8, border: "1px solid #ccc",
    borderRadius: 6, fontSize: 14, boxSizing: "border-box",
};

const btnStyle = {
    padding: "10px 20px", background: "#000", color: "#fff",
    border: "none", borderRadius: 6, cursor: "pointer",
    fontSize: 14, marginTop: 8,
};