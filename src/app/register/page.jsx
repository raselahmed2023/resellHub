"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, signOut, signIn } from "@/lib/auth-client";

const ROLES = [
  {
    key: "buyer",
    title: "Join as Buyer",
    desc: "Discover quality pre-owned products and give useful items a second life.",
    bg: "bg-emerald-50",
    color: "#10b981",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#10b981"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
  },
  {
    key: "seller",
    title: "Join as Seller",
    desc: "Sell products you no longer need and help keep useful items in circulation.",
    bg: "bg-teal-50",
    color: "#0d9488",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0d9488"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
];

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_AUTH_URL;

async function saveSelectedRole(role) {
  if (!API_BASE_URL) {
    throw new Error(
      "API URL is not configured. Check NEXT_PUBLIC_API_URL."
    );
  }

  const response = await fetch(
    `${API_BASE_URL.replace(/\/$/, "")}/api/users/select-role`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role,
      }),
    }
  );

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        "Account was created, but your account type could not be saved."
    );
  }

  return data;
}

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    location: "",
    password: "",
  });

  const [role, setRole] = useState("buyer");
  const [showPass, setShowPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [error, setError] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (selectedRole) => {
    if (selectedRole !== "buyer" && selectedRole !== "seller") {
      return;
    }

    setRole(selectedRole);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (role !== "buyer" && role !== "seller") {
      setError("Please select Buyer or Seller.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      /*
       * STEP 1
       * Create Better Auth account.
       *
       * IMPORTANT:
       * We DO NOT send role here.
       */
      if (!accountCreated) {
        const { error: signUpError } = await signUp.email({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          location: form.location.trim(),
        });

        if (signUpError) {
          throw new Error(
            signUpError.message ||
              "Registration failed. Please try again."
          );
        }

        /*
         * Better Auth normally creates a session
         * after successful email registration.
         *
         * Keep this state so if role saving fails,
         * clicking submit again doesn't create
         * the same account twice.
         */
        setAccountCreated(true);
      }

      /*
       * STEP 2
       * Send ONLY buyer/seller to our own
       * protected backend endpoint.
       */
      await saveSelectedRole(role);

      /*
       * STEP 3
       * Registration completed.
       *
       * Sign out so the user can log in normally.
       */
      await signOut();

      router.push("/login?registered=true");
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err?.message ||
          "Something went wrong during registration."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (role !== "buyer" && role !== "seller") {
      setError("Please select Buyer or Seller first.");
      return;
    }

    setError("");
    setGoogleLoading(true);

    try {
      /*
       * Google handles authentication first.
       *
       * After OAuth completes, user returns to
       * /auth/complete-role.
       *
       * That page will call:
       * POST /api/users/select-role
       *
       * The backend STILL decides whether
       * the requested role is allowed.
       */
      const callbackURL =
        `${window.location.origin}` +
        `/auth/complete-role?role=${encodeURIComponent(role)}`;

      const { error: googleError } = await signIn.social({
        provider: "google",
        callbackURL,
      });

      if (googleError) {
        throw new Error(
          googleError.message ||
            "Google registration failed."
        );
      }
    } catch (err) {
      console.error("Google registration error:", err);

      setError(
        err?.message ||
          "Could not continue with Google."
      );

      setGoogleLoading(false);
    }
  };

  const selectedRole =
    ROLES.find((item) => item.key === role) || ROLES[0];

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* =========================
          LEFT SIDE
      ========================== */}
      <div className="flex flex-col justify-between px-6 py-10 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="w-full max-w-md mx-auto flex flex-col gap-6 py-8">
          {/* Heading */}
          <div className="flex flex-col gap-1.5">
            <h1 className="text-3xl font-bold text-gray-900">
              Create Account
            </h1>

            <p className="text-sm text-gray-500 leading-relaxed">
              Join the{" "}
              <span className="text-emerald-600 font-medium">
                circular economy
              </span>{" "}
              and give useful products a second life.
            </p>
          </div>

          {/* =========================
              MOBILE ROLE SELECTOR

              Desktop selector is shown
              on the right panel.
          ========================== */}
          <div className="lg:hidden">
            <p className="text-sm font-semibold text-gray-800 mb-3">
              How do you want to use ReSellHub?
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ROLES.map(({ key, title, desc, icon, bg }) => {
                const active = role === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleRoleChange(key)}
                    aria-pressed={active}
                    className={`relative text-left rounded-xl p-4 border-2 transition-all bg-white ${
                      active
                        ? "border-emerald-500 shadow-sm"
                        : "border-gray-200 hover:border-emerald-200"
                    }`}
                  >
                    {active && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}

                    <div
                      className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-2`}
                    >
                      {icon}
                    </div>

                    <p className="font-semibold text-gray-900 text-sm">
                      {title}
                    </p>

                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg"
            >
              {error}

              {accountCreated && (
                <p className="text-xs mt-1.5 text-red-600">
                  Your account has already been created. Click
                  &quot;Finish Registration&quot; to retry saving your
                  Buyer/Seller choice.
                </p>
              )}
            </div>
          )}

          {/* Selected account type */}
          <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-500">
              Account type
            </span>

            <span className="text-sm font-semibold text-emerald-700">
              {role === "seller" ? "Seller" : "Buyer"}
            </span>
          </div>

          {/* =========================
              FORM
          ========================== */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                autoComplete="name"
                minLength={2}
                maxLength={100}
                disabled={loading || accountCreated}
                required
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white placeholder:text-gray-400 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                autoComplete="email"
                disabled={loading || accountCreated}
                required
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white placeholder:text-gray-400 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="location"
                className="text-sm font-medium text-gray-700"
              >
                Location
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>

                <input
                  id="location"
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Dhaka, Bangladesh"
                  autoComplete="address-level2"
                  maxLength={120}
                  disabled={loading || accountCreated}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white placeholder:text-gray-400 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  minLength={8}
                  disabled={loading || accountCreated}
                  required
                  className="w-full px-4 py-2.5 pr-14 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white placeholder:text-gray-400 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                />

                <button
                  type="button"
                  onClick={() => setShowPass((prev) => !prev)}
                  disabled={loading || accountCreated}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-medium disabled:cursor-not-allowed"
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors text-sm shadow-sm mt-1 flex items-center justify-center gap-2"
            >
              {loading && (
                <svg
                  className="animate-spin w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />

                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              )}

              {loading
                ? accountCreated
                  ? "Saving account type..."
                  : "Creating account..."
                : accountCreated
                  ? "Finish Registration"
                  : `Create ${
                      role === "seller" ? "Seller" : "Buyer"
                    } Account`}
            </button>
          </form>

          {/* OR */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />

            <span className="text-xs text-gray-400 uppercase tracking-wide">
              or
            </span>

            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading || accountCreated}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm py-3 rounded-lg transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <svg
                className="animate-spin w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />

                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />

                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />

                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />

                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
            )}

            {googleLoading
              ? "Connecting to Google..."
              : `Continue with Google as ${
                  role === "seller" ? "Seller" : "Buyer"
                }`}
          </button>

          {/* Login */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}

            <Link
              href="/login"
              className="font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>

      {/* =========================
          RIGHT SIDE — DESKTOP
      ========================== */}
      <div className="hidden lg:block relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&auto=format&fit=crop&q=80"
          alt="Pre-owned marketplace"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-white/65 backdrop-blur-sm" />

        <div className="absolute inset-0 flex flex-col justify-center px-12 gap-8">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
              ReSellHub
            </p>

            <h2 className="text-3xl font-bold text-gray-900">
              Choose Your Path
            </h2>

            <p className="text-sm text-gray-600 max-w-lg leading-relaxed">
              Buy quality pre-owned products or sell items you no longer
              need. Either way, you help useful products stay in
              circulation longer.
            </p>
          </div>

          {/* Desktop role selector */}
          <div className="flex flex-col gap-4">
            {ROLES.map(({ key, title, desc, icon, bg }) => {
              const active = role === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleRoleChange(key)}
                  aria-pressed={active}
                  className={`text-left bg-white rounded-2xl p-5 shadow-sm border-2 transition-all relative ${
                    active
                      ? "border-emerald-400 shadow-md -translate-y-0.5"
                      : "border-gray-100 hover:border-emerald-200"
                  }`}
                >
                  {active && (
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}

                  <div
                    className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}
                  >
                    {icon}
                  </div>

                  <h3 className="font-bold text-gray-900 text-base">
                    {title}
                  </h3>

                  <p className="text-sm text-gray-500 leading-relaxed mt-1">
                    {desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Selected role summary */}
          <div className="bg-white/80 border border-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl ${selectedRole.bg} flex items-center justify-center`}
              >
                {selectedRole.icon}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Selected account
                </p>

                <p className="font-bold text-gray-900">
                  {role === "seller" ? "Seller" : "Buyer"}
                </p>
              </div>
            </div>
          </div>

          {/* Truthful sustainability message */}
          <p className="text-sm text-gray-600 italic leading-relaxed max-w-md">
            “Buy used. Sell what you no longer need. Give good products
            another life.”
          </p>
        </div>
      </div>
    </div>
  );
}