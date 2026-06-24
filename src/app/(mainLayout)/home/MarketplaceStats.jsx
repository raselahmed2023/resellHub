"use client";

import { useEffect, useState } from "react";
import { Package, Users, ShoppingBag, CheckCircle, TrendingUp } from "lucide-react";
import axiosSecure from "@/lib/axiosSecure";

const STATS = [
  {
    key: "totalProducts",
    label: "Total Products",
    icon: Package,
    color: "bg-blue-50 text-blue-600",
    border: "border-blue-100",
    trend: "+12% this month",
  },
  {
    key: "totalSellers",
    label: "Total Sellers",
    icon: Users,
    color: "bg-emerald-50 text-emerald-600",
    border: "border-emerald-100",
    trend: "+8% this month",
  },
  {
    key: "totalBuyers",
    label: "Total Buyers",
    icon: ShoppingBag,
    color: "bg-purple-50 text-purple-600",
    border: "border-purple-100",
    trend: "+15% this month",
  },
  {
    key: "completedOrders",
    label: "Completed Orders",
    icon: CheckCircle,
    color: "bg-orange-50 text-orange-600",
    border: "border-orange-100",
    trend: "+20% this month",
  },
];

function CountUp({ target }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!target) return;
    let start = 0;
    const duration = 1500;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  return <span>{count.toLocaleString()}</span>;
}

export default function MarketplaceStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosSecure.get("/api/stats");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">By the numbers</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Marketplace Statistics</h2>
          <p className="text-sm text-gray-500 mt-2">Real-time data from our growing community</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          {STATS.map(({ key, label, icon: Icon, color, border, trend }) => (
            <div
              key={key}
              className={`bg-white rounded-2xl border ${border} p-5 flex flex-col gap-3 hover:shadow-md transition-shadow`}
            >
              <div className={`w-11 h-11 rounded-xl  flex items-center justify-center flex-shrink-0`}>
                <Icon size={20} />
              </div>

              <div>
                <p className="text-2xl text-center sm:text-3xl font-bold text-gray-900">
                  {loading ? (
                    <span className="inline-block w-16 h-8 bg-gray-100 rounded animate-pulse" />
                  ) : (
                    <CountUp target={stats?.[key] || 0} />
                  )}
                  <span className="text-lg">+</span>
                </p>
                <p className="text-xs text-center font-semibold text-gray-500 mt-0.5">{label}</p>
              </div>

              <div className="flex text-center justify-center items-center gap-1 text-emerald-600">
                <TrendingUp size={12} />
                <span className="text-[10px] font-semibold">{trend}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}