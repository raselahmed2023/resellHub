"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";



const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Dashboard", href: "/dashboard" },
];

const DROPDOWN_ITEMS = [
  { key: "profile", label: "My Profile", href: "/dashboard" },
  { key: "orders", label: "Orders", href: "/dashboard" },
  { key: "settings", label: "Settings", href: "/dashboard" },
];



export default function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = useSession();
  const user = session?.user ?? null;


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: { onSuccess: () => router.push("/") },
    });
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* ── Logo ── */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-gray-900">
                Re<span className="text-emerald-500">Sell</span> Hub
              </span>
            </Link>
          </div>

          {/* ── Desktop Links ── */}
          <div className="hidden sm:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${pathname === href
                  ? "text-emerald-600 bg-emerald-50 font-semibold"
                  : "text-gray-600 hover:text-emerald-600 hover:bg-gray-50"
                  }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* ── Desktop Auth ── */}
          <div className="hidden sm:flex items-center gap-2">
            {isPending ? (
              // loading skeleton
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              // logged in — avatar + dropdown
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  {/* Avatar circle with initial */}
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-400 ring-offset-2" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-bold ring-2 ring-emerald-400 ring-offset-2">
                      {user.name?.charAt(0).toUpperCase() ?? "U"}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate hidden md:block">
                    {user.name?.split(" ")[0]}
                  </span>
                  {/* simple chevron text */}
                  <span className="text-gray-400 text-xs hidden md:block">▾</span>
                </button>

                {/* Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-50">
                    {/* user info */}
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>

                    {DROPDOWN_ITEMS.map(({ key, label, href }) => (
                      <Link
                        key={key}
                        href={href}
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        {label}
                      </Link>
                    ))}

                    <div className="border-t border-gray-100 mt-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // logged out
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-emerald-600 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile Toggle ── */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 text-sm font-medium"
            >
              {isMenuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {isMenuOpen && (
        <div className="sm:hidden p-4 border-t border-gray-100">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsMenuOpen(false)}
              className={`block py-3 border-b border-gray-50 text-sm font-medium transition-colors ${pathname === href ? "text-emerald-600 font-semibold" : "text-gray-700"
                }`}
            >
              {label}
            </Link>
          ))}

          {user ? (
            <>
              {/* mobile user info */}
              <div className="py-3 border-b border-gray-50">
                <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
              {DROPDOWN_ITEMS.map(({ key, label, href }) => (
                <Link
                  key={key}
                  href={href}
                  onClick={() => setIsDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >{label}</Link>
              ))}
              <button
                onClick={handleSignOut}
                className="block w-full text-left py-3 text-sm text-red-500 font-medium">Logout</button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 text-gray-700 border-b border-gray-50 text-sm"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 text-emerald-600 font-semibold text-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}