"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";

const PUBLIC_LINKS = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Products",
    href: "/products",
  },
];

const ROLE_DASHBOARD = {
  buyer: "/dashboard/buyer",
  seller: "/dashboard/seller",
  admin: "/dashboard/admin",
};

const ROLE_LINKS = {
  buyer: [
    {
      label: "My Profile",
      href: "/dashboard/buyer/profile",
    },
    {
      label: "My Orders",
      href: "/dashboard/buyer/orders",
    },
    {
      label: "Wishlist",
      href: "/dashboard/buyer/wishlist",
    },
  ],

  seller: [
    {
      label: "My Profile",
      href: "/dashboard/seller/profile",
    },
    {
      label: "My Products",
      href: "/dashboard/seller/my-products",
    },
    {
      label: "Manage Orders",
      href: "/dashboard/seller/manage-orders",
    },
  ],

  admin: [
    {
      label: "Manage Users",
      href: "/dashboard/admin/users",
    },
    {
      label: "Manage Products",
      href: "/dashboard/admin/products",
    },
    {
      label: "Manage Orders",
      href: "/dashboard/admin/orders",
    },
  ],
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = useSession();

  const user = session?.user || null;
  const role = user?.role;

  const validRole = ["buyer", "seller", "admin"].includes(role);

  const dashboardHref = validRole
    ? ROLE_DASHBOARD[role]
    : "/dashboard";

  const userLinks = validRole ? ROLE_LINKS[role] : [];

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await signOut();

      setProfileOpen(false);
      setMobileOpen(false);

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  const getInitial = () => {
    if (!user?.name) return "U";

    return user.name.charAt(0).toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center"
          >
            <span className="text-xl font-black tracking-tight text-slate-950">
              Re
              <span className="text-emerald-600">
                Sell
              </span>
              Hub
            </span>
          </Link>

          {/* Desktop Public Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {PUBLIC_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  isActive(item.href)
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Account */}
          <div className="hidden items-center gap-3 md:flex">

            {isPending ? (
              <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200" />
            ) : user ? (

              /* Logged-in Profile Dropdown */
              <div
                ref={profileRef}
                className="relative"
              >
                <button
                  type="button"
                  onClick={() =>
                    setProfileOpen((prev) => !prev)
                  }
                  className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-emerald-100"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-sm font-black text-white">
                      {getInitial()}
                    </div>
                  )}

                  <div className="hidden text-left lg:block">
                    <p className="max-w-[130px] truncate text-sm font-bold text-slate-800">
                      {user.name || "User"}
                    </p>

                    {validRole && (
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {role}
                      </p>
                    )}
                  </div>

                  <span className="text-xs text-slate-400">
                    ▾
                  </span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-60 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">

                    {/* Account */}
                    <div className="border-b border-slate-100 px-4 py-4">
                      <p className="truncate text-sm font-black text-slate-900">
                        {user.name || "User"}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-400">
                        {user.email}
                      </p>
                    </div>

                    {/* Dashboard only exists here */}
                    <div className="p-2">
                      <Link
                        href={dashboardHref}
                        className="block rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        Dashboard
                      </Link>

                      {userLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 p-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-bold text-red-500 transition hover:bg-red-50"
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
                  className="rounded-lg px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                >
                  Join ReSellHub
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() =>
              setMobileOpen((prev) => !prev)
            }
            className="rounded-lg px-3 py-2 text-sm font-bold text-slate-700 md:hidden"
          >
            {mobileOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden">

          {PUBLIC_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-xl px-3 py-3 text-sm font-semibold ${
                isActive(item.href)
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-700"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {user ? (
            <div className="mt-3 border-t border-slate-100 pt-3">
              <div className="mb-2 px-3 py-2">
                <p className="text-sm font-black text-slate-900">
                  {user.name}
                </p>

                <p className="text-xs text-slate-400">
                  {user.email}
                </p>
              </div>

              {/* Only logged users see dashboard */}
              <Link
                href={dashboardHref}
                className="block rounded-xl px-3 py-3 text-sm font-bold text-emerald-700 hover:bg-emerald-50"
              >
                Dashboard
              </Link>

              {userLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-xl px-3 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  {item.label}
                </Link>
              ))}

              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 block w-full rounded-xl px-3 py-3 text-left text-sm font-bold text-red-500 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
              <Link
                href="/login"
                className="flex h-11 items-center justify-center rounded-xl border border-slate-200 text-sm font-bold text-slate-700"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="flex h-11 items-center justify-center rounded-xl bg-emerald-600 text-sm font-bold text-white"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}