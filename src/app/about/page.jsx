"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Leaf,
  ShieldCheck,
  Users,
  PackageCheck,
  Recycle,
  CheckCircle,
} from "lucide-react";

const features = [
  {
    icon: Recycle,
    title: "Sustainable Marketplace",
    text: "ReSell Hub helps reduce waste by giving used products a second life.",
  },
  {
    icon: ShieldCheck,
    title: "Safe Buying & Selling",
    text: "Products are reviewed, orders are tracked, and payments are handled securely.",
  },
  {
    icon: Users,
    title: "Role Based Platform",
    text: "Buyers, sellers, and admins get separate dashboards with their own features.",
  },
  {
    icon: PackageCheck,
    title: "Easy Product Management",
    text: "Sellers can list products, manage stock, and handle customer orders smoothly.",
  },
];

const stats = [
  { label: "Marketplace Goal", value: "Reuse" },
  { label: "User Roles", value: "3+" },
  { label: "Secure Payments", value: "Stripe" },
  { label: "Product Flow", value: "Approve" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-400 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-3xl"
          >
            <p className="text-xs font-bold text-emerald-300 uppercase tracking-widest mb-3">
              About ReSell Hub
            </p>

            <h1 className="text-3xl sm:text-5xl font-black leading-tight">
              A modern second-hand marketplace for a smarter and greener future.
            </h1>

            <p className="text-sm sm:text-base text-emerald-100 mt-5 leading-7">
              ReSell Hub connects buyers and sellers so pre-owned products can be
              reused instead of wasted. Our platform helps people earn from unused
              items while buyers find affordable products safely.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition"
              >
                Browse Products <ArrowRight size={16} />
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-bold transition"
              >
                Join Marketplace
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className="bg-white rounded-2xl border border-gray-200 p-5 text-center shadow-sm"
            >
              <p className="text-2xl font-black text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-500 mt-1">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Leaf size={24} />
            </div>

            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">
              Our Purpose
            </p>

            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
              Reduce waste, promote reuse, and make buying affordable.
            </h2>

            <p className="text-sm text-gray-500 mt-4 leading-7">
              Many products remain usable even after their first owner no longer
              needs them. ReSell Hub makes it easier to list, discover, and buy
              those products through a secure marketplace experience.
            </p>

            <div className="mt-6 space-y-3">
              {[
                "Help sellers earn from unused products",
                "Help buyers find affordable products",
                "Promote sustainable consumption",
                "Create a safe role-based marketplace",
              ].map((text) => (
                <div key={text} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle size={16} className="text-emerald-500" />
                  {text}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {features.map(({ icon: Icon, title, text }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <Icon size={21} />
                </div>

                <h3 className="text-sm font-black text-gray-900">{title}</h3>
                <p className="text-xs text-gray-500 mt-2 leading-6">{text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">
              How It Works
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
              Simple marketplace flow
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              "Seller lists a product",
              "Admin reviews listing",
              "Buyer places an order",
              "Payment and order are completed",
            ].map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="relative bg-slate-50 rounded-2xl border border-gray-200 p-5"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-sm font-black mb-4">
                  {index + 1}
                </div>
                <p className="text-sm font-bold text-gray-800">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}