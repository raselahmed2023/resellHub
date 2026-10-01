"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Dashboard", href: "/dashboard" },
];

const ROLE_LINKS = {
  buyer: [
    {
      key: "profile",
      label: "My Profile",
      href: "/dashboard/buyer/profile",
    },
    {
      key: "orders",
      label: "My Orders",
      href: "/dashboard/buyer/orders",
    },
    {
      key: "wishlist",
      label: "Wishlist",
      href: "/dashboard/buyer/wishlist",
    },
  ],

  seller: [
    {
      key: "profile",
      label: "My Profile",
      href: "/dashboard/seller/profile",
    },
    {
      key: "products",
      label: "My Products",
      href: "/dashboard/seller/my-products",
    },
    {
      key: "orders",
      label: "Manage Orders",
      href: "/dashboard/seller/manage-orders",
    },
  ],

  admin: [
    {
      key: "users",
      label: "Manage Users",
      href: "/dashboard/admin/users",
    },
    {
      key: "products",
      label: "Manage Products",
      href: "/dashboard/admin/products",
    },
    {
      key: "orders",
      label: "Manage Orders",
      href: "/dashboard/admin/orders",
    },
  ],
};

const ROLE_DASHBOARD = {
  buyer: "/dashboard/buyer",
  seller: "/dashboard/seller",
  admin: "/dashboard/admin",
};

export default function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = useSession();

  const user = session?.user || null;
  const role = user?.role;

  const validRole =
    role === "buyer" ||
    role === "seller" ||
    role === "admin";

  const dashboardHref = validRole
    ? ROLE_DASHBOARD[role]
    : "/dashboard";

  const dropdownItems = validRole
    ? ROLE_LINKS[role]
    : [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();

      setIsDropdownOpen(false);
      setIsMenuOpen(false);

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActiveLink = (href) => {
    if (href === "/") {
      return pathname === "/";
    }

    if (href === "/dashboard") {
      return pathname.startsWith("/dashboard");
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  const getNavHref = (href) => {
    if (href === "/dashboard" && user) {
      return dashboardHref;
    }

    return href;
  };

  const getInitial = () => {
    const name = user?.name?.trim();

    if (!name) return "U";

    return name.charAt(0).toUpperCase();
  };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2"
            >
              <span className="font-extrabold text-lg text-gray-900">
                Re
                <span className="text-emerald-500">
                  Sell
                </span>{" "}
                Hub
              </span>
            </Link>
          </div>

          <div className="hidden sm:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => {
              const finalHref = getNavHref(href);
              const active = isActiveLink(href);

              return (
                <Link
                  key={href}
                  href={finalHref}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? "text-emerald-600 bg-emerald-50 font-semibold"
                      : "text-gray-600 hover:text-emerald-600 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-2">
            {isPending ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              <div
                className="relative"
                ref={dropdownRef}
              >
                <button
                  type="button"
                  onClick={() =>
                    setIsDropdownOpen((prev) => !prev)
                  }
                  className="flex items-center gap-2 focus:outline-none"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-400 ring-offset-2"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-bold ring-2 ring-emerald-400 ring-offset-2">
                      {getInitial()}
                    </div>
                  )}

                  <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate hidden md:block">
                    {user.name?.split(" ")[0] || "User"}
                  </span>

                  <span className="text-gray-400 text-xs hidden md:block">
                    ▾
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {user.name || "User"}
                      </p>

                      <p className="text-xs text-gray-400 truncate">
                        {user.email || ""}
                      </p>

                      {validRole && (
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-1">
                          {role} account
                        </p>
                      )}
                    </div>

                    <Link
                      href={dashboardHref}
                      onClick={() =>
                        setIsDropdownOpen(false)
                      }
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Dashboard
                    </Link>

                    {dropdownItems.map(
                      ({ key, label, href }) => (
                        <Link
                          key={key}
                          href={href}
                          onClick={() =>
                            setIsDropdownOpen(false)
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          {label}
                        </Link>
                      )
                    )}

                    <div className="border-t border-gray-100 mt-1">
                      <button
                        type="button"
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
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-emerald-600 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
                >
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

          <div className="sm:hidden flex items-center">
            <button
              type="button"
              onClick={() =>
                setIsMenuOpen((prev) => !prev)
              }
              className="text-gray-600 text-sm font-medium"
            >
              {isMenuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden p-4 border-t border-gray-100">
          {NAV_LINKS.map(({ label, href }) => {
            const finalHref = getNavHref(href);
            const active = isActiveLink(href);

            return (
              <Link
                key={href}
                href={finalHref}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-3 border-b border-gray-50 text-sm font-medium transition-colors ${
                  active
                    ? "text-emerald-600 font-semibold"
                    : "text-gray-700"
                }`}
              >
                {label}
              </Link>
            );
          })}

          {user ? (
            <>
              <div className="py-3 border-b border-gray-50">
                <p className="text-sm font-semibold text-gray-800">
                  {user.name || "User"}
                </p>

                <p className="text-xs text-gray-400">
                  {user.email || ""}
                </p>

                {validRole && (
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-1">
                    {role} account
                  </p>
                )}
              </div>

              <Link
                href={dashboardHref}
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 border-b border-gray-50 text-sm text-gray-700 font-medium"
              >
                Dashboard
              </Link>

              {dropdownItems.map(
                ({ key, label, href }) => (
                  <Link
                    key={key}
                    href={href}
                    onClick={() =>
                      setIsMenuOpen(false)
                    }
                    className="block py-3 border-b border-gray-50 text-sm text-gray-700"
                  >
                    {label}
                  </Link>
                )
              )}

              <button
                type="button"
                onClick={handleSignOut}
                className="block w-full text-left py-3 text-sm text-red-500 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() =>
                  setIsMenuOpen(false)
                }
                className="block py-3 text-gray-700 border-b border-gray-50 text-sm"
              >
                Login
              </Link>

              <Link
                href="/register"
                onClick={() =>
                  setIsMenuOpen(false)
                }
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