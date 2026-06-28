"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  createCompany, 
  searchCompanies, 
  createRecruiterProfile,
  updateRecruiterProfile, 
  getRecruiterProfile 
} from "@/lib/api";

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
                // Normal behavior if no profile yet
            }
        }
        loadData();
    }, []);

    const handleCompanySearch = async (val) => {
        setCompanySearch(val);
        if (val.length < 2) return setCompanyResults([]);
        try {
            const results = await searchCompanies(val);
            setCompanyResults(results);
        } catch { 
            setCompanyResults([]); 
        }
    };

    const selectCompany = (company) => {
        setSelectedCompany(company);
        setForm(f => ({ ...f, companyId: company.id }));
        setCompanyResults([]);
        setCompanySearch(company.name);
        setCreatingCompany(false);
    };

    const handleCreateCompany = async () => {
        if (!newCompany.name) return setError("Company name is required.");
        try {
            const created = await createCompany(newCompany);
            selectCompany(created);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSubmit = async () => {
        if (!form.companyId) return setError("Please select or create a company");
        if (!form.fullName) return setError("Full name is required");
        
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

    const inputClass = "w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#7A8B6A] focus:ring-1 focus:ring-[#7A8B6A] transition";
    const labelClass = "text-xs font-semibold uppercase text-gray-600 tracking-wide mb-1 block";

    return (
        <div className="min-h-screen bg-[#F5F2EB] flex justify-center py-12 px-4 font-sans">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl bg-white rounded-2xl shadow-sm p-8 border border-[#E8E1D5]"
            >
                {/* HEADER */}
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                    Recruiter Setup
                </h1>
                <p className="text-gray-500 mb-8">
                    Set up your profile and link your company to start posting jobs.
                </p>

                <div className="space-y-6">
                    {/* PERSONAL DETAILS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className={labelClass}>Full Name *</label>
                            <input 
                                className={inputClass} 
                                value={form.fullName}
                                onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                                placeholder="Your full name" 
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Phone</label>
                            <input 
                                className={inputClass} 
                                value={form.phone}
                                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                placeholder="98XXXXXXXX" 
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Designation</label>
                        <input 
                            className={inputClass} 
                            value={form.designation}
                            onChange={e => setForm(f => ({ ...f, designation: e.target.value }))}
                            placeholder="e.g. Hiring Manager, HR Director" 
                        />
                    </div>

                    <hr className="border-gray-100" />

                    {/* COMPANY SECTION */}
                    <div>
                        <label className={labelClass}>Company *</label>
                        <div className="relative">
                            <input 
                                className={inputClass} 
                                value={companySearch}
                                onChange={e => handleCompanySearch(e.target.value)}
                                placeholder="Search for your company..." 
                            />
                            
                            {/* SEARCH RESULTS DROPDOWN */}
                            {companyResults.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden max-h-48 overflow-y-auto">
                                    {companyResults.map(c => (
                                        <div 
                                            key={c.id} 
                                            onClick={() => selectCompany(c)}
                                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 text-sm"
                                        >
                                            <p className="font-bold text-gray-900">{c.name}</p>
                                            <p className="text-xs text-gray-500">{c.industry} • {c.location}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {selectedCompany && (
                            <div className="mt-3 inline-flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-md text-sm font-medium border border-green-200">
                                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                                Linked to {selectedCompany.name}
                            </div>
                        )}

                        {!selectedCompany && !creatingCompany && (
                            <button 
                                onClick={() => setCreatingCompany(true)}
                                className="mt-3 text-sm text-[#7A8B6A] font-bold hover:underline"
                            >
                                + Can't find your company? Create a new one.
                            </button>
                        )}
                        
                        {selectedCompany && !creatingCompany && (
                             <button 
                                onClick={() => {
                                    setSelectedCompany(null);
                                    setForm(f => ({ ...f, companyId: null }));
                                    setCompanySearch("");
                                }}
                                className="mt-3 ml-4 text-sm text-gray-500 font-bold hover:underline"
                             >
                                 Change Company
                             </button>
                        )}

                        {/* CREATE COMPANY INLINE FORM */}
                        {creatingCompany && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mt-4 bg-gray-50 border border-gray-200 p-5 rounded-xl space-y-4"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-sm font-bold text-gray-900">Add New Company</h3>
                                    <button onClick={() => setCreatingCompany(false)} className="text-gray-400 hover:text-gray-600 text-sm font-bold">✕ Cancel</button>
                                </div>
                                
                                <input className={inputClass} placeholder="Company Name *"
                                    value={newCompany.name}
                                    onChange={e => setNewCompany(c => ({ ...c, name: e.target.value }))} />
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input className={inputClass} placeholder="Industry (e.g. IT, Finance)"
                                        value={newCompany.industry}
                                        onChange={e => setNewCompany(c => ({ ...c, industry: e.target.value }))} />
                                    <input className={inputClass} placeholder="Headquarters Location"
                                        value={newCompany.location}
                                        onChange={e => setNewCompany(c => ({ ...c, location: e.target.value }))} />
                                </div>
                                
                                <input className={inputClass} placeholder="Website URL" type="url"
                                    value={newCompany.websiteUrl}
                                    onChange={e => setNewCompany(c => ({ ...c, websiteUrl: e.target.value }))} />
                                
                                <textarea className={`${inputClass} resize-none`} placeholder="Brief description of the company..." rows="2"
                                    value={newCompany.description}
                                    onChange={e => setNewCompany(c => ({ ...c, description: e.target.value }))} />
                                
                                <button 
                                    onClick={handleCreateCompany} 
                                    disabled={!newCompany.name}
                                    className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-2.5 rounded-lg text-sm transition disabled:opacity-50"
                                >
                                    Register Company
                                </button>
                            </motion.div>
                        )}
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                            ⚠ {error}
                        </div>
                    )}

                    <button 
                        onClick={handleSubmit} 
                        disabled={loading} 
                        className="w-full bg-[#7A8B6A] hover:bg-[#6c7d5c] disabled:opacity-70 text-white py-3.5 rounded-lg font-bold transition mt-8"
                    >
                        {loading ? "Saving Profile..." : "Save Profile & Continue →"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}