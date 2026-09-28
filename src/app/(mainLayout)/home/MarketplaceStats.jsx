"use client";

import { useEffect, useState } from "react";
import {
  Package,
  Users,
  ShoppingBag,
  CheckCircle,
} from "lucide-react";
import axiosSecure from "@/lib/axiosSecure";
import { motion } from "framer-motion";

const STATS = [
  {
    key: "totalProducts",
    label: "Products Listed",
    icon: Package,
    color: "bg-blue-50 text-blue-600",
    border: "border-blue-100",
  },
  {
    key: "totalSellers",
    label: "Sellers",
    icon: Users,
    color: "bg-emerald-50 text-emerald-600",
    border: "border-emerald-100",
  },
  {
    key: "totalBuyers",
    label: "Buyers",
    icon: ShoppingBag,
    color: "bg-purple-50 text-purple-600",
    border: "border-purple-100",
  },
  {
    key: "completedOrders",
    label: "Completed Sales",
    icon: CheckCircle,
    color: "bg-orange-50 text-orange-600",
    border: "border-orange-100",
  },
];

function CountUp({ target }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const finalValue = Math.max(0, Number(target) || 0);

    if (finalValue === 0) {
      setCount(0);
      return;
    }

    let current = 0;
    const duration = 1200;
    const interval = 16;
    const step = Math.max(
      1,
      Math.ceil(finalValue / (duration / interval))
    );

    const timer = setInterval(() => {
      current += step;

      if (current >= finalValue) {
        setCount(finalValue);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{count.toLocaleString()}</span>;
}

export default function MarketplaceStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await axiosSecure.get("/api/stats");

        if (cancelled) return;

        setStats(res.data || {});
      } catch (err) {
        console.error("Marketplace stats error:", err);

        if (cancelled) return;

        setError(
          err?.response?.data?.message ||
            "Marketplace statistics are temporarily unavailable."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">
            By the numbers
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Marketplace Statistics
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Live marketplace activity from ReSellHub
          </p>
        </motion.div>

        {error ? (
          <div className="max-w-lg mx-auto bg-red-50 border border-red-100 text-red-600 text-sm text-center px-4 py-3 rounded-xl">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            {STATS.map(
              (
                {
                  key,
                  label,
                  icon: Icon,
                  color,
                  border,
                },
                index
              ) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  className={`bg-white rounded-2xl border ${border} p-5 flex flex-col gap-3 hover:shadow-md transition-shadow`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center mx-auto`}
                  >
                    <Icon size={20} />
                  </div>

                  <div>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {loading ? (
                        <span className="inline-block w-16 h-8 bg-gray-100 rounded animate-pulse" />
                      ) : (
                        <CountUp target={stats?.[key] || 0} />
                      )}
                    </p>

                    <p className="text-xs font-semibold text-gray-500 mt-1">
                      {label}
                    </p>
                  </div>
                </motion.div>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}