import { Loader2, Package } from "lucide-react";

export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <Loader2 size={34} className="animate-spin" />
          </div>

          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">
            Loading ReSell Hub
          </p>

          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Preparing your marketplace experience...
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Please wait while we load products, orders, and dashboard data.
          </p>
        </div>

        {/* Product Card Skeleton */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse"
            >
              <div className="h-44 bg-slate-200 flex items-center justify-center">
                <Package size={34} className="text-slate-300" />
              </div>

              <div className="p-4 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
                <div className="h-3 bg-slate-200 rounded w-full" />
                <div className="h-3 bg-slate-200 rounded w-2/3" />

                <div className="flex justify-between items-center pt-2">
                  <div className="h-5 bg-slate-200 rounded w-20" />
                  <div className="h-8 bg-slate-200 rounded-xl w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}