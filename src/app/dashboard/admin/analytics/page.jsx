"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Loader2,
  Package,
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
  "#ec4899",
  "#14b8a6",
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
      users: 0,
      orders: 0,
    });
  }

  return months;
}

export default function AdminAnalytics() {
  const [users, setUsers] = useState([]);
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
          usersResponse,
          ordersResponse,
          productsResponse,
        ] = await Promise.all([
          axiosSecure.get("/api/admin/users"),
          axiosSecure.get("/api/admin/orders"),
          axiosSecure.get("/api/admin/products"),
        ]);

        if (cancelled) return;

        setUsers(
          Array.isArray(usersResponse.data)
            ? usersResponse.data
            : []
        );

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
        console.error("Admin analytics error:", err);

        if (cancelled) return;

        setError(
          err?.response?.data?.message ||
            "Could not load platform analytics."
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

  const platformActivity = useMemo(() => {
    const months = getLast12Months();

    const monthMap = new Map(
      months.map((item) => [item.key, item])
    );

    users.forEach((user) => {
      if (!user?.createdAt) return;

      const date = new Date(user.createdAt);

      if (Number.isNaN(date.getTime())) return;

      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      const month = monthMap.get(key);

      if (month) {
        month.users += 1;
      }
    });

    orders.forEach((order) => {
      if (!order?.createdAt) return;

      const date = new Date(order.createdAt);

      if (Number.isNaN(date.getTime())) return;

      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      const month = monthMap.get(key);

      if (month) {
        month.orders += 1;
      }
    });

    return months;
  }, [users, orders]);

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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md">
            <BarChart3
              size={20}
              color="white"
            />
          </div>

          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Platform analytics
            </h1>

            <p className="text-xs text-gray-500">
              Overall business insights.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
          <h2 className="text-sm font-bold text-gray-800 mb-4">
            Users and orders by month
          </h2>

          <ResponsiveContainer
            width="100%"
            height={250}
          >
            <LineChart data={platformActivity}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
              />

              <XAxis
                dataKey="month"
                tick={{ fontSize: 11 }}
              />

              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11 }}
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="users"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="New Users"
              />

              <Line
                type="monotone"
                dataKey="orders"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                name="Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="text-sm font-bold text-gray-800 mb-4">
              Monthly orders
            </h2>

            <ResponsiveContainer
              width="100%"
              height={200}
            >
              <BarChart data={platformActivity}>
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
                  name="Orders"
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
              <>
                <ResponsiveContainer
                  width="100%"
                  height={200}
                >
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      dataKey="value"
                      label={({ percent }) =>
                        `${(
                          percent * 100
                        ).toFixed(0)}%`
                      }
                      labelLine={false}
                      fontSize={10}
                    >
                      {categoryData.map(
                        (item, index) => (
                          <Cell
                            key={item.name}
                            fill={
                              COLORS[
                                index %
                                  COLORS.length
                              ]
                            }
                          />
                        )
                      )}
                    </Pie>

                    <Tooltip
                      formatter={(value) => [
                        value,
                        "Products",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="flex flex-wrap gap-2 mt-2">
                  {categoryData.map(
                    (item, index) => (
                      <div
                        key={item.name}
                        className="flex items-center gap-1"
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor:
                              COLORS[
                                index %
                                  COLORS.length
                              ],
                          }}
                        />

                        <span className="text-[10px] text-gray-500">
                          {item.name} ({item.value})
                        </span>
                      </div>
                    )
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}