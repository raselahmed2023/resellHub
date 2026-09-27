"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import Sidebar from "@/components/dashboard/Sidebar";
import { useSession } from "@/lib/auth-client";

const DASHBOARD_HOME = {
  buyer: "/dashboard/buyer",
  seller: "/dashboard/seller",
  admin: "/dashboard/admin",
};

function getRequestedRole(pathname) {
  if (pathname.startsWith("/dashboard/admin")) {
    return "admin";
  }

  if (pathname.startsWith("/dashboard/seller")) {
    return "seller";
  }

  if (pathname.startsWith("/dashboard/buyer")) {
    return "buyer";
  }

  return null;
}

export default function DashboardLayout({ children }) {
  const {
    data: session,
    isPending,
  } = useSession();

  const router = useRouter();
  const pathname = usePathname();

  const user = session?.user;

  const actualRole = user?.role;

  const requestedRole =
    getRequestedRole(pathname);

  const validRole =
    actualRole === "buyer" ||
    actualRole === "seller" ||
    actualRole === "admin";

  const wrongDashboard =
    Boolean(
      requestedRole &&
        validRole &&
        requestedRole !== actualRole
    );

  useEffect(() => {
    if (isPending) return;

    /*
     * Not logged in
     */
    if (!user) {
      router.replace(
        `/login?callbackURL=${encodeURIComponent(pathname)}`
      );

      return;
    }

    /*
     * Blocked account
     */
    if (user.status === "blocked") {
      router.replace(
        "/login?error=account-blocked"
      );

      return;
    }

    /*
     * Invalid or missing role
     */
    if (!validRole) {
      router.replace("/dashboard");

      return;
    }

    /*
     * Example:
     *
     * buyer tries:
     * /dashboard/admin
     *
     * redirect:
     * /dashboard/buyer
     */
    if (wrongDashboard) {
      router.replace(
        DASHBOARD_HOME[actualRole]
      );
    }
  }, [
    isPending,
    user,
    actualRole,
    validRole,
    wrongDashboard,
    pathname,
    router,
  ]);

  /*
   * Session loading
   */
  if (isPending) {
    return (
      <DashboardLoading text="Checking your account..." />
    );
  }

  /*
   * Redirecting unauthenticated user
   */
  if (!user) {
    return (
      <DashboardLoading text="Redirecting to login..." />
    );
  }

  /*
   * Blocked user
   */
  if (user.status === "blocked") {
    return (
      <DashboardLoading text="Account access unavailable..." />
    );
  }

  /*
   * Role missing / invalid
   */
  if (!validRole) {
    return (
      <DashboardLoading text="Checking account setup..." />
    );
  }

  /*
   * Trying to access another role's dashboard
   */
  if (wrongDashboard) {
    return (
      <DashboardLoading text="Opening your dashboard..." />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      <Sidebar
        role={actualRole}
        user={user}
      />

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

function DashboardLoading({ text }) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />

      <p className="text-sm font-semibold text-gray-500">
        {text}
      </p>
    </div>
  );
}