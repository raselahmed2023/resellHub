"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Heart, CheckCircle, Clock, Loader2, Package, ArrowRight } from "lucide-react";
import axiosSecure from "@/lib/axiosSecure";
import Link from "next/link";

const STATUS_COLOR = {
  "pending": "bg-amber-100 text-amber-700",
  "accepted": "bg-blue-100 text-blue-700",
  "processing": "bg-purple-100 text-purple-700",
  "shipped": "bg-indigo-100 text-indigo-700",
  "delivered": "bg-emerald-100 text-emerald-700",
  "cancelled": "bg-red-100 text-red-700",
};

export default function BuyerOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosSecure.get("/api/buyer/overview")
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const CARDS = [
    {
      label: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600",
      border: "border-blue-100",
      href: "/dashboard/buyer/orders",
    },
    {
      label: "Wishlist",
      value: stats?.wishlistCount || 0,
      icon: Heart,
      color: "bg-pink-50 text-pink-600",
      border: "border-pink-100",
      href: "/dashboard/buyer/wishlist",
    },
    {
      label: "Completed",
      value: stats?.completedOrders || 0,
      icon: CheckCircle,
      color: "bg-emerald-50 text-emerald-600",
      border: "border-emerald-100",
      href: "/dashboard/buyer/orders",
    },
    {
      label: "Pending",
      value: stats?.pendingOrders || 0,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
      border: "border-amber-100",
      href: "/dashboard/buyer/orders",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-lg font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-xs text-gray-500 mt-0.5">Welcome back! Here's your activity summary.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-center items-center justify-between">
          {CARDS.map(({ label, value, icon: Icon, color, border, href }) => (
            <Link
              key={label}
              href={href}
              className={`bg-white rounded-2xl border ${border} p-5 hover:shadow-md transition-all hover:-translate-y-0.5`}
            >
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
                <Icon size={18} />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? <span className="inline-block w-8 h-7 bg-gray-100 rounded animate-pulse" /> : value}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </Link>
          ))}
        </div>

        {/* Recent Purchases */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-800">Recent Purchases</h2>
            <Link
              href="/dashboard/buyer/orders"
              className="flex items-center gap-1 text-xs text-emerald-600 font-semibold hover:underline"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 size={24} className="animate-spin text-emerald-500" />
            </div>
          ) : !stats?.recentPurchases?.length ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package size={36} className="text-gray-300 mb-2" />
              <p className="text-sm text-gray-500 font-semibold">No purchases yet.</p>
              <Link
                href="/products"
                className="mt-3 text-xs text-emerald-600 font-semibold hover:underline"
              >
                Browse products →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {stats.recentPurchases.map((order) => (
                <div key={order._id} className="flex items-center gap-4 px-5 py-3 flex-wrap sm:flex-nowrap">
                  <div className="w-12 h-12 p-4 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                    {order.productImage ? (
                      <img src={order.productImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={16} className="text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{order.productTitle}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-BD")}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-orange-500">
                      ৳{Number(order.amount).toLocaleString()}
                    </p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[order.orderStatus] || "bg-gray-100 text-gray-600"}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}