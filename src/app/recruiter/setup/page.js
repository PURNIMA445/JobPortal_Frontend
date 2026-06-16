"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createCompany, searchCompanies, createRecruiterProfile,updateRecruiterProfile, getRecruiterProfile } from "@/lib/api";
export default function RecruiterSetupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [companySearch, setCompanySearch] = useState("");
    const [companyResults, setCompanyResults] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [creatingCompany, setCreatingCompany] = useState(false);
    const [newCompany, setNewCompany] = useState({
        name: "", description: "", industry: "", location: "", websiteUrl: ""
    });
    const [form, setForm] = useState({
        fullName: "", phone: "", designation: "", companyId: null
    });

    const handleCompanySearch = async (val) => {
        setCompanySearch(val);
        if (val.length < 2) return setCompanyResults([]);
        try {
            const results = await searchCompanies(val);
            setCompanyResults(results);
        } catch { setCompanyResults([]); }
    };

    const selectCompany = (company) => {
        setSelectedCompany(company);
        setForm(f => ({ ...f, companyId: company.id }));
        setCompanyResults([]);
        setCompanySearch(company.name);
    };

    const handleCreateCompany = async () => {
        try {
            const created = await createCompany(newCompany);
            selectCompany(created);
            setCreatingCompany(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSubmit = async () => {
        if (!form.companyId) return setError("Please select or create a company");
        setLoading(true);
        setError(null);
        try {
            try {
                await getRecruiterProfile();
                await updateRecruiterProfile(form);
            } catch {
                await createRecruiterProfile(form);
            }
            router.push("/dashboard/recruiter");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        async function loadData() {
            try {
                const existing = await getRecruiterProfile();
                setForm({
                    fullName: existing.fullName || "",
                    phone: existing.phone || "",
                    designation: existing.designation || "",
                    companyId: existing.company?.id || null,
                });
                if (existing.company) {
                    setSelectedCompany(existing.company);
                    setCompanySearch(existing.company.name);
                }
            } catch {
                // no profile yet
            }
        }
        loadData();
    }, []);

    return (
        <div style={{ maxWidth: 600, margin: "40px auto", padding: "0 20px", fontFamily: "sans-serif" }}>
            <h1>Set up recruiter profile</h1>

            <div style={{ marginBottom: 16 }}>
                <label>Full Name *</label>
                <input style={inputStyle} value={form.fullName}
                    onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                    placeholder="Your full name" />
            </div>

            <div style={{ marginBottom: 16 }}>
                <label>Phone</label>
                <input style={inputStyle} value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="98XXXXXXXX" />
            </div>

            <div style={{ marginBottom: 16 }}>
                <label>Designation</label>
                <input style={inputStyle} value={form.designation}
                    onChange={e => setForm(f => ({ ...f, designation: e.target.value }))}
                    placeholder="e.g. HR Manager" />
            </div>

            <div style={{ marginBottom: 16 }}>
                <label>Company *</label>
                <input style={inputStyle} value={companySearch}
                    onChange={e => handleCompanySearch(e.target.value)}
                    placeholder="Search company name..." />
                {companyResults.length > 0 && (
                    <div style={{ border: "1px solid #ccc", borderRadius: 6, marginTop: 4 }}>
                        {companyResults.map(c => (
                            <div key={c.id} onClick={() => selectCompany(c)}
                                style={{ padding: "8px 12px", cursor: "pointer", borderBottom: "1px solid #eee" }}>
                                {c.name} — {c.industry}
                            </div>
                        ))}
                    </div>
                )}
                {selectedCompany && (
                    <p style={{ color: "green", marginTop: 4 }}>
                        ✓ Selected: {selectedCompany.name}
                    </p>
                )}
                <button onClick={() => setCreatingCompany(!creatingCompany)}
                    style={{ ...btnStyle, background: "#666", marginTop: 8 }}>
                    {creatingCompany ? "Cancel" : "+ Create new company"}
                </button>

                {creatingCompany && (
                    <div style={{ border: "1px solid #eee", padding: 12, borderRadius: 8, marginTop: 8 }}>
                        <input style={inputStyle} placeholder="Company name *"
                            value={newCompany.name}
                            onChange={e => setNewCompany(c => ({ ...c, name: e.target.value }))} />
                        <input style={inputStyle} placeholder="Industry"
                            value={newCompany.industry}
                            onChange={e => setNewCompany(c => ({ ...c, industry: e.target.value }))} />
                        <input style={inputStyle} placeholder="Location"
                            value={newCompany.location}
                            onChange={e => setNewCompany(c => ({ ...c, location: e.target.value }))} />
                        <input style={inputStyle} placeholder="Website URL"
                            value={newCompany.websiteUrl}
                            onChange={e => setNewCompany(c => ({ ...c, websiteUrl: e.target.value }))} />
                        <textarea style={{ ...inputStyle, height: 60 }} placeholder="Description"
                            value={newCompany.description}
                            onChange={e => setNewCompany(c => ({ ...c, description: e.target.value }))} />
                        <button onClick={handleCreateCompany} style={btnStyle}>
                            Create Company
                        </button>
                    </div>
                )}
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