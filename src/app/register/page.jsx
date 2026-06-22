

import Link from "next/link";

export const metadata = {
  title: "Register | ReSell Hub",
  description: "Create your ReSell Hub account",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* ─────────────────────────────────────
          LEFT — Register Form
      ───────────────────────────────────── */}
      <div className="flex flex-col justify-between px-6 py-10 bg-gradient-to-br from-emerald-50 via-white to-teal-50">

      
        {/* Center: form */}
        <div className="w-full max-w-md mx-auto flex flex-col gap-6 py-8">

          {/* Heading */}
          <div className="flex flex-col gap-1.5">
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Join the{" "}
              <span className="text-emerald-600 font-medium">circular economy</span>{" "}
              and start making an impact today.
            </p>
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-4">

            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                placeholder="Jane Doe"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white placeholder:text-gray-400 transition"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                placeholder="jane@example.com"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white placeholder:text-gray-400 transition"
              />
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Location</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Dhaka, Bangladesh"
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white placeholder:text-gray-400 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white placeholder:text-gray-400 transition pr-11"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 rounded-lg transition-colors text-sm shadow-sm mt-1">
              Complete Registration
            </button>

          </div>

          {/* OR divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 uppercase tracking-wide">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google */}
          <button className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm py-3 rounded-lg transition-colors shadow-sm">
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          {/* Login link */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
              Back to Login
            </Link>
          </p>

        </div>

      </div>

      {/* ─────────────────────────────────────
          RIGHT — Choose Your Path panel
      ───────────────────────────────────── */}
      <div className="hidden lg:block relative overflow-hidden">

        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&auto=format&fit=crop"
          alt="Marketplace background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center px-12 gap-8">

          {/* Heading */}
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-gray-900">Choose Your Path</h2>
            <p className="text-sm text-gray-500">
              Tailor your{" "}
              <span className="text-emerald-600 font-medium">experience</span>{" "}
              within our{" "}
              <span className="text-orange-400 font-medium">community.</span>
            </p>
          </div>

          {/* Role cards */}
          <div className="flex flex-col gap-4">

            {/* Buyer card — selected state */}
            <div className="bg-white rounded-2xl p-5 shadow-md border-2 border-emerald-400 relative">
              {/* Check badge */}
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              {/* Cart icon */}
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 text-base">Join as Buyer</h3>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                Find high-quality pre-loved goods and support sustainable sellers.
              </p>
            </div>

            {/* Seller card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative">
              {/* Store icon */}
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-900 text-base">Join as Seller</h3>
                <span className="text-xs font-bold text-white bg-emerald-500 px-2 py-0.5 rounded-full tracking-wide">
                  ECO VERIFIED
                </span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Turn your quality items into cash and join our verified circular network.
              </p>
            </div>

          </div>

          {/* Bottom testimonial */}
          <div className="flex items-center gap-3">
            {/* Avatar stack */}
            <div className="flex -space-x-2">
              {["bg-emerald-400", "bg-teal-500"].map((color, i) => (
                <div
                  key={i}
                  className={`w-9 h-9 rounded-full ${color} border-2 border-white flex items-center justify-center text-xs text-white font-bold`}
                >
                  {["A", "B"][i]}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 italic leading-snug max-w-xs">
              "Join over 50,000+ eco-conscious members building a greener future."
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}