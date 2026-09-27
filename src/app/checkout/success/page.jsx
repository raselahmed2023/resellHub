"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle,
  ShoppingBag,
  Home,
  Package,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import axiosSecure from "@/lib/axiosSecure";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadOrder = async () => {
      if (!orderId) {
        setError("Order information was not found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axiosSecure.get(
          `/api/orders/${orderId}`
        );

        if (cancelled) return;

        setOrder(response.data);
      } catch (err) {
        console.error("Order confirmation error:", err);

        if (cancelled) return;

        setError(
          err?.response?.data?.message ||
            "Could not load your order confirmation."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadOrder();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

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

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <Package
              size={36}
              className="text-red-400 mx-auto"
            />

            <h1 className="text-xl font-bold text-gray-900 mt-4">
              Order not found
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              {error || "Could not load this order."}
            </p>

            <Link
              href="/dashboard/buyer/orders"
              className="mt-5 inline-flex h-10 px-5 rounded-xl bg-emerald-500 text-white text-xs font-bold items-center justify-center hover:bg-emerald-600 transition"
            >
              My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const amount = Number(order.amount || 0);

  const paymentDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-BD")
    : "—";

  const paymentStatus =
    order.paymentStatus === "paid"
      ? "Paid ✓"
      : order.paymentStatus
      ? `${order.paymentStatus
          .charAt(0)
          .toUpperCase()}${order.paymentStatus.slice(1)}`
      : "—";

  const orderStatus = order.orderStatus
    ? `${order.orderStatus
        .charAt(0)
        .toUpperCase()}${order.orderStatus.slice(1)}`
    : "—";

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div
            style={{
              background:
                "linear-gradient(to right, #059669, #065f46)",
            }}
            className="p-8 flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle
                size={36}
                className="text-white"
              />
            </div>

            <h1 className="text-xl font-bold text-white">
              Payment Successful!
            </h1>

            <p className="text-emerald-200 text-sm mt-1">
              Your order has been placed.
            </p>
          </div>

          <div className="p-5 flex flex-col gap-3">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Product
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Package
                    size={18}
                    className="text-emerald-600"
                  />
                </div>

                <p className="text-sm font-bold text-gray-800 truncate">
                  {order.productTitle || "Product"}
                </p>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {[
                {
                  label: "Amount paid",
                  value: `৳${amount.toLocaleString("en-BD")}`,
                },
                {
                  label: "Transaction ID",
                  value: order.transactionId || "—",
                },
                {
                  label: "Payment date",
                  value: paymentDate,
                },
                {
                  label: "Payment status",
                  value: paymentStatus,
                },
                {
                  label: "Order status",
                  value: orderStatus,
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-2.5 text-xs"
                >
                  <span className="text-gray-400">
                    {label}
                  </span>

                  <span
                    className={`font-semibold ${
                      label === "Payment status"
                        ? order.paymentStatus === "paid"
                          ? "text-emerald-600"
                          : "text-gray-800"
                        : label === "Transaction ID"
                        ? "text-gray-500 font-mono text-[10px] max-w-[150px] truncate"
                        : "text-gray-800"
                    }`}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-2">
              <Link
                href="/dashboard/buyer/orders"
                className="flex-1 h-10 rounded-xl bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-600 transition"
              >
                <ShoppingBag size={14} />
                My Orders
              </Link>

              <Link
                href="/products"
                className="flex-1 h-10 rounded-xl border border-gray-200 text-gray-600 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-gray-50 transition"
              >
                <Home size={14} />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          You can view your order anytime from My Orders.
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
          <Loader2
            size={32}
            className="animate-spin text-emerald-500"
          />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}