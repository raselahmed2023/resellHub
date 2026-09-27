"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_AUTH_URL;

function CompleteRoleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hasStarted = useRef(false);

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState(
    "Finishing your ReSellHub account setup..."
  );

  const selectedRole = searchParams.get("role");

  useEffect(() => {
    if (hasStarted.current) return;

    hasStarted.current = true;

    const completeAccountSetup = async () => {
      try {
        /*
         * Only buyer / seller can be selected.
         * Never trust arbitrary values from URL.
         */
        if (
          selectedRole !== "buyer" &&
          selectedRole !== "seller"
        ) {
          setStatus("error");

          setMessage(
            "Invalid account type. Please return to registration and choose Buyer or Seller."
          );

          return;
        }

        if (!API_URL) {
          throw new Error(
            "ReSellHub API URL is not configured."
          );
        }

        /*
         * User is already authenticated by Google.
         *
         * Now we save the Buyer/Seller choice
         * through our protected backend route.
         */
        const response = await fetch(
          `${API_URL.replace(
            /\/$/,
            ""
          )}/api/users/select-role`,
          {
            method: "POST",

            credentials: "include",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              role: selectedRole,
            }),
          }
        );

        let data = {};

        try {
          data = await response.json();
        } catch {
          data = {};
        }

        /*
         * 409 means this account already selected
         * its role before.
         *
         * We should NOT overwrite it.
         * Simply continue to dashboard.
         */
        if (response.status === 409) {
          setStatus("success");

          setMessage(
            "Your account is already set up. Redirecting..."
          );

          /*
           * Full navigation forces Better Auth
           * to load the latest user/session data.
           */
          window.location.replace("/dashboard");

          return;
        }

        /*
         * 401 means Google authentication/session
         * did not complete correctly.
         */
        if (response.status === 401) {
          setStatus("error");

          setMessage(
            "Your Google session could not be verified. Please try signing up again."
          );

          return;
        }

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Could not save your account type."
          );
        }

        setStatus("success");

        setMessage(
          `Your ${
            selectedRole === "seller"
              ? "Seller"
              : "Buyer"
          } account is ready. Redirecting...`
        );

        /*
         * Use full page navigation rather than
         * router.push().
         *
         * This reloads the Better Auth session
         * so the newly saved role is available
         * immediately in the dashboard.
         */
        window.location.replace("/dashboard");
      } catch (error) {
        console.error(
          "Role completion error:",
          error
        );

        setStatus("error");

        setMessage(
          error?.message ||
            "We could not finish setting up your account."
        );
      }
    };

    completeAccountSetup();
  }, [selectedRole]);

  const handleTryAgain = () => {
    hasStarted.current = false;

    setStatus("loading");

    setMessage(
      "Finishing your ReSellHub account setup..."
    );

    window.location.reload();
  };

  const handleBackToRegister = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error(
        "Sign out error:",
        error
      );
    }

    router.replace("/register");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-sm p-8 text-center">
        {/* =========================
            LOADING
        ========================== */}

        {status === "loading" && (
          <>
            <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-emerald-50 flex items-center justify-center">
              <svg
                className="animate-spin w-7 h-7 text-emerald-600"
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
            </div>

            <h1 className="text-xl font-bold text-gray-900">
              Setting Up Your Account
            </h1>

            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              {message}
            </p>

            {selectedRole && (
              <div className="mt-5 inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-2">
                <span className="text-xs text-gray-500">
                  Account type:
                </span>

                <span className="text-xs font-bold text-emerald-700">
                  {selectedRole === "seller"
                    ? "Seller"
                    : "Buyer"}
                </span>
              </div>
            )}
          </>
        )}

        {/* =========================
            SUCCESS
        ========================== */}

        {status === "success" && (
          <>
            <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#059669"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h1 className="text-xl font-bold text-gray-900">
              Account Ready
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              {message}
            </p>
          </>
        )}

        {/* =========================
            ERROR
        ========================== */}

        {status === "error" && (
          <>
            <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-red-50 flex items-center justify-center">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#dc2626"
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

            <h1 className="text-xl font-bold text-gray-900">
              Setup Couldn&apos;t Be Completed
            </h1>

            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              {message}
            </p>

            <div className="flex flex-col gap-3 mt-6">
              {selectedRole === "buyer" ||
              selectedRole === "seller" ? (
                <button
                  type="button"
                  onClick={handleTryAgain}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm py-3 rounded-lg transition"
                >
                  Try Again
                </button>
              ) : null}

              <button
                type="button"
                onClick={handleBackToRegister}
                className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm py-3 rounded-lg transition"
              >
                Back to Registration
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function CompleteRolePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      }
    >
      <CompleteRoleContent />
    </Suspense>
  );
}