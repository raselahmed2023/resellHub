import { cookies } from "next/headers";
import Link from "next/link";
import Sidebar from "@/components/dashboard/Sidebar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();

  const allCookies = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  let session = null;

  const authBaseURL =
    process.env.NEXT_PUBLIC_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://resell-hub-rho.vercel.app";

  try {
    const res = await fetch(`${authBaseURL}/api/auth/get-session`, {
      headers: {
        cookie: allCookies,
      },
      cache: "no-store",
    });

    if (res.ok) {
      session = await res.json();
    }
  } catch (err) {
    console.log(err);
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 p-8 text-center">
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
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      <Sidebar role={session.user.role || "buyer"} user={session.user} />

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}