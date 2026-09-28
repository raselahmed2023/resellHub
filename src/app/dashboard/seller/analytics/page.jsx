"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Package,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axiosSecure from "@/lib/axiosSecure";

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#14b8a6",
  "#f97316",
];

function getLast12Months() {
  const months = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1
    );

    months.push({
      key: `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`,
      month: date.toLocaleDateString("en-US", {
        month: "short",
      }),
      sales: 0,
      orders: 0,
    });
  }

  return months;
}

export default function SellerAnalytics() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadAnalytics = async () => {
      setLoading(true);
      setError("");

      try {
        const [
          overviewResponse,
          ordersResponse,
          productsResponse,
        ] = await Promise.all([
          axiosSecure.get("/api/seller/overview"),
          axiosSecure.get("/api/seller/orders"),
          axiosSecure.get("/api/products/my-products"),
        ]);

        if (cancelled) return;

        setStats(overviewResponse.data || {});

        setOrders(
          Array.isArray(ordersResponse.data)
            ? ordersResponse.data
            : []
        );

        setProducts(
          Array.isArray(productsResponse.data)
            ? productsResponse.data
            : []
        );
      } catch (err) {
        console.error("Seller analytics error:", err);

        if (cancelled) return;

        setError(
          err?.response?.data?.message ||
            "Could not load your analytics."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAnalytics();

    return () => {
      cancelled = true;
    };
  }, []);

  const monthlySales = useMemo(() => {
    const months = getLast12Months();
    const monthMap = new Map(
      months.map((item) => [item.key, item])
    );

    orders.forEach((order) => {
      if (!order?.createdAt) return;

      const date = new Date(order.createdAt);

      if (Number.isNaN(date.getTime())) return;

      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      const item = monthMap.get(key);

      if (!item) return;

      item.orders += 1;

      if (
        order.orderStatus === "delivered" &&
        order.paymentStatus === "paid"
      ) {
        item.sales += Number(order.amount || 0);
      }
    });

    return months;
  }, [orders]);

  const categoryData = useMemo(() => {
    const counts = {};

    products.forEach((product) => {
      const category =
        product?.category?.trim() || "Other";

      counts[category] =
        (counts[category] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [products]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <Loader2
          size={32}
          className="animate-spin text-emerald-500"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md">
            <BarChart3 size={20} color="white" />
          </div>

          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Sales analytics
            </h1>

            <p className="text-xs text-gray-500">
              Your performance overview.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total Products",
              value: stats?.totalProducts || 0,
              icon: Package,
              color: "bg-blue-50 text-blue-600",
            },
            {
              label: "Total Sales",
              value: stats?.totalSales || 0,
              icon: ShoppingBag,
              color: "bg-emerald-50 text-emerald-600",
            },
            {
              label: "Total Revenue",
              value: `৳${Number(
                stats?.totalRevenue || 0
              ).toLocaleString()}`,
              icon: TrendingUp,
              color: "bg-orange-50 text-orange-600",
            },
            {
              label: "Pending Orders",
              value: stats?.pendingOrders || 0,
              icon: BarChart3,
              color: "bg-amber-50 text-amber-600",
            },
          ].map(
            ({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="bg-white rounded-2xl border border-gray-100 p-4"
              >
                <div
                  className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-2`}
                >
                  <Icon size={16} />
                </div>

                <p className="text-xl font-bold text-gray-900">
                  {value}
                </p>

                <p className="text-xs text-gray-500 mt-0.5">
                  {label}
                </p>
              </div>
            )
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
          <h2 className="text-sm font-bold text-gray-800 mb-4">
            Monthly sales trend
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlySales}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
              />

              <XAxis
                dataKey="month"
                tick={{ fontSize: 11 }}
              />

              <YAxis tick={{ fontSize: 11 }} />

              <Tooltip
                formatter={(value) => [
                  `৳${Number(value).toLocaleString()}`,
                  "Revenue",
                ]}
              />

              <Line
                type="monotone"
                dataKey="sales"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="text-sm font-bold text-gray-800 mb-4">
              Monthly orders
            </h2>

            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlySales}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                />

                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10 }}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10 }}
                />

                <Tooltip />

                <Bar
                  dataKey="orders"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="text-sm font-bold text-gray-800 mb-4">
              Listed products by category
            </h2>

            {categoryData.length === 0 ? (
              <div className="h-[200px] flex flex-col items-center justify-center text-center">
                <Package
                  size={32}
                  className="text-gray-300"
                />

                <p className="text-xs text-gray-400 mt-2">
                  No product data available yet.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(
                        percent * 100
                      ).toFixed(0)}%`
                    }
                    labelLine={false}
                    fontSize={10}
                  >
                    {categoryData.map((item, index) => (
                      <Cell
                        key={item.name}
                        fill={
                          COLORS[
                            index % COLORS.length
                          ]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value) => [
                      value,
                      "Products",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}