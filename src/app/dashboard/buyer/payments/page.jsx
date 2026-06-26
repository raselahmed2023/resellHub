"use client";

import { useEffect, useState } from "react";
import { Loader2, CreditCard, CheckCircle } from "lucide-react";
import axiosSecure from "@/lib/axiosSecure";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosSecure.get("/api/orders/payments")
      .then((res) => setPayments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-md">
            <CreditCard size={20} color="white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Payment history</h1>
            <p className="text-xs text-gray-500">All your transaction records.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={28} className="animate-spin text-emerald-500" />
          </div>
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <CreditCard size={48} className="text-gray-300 mb-3" />
            <p className="text-gray-500 font-semibold">No payments yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {payments.map((p) => (
                <div key={p._id} className="flex items-center gap-4 px-5 py-4 flex-wrap sm:flex-nowrap">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={18} className="text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{p.productTitle}</p>
                    <p className="text-xs text-gray-400 mt-0.5 font-mono truncate">{p.transactionId}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-orange-500">৳{Number(p.amount).toLocaleString()}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(p.createdAt).toLocaleDateString("en-BD")}</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex-shrink-0">
                    {p.paymentStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}