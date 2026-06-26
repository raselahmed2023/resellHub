"use client";

import { useEffect, useState } from "react";
import { Package, ShoppingBag, TrendingUp, Clock, Loader2 } from "lucide-react";
import axiosSecure from "@/lib/axiosSecure";
import Link from "next/link";

export default function SellerOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosSecure.get("/api/seller/overview")
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const CARDS = [
    { label: "Total Products", value: stats?.totalProducts || 0, icon: Package, color: "bg-blue-50 text-blue-600", border: "border-blue-100", href: "/dashboard/seller/my-products" },
    { label: "Total Sales", value: stats?.totalSales || 0, icon: ShoppingBag, color: "bg-emerald-50 text-emerald-600", border: "border-emerald-100", href: "/dashboard/seller/manage-orders" },
    { label: "Total Revenue", value: `৳${(stats?.totalRevenue || 0).toLocaleString()}`, icon: TrendingUp, color: "bg-orange-50 text-orange-600", border: "border-orange-100", href: "/dashboard/seller/manage-orders" },
    { label: "Pending Orders", value: stats?.pendingOrders || 0, icon: Clock, color: "bg-amber-50 text-amber-600", border: "border-amber-100", href: "/dashboard/seller/manage-orders" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-lg font-bold text-gray-900">Seller overview</h1>
          <p className="text-xs text-gray-500 mt-0.5">Your business at a glance.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {CARDS.map(({ label, value, icon: Icon, color, border, href }) => (
            <Link key={label} href={href}
              className={`bg-white rounded-2xl border ${border} p-5 hover:shadow-md transition-shadow`}
            >
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
                <Icon size={18} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{loading ? "—" : value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-800">Recent orders</h2>
            <Link href="/dashboard/seller/manage-orders" className="text-xs text-emerald-600 font-semibold hover:underline">View all</Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 size={24} className="animate-spin text-emerald-500" />
            </div>
          ) : stats?.recentOrders?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag size={36} className="text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No orders yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {stats?.recentOrders?.map((order) => (
                <div key={order._id} className="flex items-center gap-4 px-5 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{order.productTitle}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{order.buyerInfo?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-orange-500">৳{Number(order.amount).toLocaleString()}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      order.orderStatus === "delivered" ? "bg-emerald-100 text-emerald-700" :
                      order.orderStatus === "pending" ? "bg-amber-100 text-amber-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>{order.orderStatus}</span>
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