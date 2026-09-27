"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  signIn,
  signOut,
  getSession,
} from "@/lib/auth-client";

function getSafeCallbackPath() {
  if (typeof window === "undefined") {
    return "/dashboard";
  }

  const params = new URLSearchParams(
    window.location.search
  );

  const callbackURL =
    params.get("callbackURL");

  /*
   * Only allow internal routes.
   *
   * Good:
   * /dashboard
   * /checkout?id=123
   *
   * Bad:
   * https://evil.com
   * //evil.com
   */
  if (
    callbackURL &&
    callbackURL.startsWith("/") &&
    !callbackURL.startsWith("//")
  ) {
    return callbackURL;
  }

  return "/dashboard";
}

export default function LoginPage() {
  const [form, setForm] =
    useState({
      email: "",
      password: "",
    });

  const [
    showPass,
    setShowPass,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    googleLoading,
    setGoogleLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  /*
   * Read status messages from URL.
   *
   * Example:
   * /login?registered=true
   * /login?error=account-blocked
   */
  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    const registered =
      params.get("registered");

    const loginError =
      params.get("error");

    if (
      registered === "true"
    ) {
      setSuccessMessage(
        "Registration completed successfully. You can now sign in."
      );
    }

    if (
      loginError ===
      "account-blocked"
    ) {
      setError(
        "This account is currently blocked. Please contact ReSellHub support."
      );
    }
  }, []);

  const handleChange = (
    e
  ) => {
    const {
      name,
      value,
    } = e.target;

    setForm(
      (prev) => ({
        ...prev,
        [name]: value,
      })
    );

    if (error) {
      setError("");
    }
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      setError("");
      setSuccessMessage("");
      setLoading(true);

      try {
        const email =
          form.email
            .trim()
            .toLowerCase();

        if (!email) {
          throw new Error(
            "Email address is required."
          );
        }

        if (
          form.password.length <
          8
        ) {
          throw new Error(
            "Password must be at least 8 characters."
          );
        }

        /*
         * STEP 1
         * Sign in with Better Auth.
         */
        const {
          error:
            signInError,
        } =
          await signIn.email({
            email,
            password:
              form.password,
          });

        if (
          signInError
        ) {
          throw new Error(
            signInError.message ||
              "Login failed. Please check your email and password."
          );
        }

        /*
         * STEP 2
         * Read the authenticated user.
         *
         * This lets us check status before
         * entering the dashboard.
         */
        const sessionResult =
          await getSession();

        const currentUser =
          sessionResult
            ?.data?.user ||
          sessionResult
            ?.user ||
          null;

        if (!currentUser) {
          throw new Error(
            "Login succeeded, but your session could not be verified. Please try again."
          );
        }

        /*
         * Blocked accounts should not
         * stay logged in.
         */
        if (
          currentUser.status ===
          "blocked"
        ) {
          await signOut();

          throw new Error(
            "This account is currently blocked. Please contact ReSellHub support."
          );
        }

        /*
         * We intentionally do NOT decide
         * buyer/seller/admin here.
         *
         * /dashboard will read the real
         * authenticated role and redirect:
         *
         * buyer  -> /dashboard/buyer
         * seller -> /dashboard/seller
         * admin  -> /dashboard/admin
         */

        const destination =
          getSafeCallbackPath();

        /*
         * Full page navigation ensures
         * the latest auth cookie/session
         * is loaded everywhere.
         */
        window.location.replace(
          destination
        );
      } catch (
        err
      ) {
        console.error(
          "Login error:",
          err
        );

        setError(
          err?.message ||
            "Login failed. Please try again."
        );

        setLoading(false);
      }
    };

  const handleGoogleLogin =
    async () => {
      setError("");
      setSuccessMessage("");
      setGoogleLoading(true);

      try {
        const destination =
          getSafeCallbackPath();

        /*
         * Login page Google button is for
         * signing into an account.
         *
         * Buyer/Seller selection for a NEW
         * Google account happens from the
         * Register page.
         */
        const {
          error:
            googleError,
        } =
          await signIn.social({
            provider:
              "google",

            callbackURL:
              `${window.location.origin}${destination}`,
          });

        if (
          googleError
        ) {
          throw new Error(
            googleError.message ||
              "Google login failed."
          );
        }
      } catch (
        err
      ) {
        console.error(
          "Google login error:",
          err
        );

        setError(
          err?.message ||
            "Could not sign in with Google."
        );

        setGoogleLoading(false);
      }
    };

  const busy =
    loading ||
    googleLoading;

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* =========================
          LEFT: LOGIN FORM
      ========================== */}

      <div className="flex items-center justify-center px-6 py-12 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="w-full max-w-md flex flex-col gap-7">
          {/* Heading */}

          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
              ReSellHub
            </p>

            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back
            </h1>

            <p className="text-sm text-gray-500 leading-relaxed">
              Sign in to continue
              buying, selling, and
              giving useful products
              another life.
            </p>
          </div>

          {/* Success message */}

          {successMessage && (
            <div
              role="status"
              className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-lg"
            >
              {successMessage}
            </div>
          )}

          {/* Error */}

          {error && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg"
            >
              {error}
            </div>
          )}

          {/* Google */}

          <button
            type="button"
            onClick={
              handleGoogleLogin
            }
            disabled={busy}
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
              <svg
                width="18"
                height="18"
                viewBox="0 0 48 48"
              >
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
              : "Login with Google"}
          </button>

          {/* Divider */}

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />

            <span className="text-xs text-gray-400">
              or email
            </span>

            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* =========================
              EMAIL LOGIN FORM
          ========================== */}

          <form
            onSubmit={
              handleSubmit
            }
            className="flex flex-col gap-5"
          >
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
                value={
                  form.email
                }
                onChange={
                  handleChange
                }
                placeholder="name@example.com"
                autoComplete="email"
                disabled={busy}
                required
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white placeholder:text-gray-400 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password */}

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                {/*
                  Forgot password can be
                  enabled later when the
                  reset flow is implemented.
                */}
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={
                    showPass
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={
                    form.password
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  minLength={8}
                  disabled={busy}
                  required
                  className="w-full px-4 py-2.5 pr-16 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white placeholder:text-gray-400 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                />

                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    setShowPass(
                      (prev) =>
                        !prev
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-medium disabled:cursor-not-allowed"
                >
                  {showPass
                    ? "Hide"
                    : "Show"}
                </button>
              </div>
            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={busy}
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
                ? "Logging in..."
                : "Login to Account"}
            </button>
          </form>

          {/* Register */}

          <p className="text-center text-sm text-gray-500">
            New to ReSellHub?{" "}

            <Link
              href="/register"
              className="font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* =========================
          RIGHT: VISUAL PANEL
      ========================== */}

      <div className="hidden lg:block relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&auto=format&fit=crop&q=80"
          alt="Pre-owned marketplace"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-emerald-950/45" />

        <div className="absolute inset-0 flex items-center justify-center p-10">
          <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-8 max-w-sm w-full shadow-2xl text-white flex flex-col gap-5">
            <div className="w-11 h-11 rounded-full bg-emerald-500/90 flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 3-15 12l.84-2.9C11.47 9.08 17 8 17 8z" />
              </svg>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold leading-snug">
                Give good products
                a second life.
              </h2>

              <p className="text-sm text-white/85 leading-relaxed">
                ReSellHub connects
                buyers and sellers so
                useful products can stay
                in circulation instead
                of being unnecessarily
                discarded.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-lg">
                  ♻️
                </p>

                <p className="text-xs font-semibold mt-1">
                  Reuse
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-lg">
                  📦
                </p>

                <p className="text-xs font-semibold mt-1">
                  Resell
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-lg">
                  🌱
                </p>

                <p className="text-xs font-semibold mt-1">
                  Reduce Waste
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}