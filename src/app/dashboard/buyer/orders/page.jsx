"use client";

import { useEffect, useState } from "react";
import { Loader2, Package, X, ChevronRight, ShoppingBag } from "lucide-react";
import axiosSecure from "@/lib/axiosSecure";
import Link from "next/link";

const STATUS_COLOR = {
  "pending": "bg-amber-100 text-amber-700",
  "accepted": "bg-blue-100 text-blue-700",
  "processing": "bg-purple-100 text-purple-700",
  "shipped": "bg-indigo-100 text-indigo-700",
  "delivered": "bg-emerald-100 text-emerald-700",
  "cancelled": "bg-red-100 text-red-700",
};

const STATUS_STEPS = ["pending", "accepted", "processing", "shipped", "delivered"];

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/api/orders/my-orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    const confirmed = confirm("Are you sure you want to cancel this order?");
    if (!confirmed) return;
    setCancelling(id);
    try {
      await axiosSecure.patch(`/api/orders/${id}/cancel`);
      setOrders((p) => p.map((o) => o._id === id ? { ...o, orderStatus: "cancelled" } : o));
      if (selected?._id === id) setSelected((p) => ({ ...p, orderStatus: "cancelled" }));
    } catch (err) {
      console.error(err);
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md flex-shrink-0">
            <ShoppingBag size={20} color="black" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">My orders</h1>
            <p className="text-xs text-gray-500">Track and manage your purchases.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-emerald-500" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingBag size={48} className="text-gray-300 mb-3" />
            <p className="text-gray-500 font-semibold">No orders yet.</p>
            <p className="text-xs text-gray-400 mt-1">Your orders will appear here.</p>
            <Link href="/products" className="mt-4 px-5 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition">
              Browse products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">

                  {/* Image */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-gray-100 flex-shrink-0">
                    {order.productImage ? (
                      <img src={order.productImage} alt={order.productTitle} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={18} className="text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{order.productTitle}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-BD")}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[order.orderStatus] || "bg-gray-100 text-gray-600"}`}>
                        {order.orderStatus}
                      </span>
                      <span className="text-xs text-emerald-600 font-semibold">Paid ✓</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-orange-500">৳{Number(order.amount).toLocaleString()}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setSelected(selected?._id === order._id ? null : order)}
                      className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
                    >
                      <ChevronRight size={15} className={`text-gray-500 transition-transform ${selected?._id === order._id ? "rotate-90" : ""}`} />
                    </button>
                    {order.orderStatus === "pending" && (
                      <button
                        onClick={() => handleCancel(order._id)}
                        disabled={cancelling === order._id}
                        className="w-9 h-9 rounded-xl border border-red-200 bg-red-50 flex items-center justify-center hover:bg-red-100 transition disabled:opacity-50"
                      >
                        {cancelling === order._id
                          ? <Loader2 size={14} className="animate-spin text-red-400" />
                          : <X size={14} className="text-red-500" />
                        }
                      </button>
                    )}
                  </div>
                </div>

                {/* Order Details — expanded */}
                {selected?._id === order._id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">

                    {/* Status tracker */}
                    {order.orderStatus !== "cancelled" && (
                      <div className="mb-4">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Order progress</p>
                        <div className="flex items-center gap-1">
                          {STATUS_STEPS.map((step, i) => {
                            const currentIndex = STATUS_STEPS.indexOf(order.orderStatus);
                            const done = i <= currentIndex;
                            return (
                              <div key={step} className="flex items-center flex-1">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${done ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                                  {i + 1}
                                </div>
                                {i < STATUS_STEPS.length - 1 && (
                                  <div className={`flex-1 h-0.5 ${done && i < currentIndex ? "bg-emerald-500" : "bg-gray-100"}`} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex justify-between mt-1">
                          {STATUS_STEPS.map((step) => (
                            <p key={step} className="text-[9px] text-gray-400 capitalize flex-1 text-center">{step}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Order info */}
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Transaction ID", value: order.transactionId },
                        { label: "Seller", value: order.sellerInfo?.name },
                        { label: "Delivery name", value: order.deliveryInfo?.name },
                        { label: "Phone", value: order.deliveryInfo?.phone },
                        { label: "Address", value: order.deliveryInfo?.address },
                        { label: "Payment", value: order.paymentStatus },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-slate-50 rounded-xl p-3">
                          <p className="text-[10px] text-gray-400">{label}</p>
                          <p className="text-xs font-semibold text-gray-700 mt-0.5 truncate">{value || "—"}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}