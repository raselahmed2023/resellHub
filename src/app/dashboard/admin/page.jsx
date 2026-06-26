"use client";

import { useEffect, useState } from "react";
import { Users, Package, ShoppingBag, TrendingUp, Loader2 } from "lucide-react";
import axiosSecure from "@/lib/axiosSecure";
import Link from "next/link";

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosSecure.get("/api/admin/overview")
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const CARDS = [
    { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "bg-blue-50 text-blue-600", border: "border-blue-100", href: "/dashboard/admin/users" },
    { label: "Total Products", value: stats?.totalProducts || 0, icon: Package, color: "bg-emerald-50 text-emerald-600", border: "border-emerald-100", href: "/dashboard/admin/products" },
    { label: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingBag, color: "bg-purple-50 text-purple-600", border: "border-purple-100", href: "/dashboard/admin/orders" },
    { label: "Total Revenue", value: `৳${(stats?.totalRevenue || 0).toLocaleString()}`, icon: TrendingUp, color: "bg-orange-50 text-orange-600", border: "border-orange-100", href: "/dashboard/admin/orders" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-lg font-bold text-gray-900">Admin overview</h1>
          <p className="text-xs text-gray-500 mt-0.5">Platform statistics at a glance.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
      </div>
    </div>
  );
}