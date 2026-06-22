// app/login/page.jsx
// ✅ Static page — dynamic logic pore add korba (Better Auth)

import Link from "next/link";

export const metadata = {
  title: "Login | ReSell Hub",
  description: "Login to your ReSell Hub account",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* ─────────────────────────────────────
          LEFT — Login Form
      ───────────────────────────────────── */}
      <div className="flex items-center justify-center px-6 py-12 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="w-full max-w-md flex flex-col gap-7">

          {/* Heading */}
          <div className="flex flex-col gap-1.5">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-500">
              Continue your journey in the{" "}
              <span className="text-emerald-600 font-medium">circular economy.</span>
            </p>
          </div>

          {/* Google button */}
          <button className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm py-3 rounded-lg transition-colors shadow-sm">
            {/* Google G logo */}
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Login with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <div className="flex flex-col gap-5">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white placeholder:text-gray-400 transition"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white placeholder:text-gray-400 transition pr-11"
                />
                {/* Eye icon toggle — pore dynamic korba */}
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 rounded-lg transition-colors text-sm shadow-sm mt-1">
              Login to Account
            </button>

          </div>

          {/* Register link */}
          <p className="text-center text-sm text-gray-500">
            New to ReSell Hub?{" "}
            <Link
              href="/register"
              className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Register
            </Link>
          </p>

        </div>
      </div>

      {/* ─────────────────────────────────────
          RIGHT — Visual panel
      ───────────────────────────────────── */}
      <div className="hidden lg:block relative overflow-hidden">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&auto=format&fit=crop"
          alt="Second hand marketplace"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-emerald-900/40" />

        {/* Floating card */}
        <div className="absolute inset-0 flex items-center justify-center p-10">
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-8 max-w-sm w-full shadow-2xl text-white flex flex-col gap-5">

            {/* Leaf icon */}
            <div className="w-10 h-10 rounded-full bg-emerald-500/80 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 3-15 12l.84-2.9C11.47 9.08 17 8 17 8z"/>
              </svg>
            </div>

            {/* Heading */}
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold leading-snug">
                Giving products a second life.
              </h2>
              <p className="text-sm text-white/80 leading-relaxed">
                Join over 500,000 eco-conscious sellers and buyers who are reducing waste and building a sustainable future together.
              </p>
            </div>

            {/* Trusted by */}
            <div className="flex items-center gap-3 mt-1">
              {/* Avatar stack */}
              <div className="flex -space-x-2">
                {["bg-emerald-400", "bg-teal-500", "bg-gray-600"].map((color, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full ${color} border-2 border-white/60 flex items-center justify-center text-xs text-white font-bold`}
                  >
                    {["A", "B", "C"][i]}
                  </div>
                ))}
              </div>
              <span className="text-sm text-white/90 font-medium">
                Trusted by the community
              </span>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}