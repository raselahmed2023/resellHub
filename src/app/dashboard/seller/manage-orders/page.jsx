"use client";

import { useEffect, useState } from "react";
import { Loader2, Truck, CheckCircle, X, ChevronDown } from "lucide-react";
import axiosSecure from "@/lib/axiosSecure";

const STATUS_COLOR = {
  "pending": "bg-amber-100 text-amber-700",
  "accepted": "bg-blue-100 text-blue-700",
  "processing": "bg-purple-100 text-purple-700",
  "shipped": "bg-indigo-100 text-indigo-700",
  "delivered": "bg-emerald-100 text-emerald-700",
  "cancelled": "bg-red-100 text-red-700",
};

const NEXT_STATUS = {
  "pending": "accepted",
  "accepted": "processing",
  "processing": "shipped",
  "shipped": "delivered",
};

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    axiosSecure.get("/api/seller/orders")
      .then((res) => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdating(id);
    try {
      await axiosSecure.patch(`/api/orders/${id}/status`, { orderStatus: newStatus });
      setOrders((p) => p.map((o) => o._id === id ? { ...o, orderStatus: newStatus } : o));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-md">
            <Truck size={20} color="white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Manage orders</h1>
            <p className="text-xs text-gray-500">Handle incoming customer orders.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={28} className="animate-spin text-emerald-500" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Truck size={48} className="text-gray-300 mb-3" />
            <p className="text-gray-500 font-semibold">No orders yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{order.productTitle}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Buyer: {order.buyerInfo?.name} · {order.buyerInfo?.email}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[order.orderStatus] || "bg-gray-100 text-gray-600"}`}>
                        {order.orderStatus}
                      </span>
                      <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString("en-BD")}</span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-orange-500">৳{Number(order.amount).toLocaleString()}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{order.deliveryInfo?.phone}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {NEXT_STATUS[order.orderStatus] && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, NEXT_STATUS[order.orderStatus])}
                        disabled={updating === order._id}
                        className="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition disabled:opacity-50"
                      >
                        {updating === order._id
                          ? <Loader2 size={12} className="animate-spin" />
                          : <CheckCircle size={13} />
                        }
                        {NEXT_STATUS[order.orderStatus]}
                      </button>
                    )}
                    {order.orderStatus === "pending" && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, "cancelled")}
                        disabled={updating === order._id}
                        className="w-9 h-9 rounded-xl border border-red-200 bg-red-50 flex items-center justify-center hover:bg-red-100 transition disabled:opacity-50"
                      >
                        <X size={14} className="text-red-500" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Delivery info */}
                <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-2">
                  {[
                    { label: "Name", value: order.deliveryInfo?.name },
                    { label: "Phone", value: order.deliveryInfo?.phone },
                    { label: "Address", value: order.deliveryInfo?.address },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-slate-50 rounded-xl p-2.5">
                      <p className="text-[10px] text-gray-400">{label}</p>
                      <p className="text-xs font-semibold text-gray-700 mt-0.5 truncate">{value || "—"}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}