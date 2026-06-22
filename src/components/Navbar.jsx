"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Home",       href: "/" },
  { label: "Products",   href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Dashboard",  href: "/dashboard" },
];

export default function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              
              <span className="font-extrabold text-lg text-gray-900">
                Re<span className="text-emerald-500">Sell</span> Hub
              </span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden sm:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  pathname === href
                    ? "text-emerald-600 bg-emerald-50 font-semibold"
                    : "text-gray-600 hover:text-emerald-600 hover:bg-gray-50"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            
            <Link href="/login" className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-md">
              Login
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="sm:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
              {isMenuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden p-4 border-t border-gray-100">
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={href} href={href} className="block py-3 text-gray-700 border-b border-gray-50">
              {label}
            </Link>
          ))}
          <Link href="/login" className="block py-3 text-gray-700 border-b border-gray-50">Login</Link>
        </div>
      )}
    </nav>
  );
}