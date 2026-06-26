"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle, ShoppingBag, Home, Package } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");
  const amount = searchParams.get("amount");
  const title = searchParams.get("title");

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">

        {/* Success Card */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

          {/* Top green bar */}
          <div style={{ background: "linear-gradient(to right, #059669, #065f46)" }} className="p-8 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={36} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Payment Successful!</h1>
            <p className="text-emerald-200 text-sm mt-1">Your order has been placed.</p>
          </div>

          {/* Order details */}
          <div className="p-5 flex flex-col gap-3">

            {/* Product */}
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Product</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Package size={18} className="text-emerald-600" />
                </div>
                <p className="text-sm font-bold text-gray-800 truncate">{decodeURIComponent(title || "")}</p>
              </div>
            </div>

            {/* Payment info */}
            <div className="divide-y divide-gray-100">
              {[
                { label: "Amount paid", value: `৳${Number(amount).toLocaleString()}` },
                { label: "Transaction ID", value: transactionId || "—" },
                { label: "Payment date", value: new Date().toLocaleDateString("en-BD") },
                { label: "Payment status", value: "Paid ✓" },
                { label: "Order status", value: "Pending" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2.5 text-xs">
                  <span className="text-gray-400">{label}</span>
                  <span className={`font-semibold ${label === "Payment status" ? "text-emerald-600" : label === "Transaction ID" ? "text-gray-500 font-mono text-[10px] max-w-[150px] truncate" : "text-gray-800"}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-2">
              <Link
                href="/dashboard/buyer/orders"
                className="flex-1 h-10 rounded-xl bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-600 transition"
              >
                <ShoppingBag size={14} /> My Orders
              </Link>
              <Link
                href="/products"
                className="flex-1 h-10 rounded-xl border border-gray-200 text-gray-600 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-gray-50 transition"
              >
                <Home size={14} /> Continue Shopping
              </Link>
            </div>

          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Order confirmation will be sent to your email.
        </p>

      </div>
    </div>
  );
}