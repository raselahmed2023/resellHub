"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  ChevronDown,
  LayoutDashboard,
  Leaf,
  LogOut,
  Menu,
  MessageCircleMore,
  Package,
  ShoppingBag,
  User,
  X,
} from "lucide-react";

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
  {
    label: "Student Zone",
    href: "/student-zone",
  },
  {
    label: "Community Pickup",
    href: "/community-pickup",
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
      icon: User,
    },
    {
      label: "My Orders",
      href: "/dashboard/buyer/orders",
      icon: ShoppingBag,
    },
    {
      label: "Wishlist",
      href: "/dashboard/buyer/wishlist",
      icon: Package,
    },
  ],

  seller: [
    {
      label: "My Profile",
      href: "/dashboard/seller/profile",
      icon: User,
    },
    {
      label: "My Products",
      href: "/dashboard/seller/my-products",
      icon: Package,
    },
    {
      label: "Manage Orders",
      href: "/dashboard/seller/manage-orders",
      icon: ShoppingBag,
    },
  ],

  admin: [
    {
      label: "Manage Users",
      href: "/dashboard/admin/users",
      icon: User,
    },
    {
      label: "Manage Products",
      href: "/dashboard/admin/products",
      icon: Package,
    },
    {
      label: "Manage Orders",
      href: "/dashboard/admin/orders",
      icon: ShoppingBag,
    },
  ],
};

const COMMON_ACCOUNT_LINKS = [
  {
    label: "Messages",
    href: "/dashboard/messages",
    icon: MessageCircleMore,
  },
  {
    label: "Eco Impact",
    href: "/dashboard/impact",
    icon: Leaf,
  },
];

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

  const userLinks = validRole
    ? ROLE_LINKS[role]
    : [];

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

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

    return user.name
      .charAt(0)
      .toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="flex h-[70px] items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center"
          >
            <span className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
              Re
              <span className="text-emerald-600">
                Sell
              </span>
              Hub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {PUBLIC_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
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
          <div className="hidden items-center gap-3 lg:flex">

            {isPending ? (
              <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />
            ) : user ? (

              <div
                ref={profileRef}
                className="relative"
              >
                <button
                  type="button"
                  onClick={() =>
                    setProfileOpen(
                      (prev) => !prev
                    )
                  }
                  className="flex items-center gap-2 rounded-xl border border-transparent px-2 py-1.5 transition hover:border-slate-100 hover:bg-slate-50"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-emerald-100"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-black text-white">
                      {getInitial()}
                    </div>
                  )}

                  <div className="hidden text-left xl:block">
                    <p className="max-w-[130px] truncate text-sm font-black text-slate-800">
                      {user.name || "User"}
                    </p>

                    {validRole && (
                      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                        {role}
                      </p>
                    )}
                  </div>

                  <ChevronDown
                    size={15}
                    className={`text-slate-400 transition-transform ${
                      profileOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-[270px] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.14)]">

                    {/* User */}
                    <div className="border-b border-slate-100 px-4 py-4">
                      <p className="truncate text-sm font-black text-slate-900">
                        {user.name || "User"}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-400">
                        {user.email}
                      </p>
                    </div>

                    <div className="p-2">

                      {/* Dashboard */}
                      <DropdownLink
                        href={dashboardHref}
                        icon={LayoutDashboard}
                        label="Dashboard"
                      />

                      {/* Messages + Impact */}
                      {COMMON_ACCOUNT_LINKS.map(
                        (item) => (
                          <DropdownLink
                            key={item.href}
                            href={item.href}
                            icon={item.icon}
                            label={item.label}
                          />
                        )
                      )}

                      <div className="my-2 h-px bg-slate-100" />

                      {/* Role-specific links */}
                      {userLinks.map((item) => (
                        <DropdownLink
                          key={item.href}
                          href={item.href}
                          icon={item.icon}
                          label={item.label}
                        />
                      ))}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-slate-100 p-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-red-500 transition hover:bg-red-50"
                      >
                        <LogOut size={17} />

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
                  className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-emerald-700"
                >
                  Join ReSellHub
                </Link>
              </>
            )}
          </div>

          {/* Mobile Button */}
          <button
            type="button"
            onClick={() =>
              setMobileOpen(
                (prev) => !prev
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 lg:hidden"
          >
            {mobileOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white lg:hidden">

          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">

            {PUBLIC_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-xl px-3 py-3 text-sm font-bold ${
                  isActive(item.href)
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {user ? (
              <div className="mt-4 border-t border-slate-100 pt-4">

                <div className="mb-3 px-3">
                  <p className="text-sm font-black text-slate-900">
                    {user.name || "User"}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-400">
                    {user.email}
                  </p>
                </div>

                <MobileAccountLink
                  href={dashboardHref}
                  icon={LayoutDashboard}
                  label="Dashboard"
                />

                {COMMON_ACCOUNT_LINKS.map(
                  (item) => (
                    <MobileAccountLink
                      key={item.href}
                      href={item.href}
                      icon={item.icon}
                      label={item.label}
                    />
                  )
                )}

                {userLinks.map((item) => (
                  <MobileAccountLink
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                  />
                ))}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-red-500 hover:bg-red-50"
                >
                  <LogOut size={17} />

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
                  className="flex h-11 items-center justify-center rounded-xl bg-emerald-600 text-sm font-black text-white"
                >
                  Register
                </Link>

              </div>
            )}

          </div>
        </div>
      )}
    </nav>
  );
}

function DropdownLink({
  href,
  icon: Icon,
  label,
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
    >
      <Icon size={17} />

      {label}
    </Link>
  );
}

function MobileAccountLink({
  href,
  icon: Icon,
  label,
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
    >
      <Icon size={17} />

      {label}
    </Link>
  );
}