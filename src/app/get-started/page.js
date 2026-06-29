"use client";
import { signupUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// --- FIREBASE IMPORTS ---
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "@/lib/firebase";

const EmailIcon = () => (
  <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LogoIcon = () => (
  <svg width="28" height="32" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2 C10 2 7 6 7 11 C7 16 10 20 14 24 C18 20 21 16 21 11 C21 6 18 2 14 2Z" fill="#C8A96E" />
    <path d="M14 2 C13 2 11 6 11 11 C11 16 13 20 14 24 C15 20 17 16 17 11 C17 6 15 2 14 2Z" fill="#E8C98E" opacity="0.5" />
    <path d="M10 9 C6 7 3 9 4 13 C5 16 8 17 12 16" fill="none" stroke="#8FA07F" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M9 9 C7 6 4 4 3 7 C2 10 4 13 8 14" fill="#8FA07F" opacity="0.7" />
    <path d="M18 9 C22 7 25 9 24 13 C23 16 20 17 16 16" fill="none" stroke="#8FA07F" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M19 9 C21 6 24 4 25 7 C26 10 24 13 20 14" fill="#8FA07F" opacity="0.7" />
  </svg>
);

export default function SignupPage() {
  const router = useRouter();
  
  const [role, setRole] = useState("CANDIDATE"); 
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add loginUser to your imports at the top:
// import { signupUser, loginUser } from "@/lib/api";

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const payload = {
      email: form.email,
      password: form.password,
      role: role,
    };

    await signupUser(payload);

    router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);

  } catch (err) {
    setError(err.message || "Signup failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

  // --- SOCIAL LOGIN LOGIC ---
  const handleSocialLogin = async (provider) => {
    if (provider === "Google" || provider === "GitHub") {
      try {
        const authProvider = provider === "Google" ? googleProvider : githubProvider;
        const result = await signInWithPopup(auth, authProvider);
        const token = await result.user.getIdToken();
        
        const endpoint = provider === "Google" ? "http://localhost:8080/api/auth/google" : "http://localhost:8080/api/auth/github";
        
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            token: token,
            role: role // Send the currently selected role tab
          }),
        });

        if (!res.ok) throw new Error("Backend authentication failed");

        const data = await res.json();
        
        // Save the tokens so the Header and protected routes know the user is logged in
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role || role);
        // Add the cookie here as well so your middleware doesn't block them!
        document.cookie = `token=${data.token}; path=/; max-age=86400`;
        
        // --- SMART REDIRECT BASED ON ROLE ---
        const userRole = data.role || role;
        
        if (userRole === "RECRUITER") {
            window.location.href = "/recruiter/setup";
        } else if (userRole === "CANDIDATE") {
            window.location.href = "/profile/setup";
        } else {
            window.location.href = "/";
        }

      } catch (err) {
        console.error(`${provider} login error:`, err);
        setError(`Failed to sign in with ${provider}. ` + err.message);
      }
    } else {
      alert(`${provider} is not set up yet!`);
    }
  };

  return (
    <div className="min-h-screen flex font-sans text-gray-800 bg-white">
      {/* ───────── LEFT PANEL ───────── */}
      <div className="hidden lg:flex w-[40%] bg-[#F5F2EB] flex-col justify-between p-12 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-16 w-max">
            <LogoIcon />
            <div>
              <h1 className="font-serif text-2xl font-bold text-gray-900 leading-tight">
                सीपसेतु
              </h1>
            </div>
          </Link>

          <h2 className="text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
            Find work <br /> that feels <br /> like you.
          </h2>
          <div className="w-12 h-1 bg-[#7A8B6A] mb-6"></div>
          <p className="text-gray-700 text-lg mb-2">Meaningful work. Better future.</p>
          <p className="text-gray-600 max-w-sm">
            We connect talent with opportunities that truly fit.
          </p>
        </motion.div>

        {/* SVG Illustration */}
        <div className="absolute bottom-0 left-0 w-full h-[60%] pointer-events-none">
          <svg viewBox="0 0 500 400" className="w-full h-full object-cover" preserveAspectRatio="xMidYMax slice">
            <path d="M 100 150 Q 130 130 160 150 Q 190 130 220 150" stroke="#FFF" strokeWidth="20" strokeLinecap="round" opacity="0.5" fill="none" />
            <path d="M 350 180 Q 380 160 410 180 Q 440 160 470 180" stroke="#FFF" strokeWidth="15" strokeLinecap="round" opacity="0.5" fill="none" />
            <path d="M 0 300 Q 150 200 300 280 T 550 250 L 550 400 L 0 400 Z" fill="#C5D3BA" opacity="0.6" />
            <path d="M -50 350 Q 100 250 250 320 T 600 280 L 600 400 L -50 400 Z" fill="#A7B99A" opacity="0.8" />
            <path d="M -100 400 Q 100 300 250 380 T 600 330 L 600 450 L -100 450 Z" fill="#8C9E7D" />
            <g transform="translate(180, 100)">
              <path d="M 20 0 C 40 0 50 20 50 40 C 50 65 30 80 25 90 L 15 90 C 10 80 -10 65 -10 40 C -10 20 0 0 20 0 Z" fill="#F4D090" />
              <path d="M 20 0 C 30 0 35 20 35 40 C 35 65 25 80 22 90 L 18 90 C 15 80 5 65 5 40 C 5 20 10 0 20 0 Z" fill="#FFF" opacity="0.4" />
              <rect x="15" y="95" width="10" height="10" fill="#8C6E52" rx="2" />
              <line x1="17" y1="90" x2="16" y2="95" stroke="#4A3F35" strokeWidth="1" />
              <line x1="23" y1="90" x2="24" y2="95" stroke="#4A3F35" strokeWidth="1" />
              <path d="M80 140 Q120 120 160 140 Q200 120 240 140" stroke="#6E5F4D" strokeWidth="2" opacity="0.25" fill="none" />
              <path d="M280 170 Q320 150 360 170 Q400 150 440 170" stroke="#6E5F4D" strokeWidth="2" opacity="0.25" fill="none" />
            </g>
          </svg>
        </div>
      </div>
      
      {/* ───────── RIGHT PANEL ───────── */}
      <div className="w-full lg:w-[60%] flex items-center justify-center p-8 sm:p-12 relative overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
            Create your account
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Join Smart Job Portal and take the next step in your career.
          </p>

          {/* Role Toggle */}
          <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200 mb-8">
            {[
              { value: "CANDIDATE", label: "Job Seeker" },
              { value: "RECRUITER", label: "Recruiter" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRole(opt.value)}
                className={`relative flex-1 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  role === opt.value ? "text-[#7A8B6A]" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {role === opt.value && (
                  <motion.div
                    layoutId="role-pill"
                    className="absolute inset-0 bg-white rounded-md shadow-sm border border-gray-100"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{opt.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
                {error}
              </div>
            )}
            
            <AnimatePresence mode="wait">
              <motion.div
                key={role}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-900">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <EmailIcon />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)}
                      required
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm transition-colors outline-none
                        ${focused === "email" ? "border-[#7A8B6A] ring-1 ring-[#7A8B6A]" : "border-gray-200 focus:border-[#7A8B6A] focus:ring-1 focus:ring-[#7A8B6A]"}
                      `}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-900">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create a password"
                      value={form.password}
                      onChange={handleChange}
                      onFocus={() => setFocused("password")}
                      onBlur={() => setFocused(null)}
                      required
                      minLength={6}
                      className={`w-full pl-10 pr-10 py-2.5 border rounded-lg text-sm transition-colors outline-none
                        ${focused === "password" ? "border-[#7A8B6A] ring-1 ring-[#7A8B6A]" : "border-gray-200 focus:border-[#7A8B6A] focus:ring-1 focus:ring-[#7A8B6A]"}
                      `}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-2 pt-2">
                  <input required type="checkbox" className="mt-1 w-4 h-4 border-gray-300 rounded text-[#7A8B6A] focus:ring-[#7A8B6A] cursor-pointer" />
                  <p className="text-sm text-gray-600">
                    I agree to the <Link href="#" className="text-[#7A8B6A] hover:underline">Terms of Service</Link> and <Link href="#" className="text-[#7A8B6A] hover:underline">Privacy Policy</Link>.
                  </p>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-[#7A8B6A] hover:bg-[#6c7d5c] disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium text-sm py-3 rounded-lg shadow-sm transition-colors mt-4"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200" />
            <span className="px-3 text-sm text-gray-500 bg-white">or sign up with</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              { name: "Google", icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              )},
              { name: "GitHub", icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z"/></svg>
              )},
            ].map(({ name, icon }) => (
              <motion.button
                key={name}
                type="button"
                onClick={() => handleSocialLogin(name)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium py-2.5 rounded-lg transition-colors"
              >
                {icon} Continue with {name}
              </motion.button>
            ))}
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#7A8B6A] font-semibold hover:underline">
              Log in
            </Link>
          </p>

        </motion.div>
      </div>
    </div>
  );
}