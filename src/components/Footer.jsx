// components/Footer.jsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-rose-600 text-white py-6 mt-12">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        {/* Logo / Brand */}
        <div className="mb-4 md:mb-0 text-lg font-bold">
          JobPortal
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row gap-4 text-sm">
          <Link href="/" className="hover:text-rose-200 transition-colors duration-300">Home</Link>
          <Link href="/explore" className="hover:text-rose-200 transition-colors duration-300">Explore</Link>
          <Link href="/about" className="hover:text-rose-200 transition-colors duration-300">About</Link>
          <Link href="/contact" className="hover:text-rose-200 transition-colors duration-300">Contact</Link>
        </div>

        {/* Social / Copyright */}
        <div className="mt-4 md:mt-0 text-xs">
          © 2026 JobPortal. All rights reserved.
        </div>
      </div>
    </footer>
  );
}