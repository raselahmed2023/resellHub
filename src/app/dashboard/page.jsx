"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) return;

    const role = session.user.role || "buyer";

    const timer = setTimeout(() => {
      if (role === "buyer") router.replace("/dashboard/buyer");
      else if (role === "seller") router.replace("/dashboard/seller");
      else if (role === "admin") router.replace("/dashboard/admin");
      else router.replace("/dashboard/buyer");
    }, 500);

    return () => clearTimeout(timer);
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-sm font-semibold text-gray-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center max-w-md">
          <h1 className="text-2xl font-black text-gray-900">
            Please login first
          </h1>

          <p className="text-sm text-gray-500 mt-3">
            You need to login to access your dashboard.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex h-11 px-6 rounded-xl bg-emerald-600 text-white text-sm font-bold items-center justify-center hover:bg-emerald-700 transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <p className="text-sm font-semibold text-gray-500">Redirecting...</p>
    </div>
  );
}