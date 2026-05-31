"use client"
import { usePathname } from "next/navigation"
import { useState } from "react"
import Link from "next/link"

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname()
    return (

        <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-rose-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-xl bg-linear-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-slate-800 tracking-tight">
                            hire<span className="text-rose-500">spark</span>
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {[
                            { href: "/explore", label: "Explore" },
                            { href: "/how-it-work", label: "How It Works" },
                            { href: "/seekers", label: "Seekers" },
                            { href: "/recruiters", label: "Recruiters" },
                        ].map(({ href, label }) => {
                            const cleanPathname = pathname.replace(/\/$/, "");
                            const cleanHref = href.replace(/\/$/, "");

                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`inline-block text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200
          ${cleanPathname === cleanHref ? 'bg-rose-500 text-white' : 'text-slate-600 hover:text-rose-500 hover:bg-rose-50'}`}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href="/login"
                            className="text-sm font-medium text-slate-600 hover:text-rose-500 transition-colors duration-200 px-3 py-2"
                        >
                            Log in
                        </Link>
                        <Link
                            href="/get-started"
                            className="text-sm font-semibold text-white bg-linear-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            Sign up
                        </Link>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden p-2 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-rose-50 transition-colors duration-200"
                    >
                        {menuOpen ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-white border-t border-rose-100 px-4 pt-2 pb-4 space-y-1">
                    {[
                        { href: "/explore", label: "Explore" },
                        { href: "/how-it-work", label: "How It Works" },
                        { href: "/seekers", label: "Seekers" },
                        { href: "/recruiters", label: "Recruiters" },
                    ].map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setMenuOpen(false)}
                            className="block text-sm font-medium text-slate-600 hover:text-rose-500 hover:bg-rose-50 px-3 py-2.5 rounded-lg transition-colors duration-200"
                        >
                            {label}
                        </Link>
                    ))}
                    <div className="border-t border-rose-50 pt-3 mt-3 flex flex-col gap-2">
                        <Link
                            href="/login"
                            onClick={() => setMenuOpen(false)}
                            className="text-center text-sm font-medium text-slate-600 border border-rose-100 hover:bg-rose-50 hover:text-rose-500 py-2 rounded-xl transition-colors duration-200"
                        >
                            Log in
                        </Link>
                        <Link
                            href="/get-started"
                            onClick={() => setMenuOpen(false)}
                            className="text-center text-sm font-semibold text-white bg-linear-to-r from-rose-400 to-pink-500 py-2.5 rounded-xl"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;