"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getAllSkills,
  createCandidateProfile,
  updateCandidateProfile,
  getCandidateProfile
} from "@/lib/api";

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
      try {
        const skillList = await getAllSkills();
        setSkills(skillList);
      } catch (err) {
        console.error("Failed to load skills", err);
      }

      try {
        const existing = await getCandidateProfile();

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
        // Normal behavior if profile doesn't exist yet
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

    setForm(f => ({
      ...f,
      projects: [...f.projects, project],
    }));

    setProject({
      title: "",
      description: "",
      techStack: "",
      projectUrl: "",
      complexity: "BEGINNER",
    });
  };

  const removeProject = (index) => {
    setForm(f => ({
      ...f,
      projects: f.projects.filter((_, i) => i !== index),
    }));
  };

  // --- FIXED: ADDED e.preventDefault() ---
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    setError(null);

    try {
      try {
        await getCandidateProfile();
        await updateCandidateProfile(form);
      } catch {
        await createCandidateProfile(form);
      }

      router.push("/dashboard/candidate");
    } catch (err) {
      setError(err.message || "Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#7A8B6A] focus:ring-1 focus:ring-[#7A8B6A] transition";

  const labelClass = "text-xs font-semibold uppercase text-gray-600 tracking-wide";

  const btnClass =
    "w-full bg-[#7A8B6A] hover:bg-[#6c7d5c] disabled:opacity-70 text-white py-3 rounded-lg font-semibold transition mt-4";

  return (
    <div className="min-h-screen bg-[#F5F2EB] flex justify-center px-4 py-10 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm p-8 border border-[#E8E1D5]">

        {/* HEADER */}
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-1">
          Set up your profile
        </h1>
        <p className="text-gray-500 mb-8">
          Complete your profile to get better job matches
        </p>

        {/* FIXED: WRAPPED IN A FORM */}
        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* NAME */}
          <div>
            <label className={labelClass}>Full Name *</label>
            <input
              className={inputClass}
              value={form.fullName}
              required // Matches backend @NotBlank
              onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
              placeholder="John Doe"
            />
          </div>

          {/* PHONE & LOCATION GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Phone</label>
              <input
                className={inputClass}
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="98XXXXXXXX"
              />
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input
                className={inputClass}
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                placeholder="Kathmandu, Nepal"
              />
            </div>
          </div>

          {/* BIO */}
          <div>
            <label className={labelClass}>Bio</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={3}
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              placeholder="Tell us about your professional background..."
            />
          </div>

          {/* EXPERIENCE */}
          <div>
            <label className={labelClass}>Experience (years)</label>
            <input
              type="number"
              min="0"
              className={`${inputClass} sm:w-1/3`}
              value={form.experienceYears}
              onChange={e =>
                setForm(f => ({
                  ...f,
                  experienceYears: parseInt(e.target.value) || 0,
                }))
              }
            />
          </div>

          {/* SKILLS */}
          <div>
            <label className={labelClass}>Skills</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map(skill => {
                const active = form.skillIds.includes(skill.id);
                return (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => toggleSkill(skill.id)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition
                      ${
                        active
                          ? "bg-[#7A8B6A] text-white border-[#7A8B6A]"
                          : "bg-white text-gray-700 border-gray-200 hover:border-[#7A8B6A]"
                      }`}
                  >
                    {skill.name}
                  </button>
                );
              })}
              {skills.length === 0 && (
                <p className="text-sm text-gray-400 italic">No skills available from server.</p>
              )}
            </div>
          </div>

          {/* PROJECTS */}
          <div className="pt-4 border-t border-gray-100">
            <label className={`${labelClass} block mb-3`}>Portfolio Projects</label>

            {/* List Existing Projects */}
            <div className="space-y-3 mb-4">
              {form.projects.map((p, i) => (
                <div key={i} className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-900">{p.title}</p>
                    <p className="text-xs font-semibold text-[#7A8B6A] mt-1">{p.complexity}</p>
                    {p.techStack && <p className="text-sm text-gray-600 mt-1">{p.techStack}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeProject(i)}
                    className="text-red-500 hover:text-red-700 text-sm font-semibold transition"
                  >
                    ✕ Remove
                  </button>
                </div>
              ))}
            </div>

            {/* ADD PROJECT FORM */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
              <p className="text-sm font-bold text-gray-800">Add a New Project</p>
              
              <input
                className={inputClass}
                placeholder="Project Title *"
                value={project.title}
                onChange={e => setProject(p => ({ ...p, title: e.target.value }))}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  className={inputClass}
                  placeholder="Tech Stack (e.g. React, Java)"
                  value={project.techStack}
                  onChange={e => setProject(p => ({ ...p, techStack: e.target.value }))}
                />
                <select
                  className={inputClass}
                  value={project.complexity}
                  onChange={e => setProject(p => ({ ...p, complexity: e.target.value }))}
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>

              <input
                className={inputClass}
                type="url"
                placeholder="Project URL (e.g. https://github.com/...)"
                value={project.projectUrl}
                onChange={e => setProject(p => ({ ...p, projectUrl: e.target.value }))}
              />

              <textarea
                className={`${inputClass} resize-none`}
                rows={2}
                placeholder="Brief description of what you built..."
                value={project.description}
                onChange={e => setProject(p => ({ ...p, description: e.target.value }))}
              />

              <button
                type="button"
                onClick={addProject}
                disabled={!project.title}
                className="text-sm bg-[#F5F2EB] hover:bg-[#E8E1D5] text-[#7A8B6A] font-bold px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                + Add Project to List
              </button>
            </div>
          </div>

          {/* ERROR DISPLAY */}
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              ⚠ {error}
            </div>
          )}

          {/* FIXED: SUBMIT BUTTON TYPE */}
          <button
            type="submit"
            disabled={loading}
            className={btnClass}
          >
            {loading ? "Saving Profile..." : "Save Profile →"}
          </button>

        </form>
      </div>
    </div>
  );
}