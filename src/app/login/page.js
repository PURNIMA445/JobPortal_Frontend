"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  loginUser,
  getCandidateProfile,
  getRecruiterProfile,
} from "@/lib/api";

// --- NEW FIREBASE IMPORTS ---
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- EMAIL & PASSWORD LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      if (!data?.token) throw new Error("Login failed: token not returned");

      document.cookie = `token=${data.token}; path=/; max-age=86400`;
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role || "");
      localStorage.setItem("userId", data.userId || "");

      if (data.role === "CANDIDATE") {
        try {
          await getCandidateProfile();
          window.location.href = "/dashboard/candidate";
        } catch {
          window.location.href = "/profile/setup";
        }
      } else if (data.role === "RECRUITER") {
        try {
          await getRecruiterProfile();
          window.location.href = "/dashboard/recruiter";
        } catch {
          window.location.href = "/recruiter/setup";
        }
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      if (err.status === 403 && err.email) {
        router.push(`/verify-email?email=${encodeURIComponent(err.email)}`);
      } else {
        setError(err?.message || "Login failed");
      }
    }finally {
      setLoading(false);
    }
  };

  // --- SOCIAL LOGIN LOGIC ---
  const handleSocialLogin = async (provider) => {
    if (provider === "Google" || provider === "GitHub") {
      try {
        setError(null);
        setLoading(true);
        
        // 1. Trigger Firebase Popup
        const authProvider = provider === "Google" ? googleProvider : githubProvider;
        const result = await signInWithPopup(auth, authProvider);
        const token = await result.user.getIdToken();
        
        // 2. Send token to Spring Boot backend
        const endpoint = provider === "Google" ? "http://localhost:8080/api/auth/google" : "http://localhost:8080/api/auth/github";
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            token: token,
            role: null // We pass null because existing users already have a role in the DB
          }),
        });

        if (!res.ok) throw new Error("Backend authentication failed");

        const data = await res.json();
        
        // 3. Save tokens and cookies
        document.cookie = `token=${data.token}; path=/; max-age=86400`;
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role || "");
        localStorage.setItem("userId", data.userId || "");
        
        // 4. Smart Redirect based on existing profile check
        if (data.role === "CANDIDATE") {
          try {
            await getCandidateProfile();
            window.location.href = "/dashboard/candidate";
          } catch {
            window.location.href = "/profile/setup";
          }
        } else if (data.role === "RECRUITER") {
          try {
            await getRecruiterProfile();
            window.location.href = "/dashboard/recruiter";
          } catch {
            window.location.href = "/recruiter/setup";
          }
        } else {
          window.location.href = "/";
        }

      } catch (err) {
        console.error(`${provider} login error:`, err);
        setError(`Failed to sign in with ${provider}. ` + err.message);
      } finally {
        setLoading(false);
      }
    } else {
      alert(`${provider} is not set up yet!`);
    }
  };

  return (
    <div className="min-h-screen flex font-sans text-gray-800 bg-white">

      {/* ───────── LEFT PANEL (FULL WORTHY JORDAN STYLE) ───────── */}
      <div className="hidden lg:flex w-[40%] bg-[#F5F2EB] flex-col justify-between p-12 relative overflow-hidden">

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-16 w-max">
            <svg width="28" height="32" viewBox="0 0 28 32" fill="none">
              <path d="M14 2C10 2 7 6 7 11C7 16 10 20 14 24C18 20 21 16 21 11C21 6 18 2 14 2Z" fill="#C8A96E" />
              <path d="M14 2C13 2 11 6 11 11C11 16 13 20 14 24C15 20 17 16 17 11C17 6 15 2 14 2Z" fill="#E8C98E" opacity="0.5" />
            </svg>

            <div>
              <h1 className="font-serif text-2xl font-bold text-gray-900">
                सीपसेतु
              </h1>
            </div>
          </Link>

          <h2 className="text-5xl font-serif font-bold text-gray-900 leading-tight mb-6">
            Welcome <br /> back.
          </h2>

          <div className="w-12 h-1 bg-[#7A8B6A] mb-6" />

          <p className="text-gray-700 text-lg mb-2">
            Continue your journey.
          </p>

          <p className="text-gray-600 max-w-sm">
            Sign in to access your dashboard and opportunities tailored for you.
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
            </g>
          </svg>
        </div>
      </div>

      {/* ───────── RIGHT PANEL ───────── */}
      <div className="w-full lg:w-[60%] flex items-center justify-center p-8 sm:p-12">

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >

          {/* Header */}
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
            Sign in
          </h1>

          <p className="text-sm text-gray-500 mb-8">
            Don’t have an account?{" "}
            <Link href="/get-started" className="text-[#7A8B6A] font-semibold hover:underline">
              Sign up free
            </Link>
          </p>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { name: "Google", icon: (
                <svg className="w-4 h-4 mr-2 inline-block" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              )},
              { name: "GitHub", icon: (
                <svg className="w-4 h-4 mr-2 inline-block" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z"/></svg>
              )},
            ].map(({ name, icon }) => (
              <button
                key={name}
                type="button"
                onClick={() => handleSocialLogin(name)}
                className="border border-gray-200 hover:bg-gray-50 text-sm py-3 rounded-lg transition-colors"
              >
                {icon} Continue with {name}
              </button>
            ))}
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-100">
              ⚠ {error}
            </div>
          )}

          {/* ───────── FORM (UNCHANGED LOGIC) ───────── */}
          <form className="space-y-4" onSubmit={handleLogin}>

            {/* EMAIL */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wide">
                Email Address
              </label>

              <div
                className="border-2 border-gray-800 bg-white px-3 py-2 mt-1 flex items-center transition-all duration-200"
                style={{
                  boxShadow:
                    focused === "email" ? "4px 4px 0 #7A8B6A" : "none",
                }}
              >
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  className="w-full outline-none bg-transparent text-sm"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wide">
                  Password
                </label>

                <Link href="/forgot-password" className="text-xs text-[#7A8B6A] hover:underline">
                  Forgot?
                </Link>
              </div>

              <div
                className="border-2 border-gray-800 bg-white px-3 py-2 flex items-center transition-all duration-200"
                style={{
                  boxShadow:
                    focused === "password" ? "4px 4px 0 #7A8B6A" : "none",
                }}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  className="flex-1 outline-none bg-transparent text-sm"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-[#7A8B6A] font-bold outline-none"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* CHECKBOX */}
            <div className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="accent-[#7A8B6A] w-4 h-4" />
              <span className="text-gray-600">Keep me signed in</span>
            </div>

            {/* BUTTON */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-[#7A8B6A] hover:bg-[#6A7B5C] text-white py-3 font-bold rounded-lg transition-colors"
            >
              {loading ? "Logging in..." : "LOG IN"}
            </motion.button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            By continuing, you accept Terms & Privacy Policy.
          </p>

        </motion.div>
      </div>
    </div>
  );
}