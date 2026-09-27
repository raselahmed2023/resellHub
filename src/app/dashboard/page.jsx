"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "@/lib/auth-client";

const DASHBOARD_ROUTES = {
  buyer: "/dashboard/buyer",
  seller: "/dashboard/seller",
  admin: "/dashboard/admin",
};

export default function DashboardPage() {
  const {
    data: session,
    isPending,
  } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (isPending) return;

    const user = session?.user;

    /*
     * Not logged in.
     */
    if (!user) {
      return;
    }

    /*
     * Blocked user should not
     * access the dashboard.
     */
    if (user.status === "blocked") {
      const handleBlockedUser = async () => {
        try {
          await signOut();
        } catch (error) {
          console.error(
            "Blocked user sign out error:",
            error
          );
        }

        router.replace(
          "/login?error=account-blocked"
        );
      };

      handleBlockedUser();

      return;
    }

    /*
     * IMPORTANT:
     * Never default an unknown role
     * to buyer.
     *
     * Only trusted roles get a
     * dashboard destination.
     */
    const dashboardPath =
      DASHBOARD_ROUTES[user.role];

    if (!dashboardPath) {
      console.error(
        "Invalid or missing user role:",
        user.role
      );

      return;
    }

    router.replace(dashboardPath);
  }, [
    session,
    isPending,
    router,
  ]);

  /*
   * Better Auth is still loading.
   */
  if (isPending) {
    return (
      <LoadingScreen
        text="Loading dashboard..."
      />
    );
  }

  /*
   * No authenticated user.
   */
  if (!session?.user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200 p-8 text-center shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 flex items-center justify-center">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#059669"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21a8 8 0 0 0-16 0" />
              <circle
                cx="12"
                cy="7"
                r="4"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-black text-gray-900 mt-5">
            Please login first
          </h1>

          <p className="text-sm text-gray-500 mt-3 leading-relaxed">
            You need to sign in to access your ReSellHub dashboard.
          </p>

          <Link
            href="/login?callbackURL=/dashboard"
            className="mt-6 inline-flex h-11 px-6 rounded-xl bg-emerald-600 text-white text-sm font-bold items-center justify-center hover:bg-emerald-700 transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  /*
   * Blocked account while
   * sign-out is processing.
   */
  if (
    session.user.status ===
    "blocked"
  ) {
    return (
      <LoadingScreen
        text="Signing you out..."
      />
    );
  }

  /*
   * Role exists and redirect
   * is taking place.
   */
  if (
    DASHBOARD_ROUTES[
      session.user.role
    ]
  ) {
    return (
      <LoadingScreen
        text="Opening your dashboard..."
      />
    );
  }

  /*
   * Invalid / missing role.
   *
   * Do NOT silently treat this
   * account as a buyer.
   */
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200 p-8 text-center shadow-sm">
        <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 flex items-center justify-center">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#d97706"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
            />

            <line
              x1="12"
              y1="8"
              x2="12"
              y2="12"
            />

            <line
              x1="12"
              y1="16"
              x2="12.01"
              y2="16"
            />
          </svg>
        </div>

        <h1 className="text-xl font-black text-gray-900 mt-5">
          Account setup incomplete
        </h1>

        <p className="text-sm text-gray-500 mt-3 leading-relaxed">
          We could not determine whether this account is a Buyer or Seller.
          Please sign out and complete your account setup again.
        </p>

        <button
          type="button"
          onClick={async () => {
            try {
              await signOut();
            } finally {
              router.replace(
                "/register"
              );
            }
          }}
          className="mt-6 w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition"
        >
          Complete Account Setup
        </button>
      </div>
    </div>
  );
}

function LoadingScreen({
  text,
}) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />

      <p className="text-sm font-semibold text-gray-500">
        {text}
      </p>
    </div>
  );
}