import Link from "next/link";
import { SearchX, Home, ShoppingBag, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 shadow-sm">
          <div className="mx-auto w-24 h-24 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
            <SearchX size={48} />
          </div>

          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">
            404 Error
          </p>

          <h1 className="text-4xl sm:text-6xl font-black text-gray-900">
            Page Not Found
          </h1>

          <p className="text-sm sm:text-base text-gray-500 mt-4 leading-7">
            The page you are looking for may have been moved, deleted, or the URL
            might be incorrect. Let&apos;s get you back to ReSell Hub.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition"
            >
              <Home size={16} />
              Back To Home
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-bold transition"
            >
              <ShoppingBag size={16} />
              Browse Products
            </Link>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-gray-400 hover:text-emerald-600 mt-6 transition"
          >
            <ArrowLeft size={14} />
            Return to marketplace
          </Link>
        </div>
      </div>
    </main>
  );
}