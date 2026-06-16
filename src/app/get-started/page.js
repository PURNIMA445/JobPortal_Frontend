"use client"
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { signupUser } from "@/lib/api";


export default function SignupPage() {
  const [role, setRole] = useState("seeker");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", company: "" });
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fields = [
    
    // ...(role === "recruiter" ? [{
    //   key: "company",
    //   label: "Company name",
    //   placeholder: "Acme Inc.",
    //   type: "text",
    //   icon: (
    //     <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    //       <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    //     </svg>
    //   ),
    // }] : []),
    {
      key: "email",
      label: "Email address",
      placeholder: "you@example.com",
      type: "email",
      icon: (
        <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];
  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    // map frontend role values to backend enum values
    const roleMap = {
      seeker: "CANDIDATE",
      recruiter: "RECRUITER",
    };

    try {
      const data = await signupUser({
        email: form.email,
        password: form.password,
        role: roleMap[role],
      });

   
      router.push("/login");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex">
      {/* ── Left: form panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-rose-400 to-pink-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-800">hirespark</span>
          </Link>

          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-3xl font-black text-slate-800 mb-1.5">Create your account</h1>
            <p className="text-slate-500 text-sm">
              Already have one?{" "}
              <Link href="/login" className="text-rose-500 font-semibold hover:text-rose-600 transition-colors">
                Log in
              </Link>
            </p>
          </div>

          {/* Role selector */}
          <div className="bg-slate-100 rounded-2xl p-1.5 flex gap-1.5 mb-7">
            {[
              { value: "seeker", label: "👤 I'm a Job Seeker" },
              { value: "recruiter", label: "🏢 I'm a Recruiter" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRole(opt.value)}
                className={`relative flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 ${role === opt.value ? "text-white" : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                {role === opt.value && (
                  <motion.div
                    layoutId="role-pill"
                    className="absolute inset-0 bg-linear-to-r from-rose-400 to-pink-500 rounded-xl shadow-md"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{opt.label}</span>
              </button>
            ))}
          </div>

          {/* Social login */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              {
                name: "Google", icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                )
              },
              {
                name: "GitHub", icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" /></svg>
                )
              },
            ].map(({ name, icon }) => (
              <motion.button
                key={name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium py-2.5 rounded-xl transition-all duration-150"
              >
                {icon} {name}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400 font-medium">or with email</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Fields — animate on role switch */}
          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {fields.map(({ key, label, placeholder, type, icon }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">{label}</label>
                  <div
                    className="flex items-center gap-3 border-2 rounded-xl px-4 py-3 bg-white transition-colors duration-150"
                    style={{ borderColor: focused === key ? "#fb7185" : "#e2e8f0" }}
                  >
                    {icon}
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={set(key)}
                      onFocus={() => setFocused(key)}
                      onBlur={() => setFocused(null)}
                      className="flex-1 text-sm text-slate-700 placeholder-slate-400 outline-none bg-transparent"
                    />
                  </div>
                </div>
              ))}

              {/* Password */}
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Password</label>
                <div
                  className="flex items-center gap-3 border-2 rounded-xl px-4 py-3 bg-white transition-colors duration-150"
                  style={{ borderColor: focused === "password" ? "#fb7185" : "#e2e8f0" }}
                >
                  <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={set("password")}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    className="flex-1 text-sm text-slate-700 placeholder-slate-400 outline-none bg-transparent"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-slate-600 transition-colors">
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Password strength */}
                {form.password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex gap-1.5"
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor:
                            form.password.length >= n * 3
                              ? n <= 1 ? "#fb7185" : n <= 2 ? "#fbbf24" : n <= 3 ? "#34d399" : "#10b981"
                              : "#e2e8f0",
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 pt-1">
                <input type="checkbox" id="terms" className="w-4 h-4 mt-0.5 rounded border-slate-300 accent-rose-500 cursor-pointer shrink-0" />
                <label htmlFor="terms" className="text-xs text-slate-500 cursor-pointer leading-relaxed">
                  I agree to hirespark's{" "}
                  <a href="#" className="text-rose-500 hover:text-rose-600 font-medium">Terms of Service</a>{" "}
                  and{" "}
                  <a href="#" className="text-rose-500 hover:text-rose-600 font-medium">Privacy Policy</a>
                </label>
              </div>
              {error && (
                <p className="text-sm text-red-500 text-center -mb-2">{error}</p>
              )}
              {/* CTA */}
              <motion.button
                onClick={handleSubmit}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.97 }}
                className="w-full bg-linear-to-r from-rose-400 to-pink-500 ... mt-1"
              >
                {loading
                  ? "Creating account..."
                  : role === "seeker"
                    ? "Create my account →"
                    : "Start hiring today →"}
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>


    </div>
  );
}