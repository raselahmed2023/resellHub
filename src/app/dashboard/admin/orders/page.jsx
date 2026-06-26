"use client";

import { useEffect, useState } from "react";
import { Loader2, ShoppingBag, Search } from "lucide-react";
import axiosSecure from "@/lib/axiosSecure";

const STATUS_COLOR = {
  "pending": "bg-amber-100 text-amber-700",
  "accepted": "bg-blue-100 text-blue-700",
  "processing": "bg-purple-100 text-purple-700",
  "shipped": "bg-indigo-100 text-indigo-700",
  "delivered": "bg-emerald-100 text-emerald-700",
  "cancelled": "bg-red-100 text-red-700",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axiosSecure.get("/api/admin/orders")
      .then((res) => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) =>
    o.productTitle?.toLowerCase().includes(search.toLowerCase()) ||
    o.buyerInfo?.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.transactionId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md">
            <ShoppingBag size={20} color="white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Manage orders</h1>
            <p className="text-xs text-gray-500">{orders.length} total orders.</p>
          </div>
        </div>

        <div className="relative mb-5">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" placeholder="Search by product, buyer or transaction..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 bg-white border border-gray-200 rounded-xl pl-9 pr-4 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={28} className="animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100 p-4">
              {filtered.map((order) => (
                <div key={order._id} className="flex items-center gap-4 px-5 py-4 flex-wrap sm:flex-nowrap">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{order.productTitle}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Buyer: {order.buyerInfo?.name} · Seller: {order.sellerInfo?.name}
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5 truncate">{order.transactionId}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-orange-500">৳{Number(order.amount).toLocaleString()}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString("en-BD")}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0 ${STATUS_COLOR[order.orderStatus] || "bg-gray-100 text-gray-600"}`}>
                    {order.orderStatus}
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