"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Search,
  MessageCircleMore,
  GraduationCap,
  PackageCheck,
  Repeat,
} from "lucide-react";

export default function HeroBanner() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();

    const value = query.trim();

    if (!value) {
      router.push("/products");
      return;
    }

    router.push(`/products?search=${encodeURIComponent(value)}`);
  };

  return (
    <section className="relative overflow-hidden bg-[#f7faf8]">
      {/* soft background blur */}
      <div className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-emerald-200/20 blur-3xl" />
      <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-cyan-100/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_.95fr] lg:gap-16">
          
          {/* LEFT CONTENT */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-black text-emerald-700 shadow-sm">
              <Repeat size={14} />
              Smarter reuse for Bangladesh
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[58px]">
              Buy smarter.
              <br />
              Sell with less waste.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Find affordable pre-owned products and recover value from things
              you no longer use.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="mt-8 max-w-xl">
              <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_16px_40px_rgba(15,23,42,0.07)] transition focus-within:border-emerald-300 focus-within:ring-4 focus-within:ring-emerald-100/70">
                <Search size={20} className="ml-3 flex-none text-slate-400" />

                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What are you looking for?"
                  className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 sm:text-base"
                />

                <button
                  type="submit"
                  className="h-11 rounded-xl bg-emerald-600 px-5 text-sm font-black text-white transition hover:bg-emerald-700"
                >
                  Search
                </button>
              </div>
            </form>

            {/* CTA */}
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-black text-white transition hover:bg-slate-800"
              >
                Browse products
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/register"
                className="text-sm font-bold text-emerald-700 transition hover:text-emerald-800"
              >
                Start selling
              </Link>
            </div>
          </div>

          {/* RIGHT ANIMATION */}
          <div className="relative">
            <div className="relative mx-auto h-[420px] w-full max-w-[520px] overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_25px_80px_rgba(15,23,42,0.10)] backdrop-blur">
              
              {/* background layers */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-cyan-50" />
              <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-100/60 blur-2xl" />

              {/* center card */}
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-1/2 top-1/2 z-10 w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl"
              >
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">
                  Live ReSell Flow
                </p>

                <h3 className="mt-2 text-xl font-black text-slate-950">
                  Simple. Useful. Local.
                </h3>

                <div className="mt-5 space-y-3">
                  <MiniStep text="Browse product" />
                  <MiniStep text="Chat and make offer" />
                  <MiniStep text="Community pickup or exchange" />
                </div>
              </motion.div>

              {/* floating card 1 */}
              <motion.div
                animate={{
                  y: [0, -18, 0],
                  x: [0, 10, 0],
                  rotate: [0, 2, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute left-6 top-10 z-20 w-52 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <MessageCircleMore size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-black text-slate-900">
                      Real-time Chat
                    </p>
                    <p className="text-xs text-slate-500">
                      Talk before you deal
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* floating card 2 */}
              <motion.div
                animate={{
                  y: [0, 16, 0],
                  x: [0, -10, 0],
                  rotate: [0, -2, 0],
                }}
                transition={{
                  duration: 5.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3,
                }}
                className="absolute right-6 top-16 z-20 w-52 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <GraduationCap size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-black text-slate-900">
                      Student Zone
                    </p>
                    <p className="text-xs text-slate-500">
                      Campus-based exchange
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* floating card 3 */}
              <motion.div
                animate={{
                  y: [0, -14, 0],
                  x: [0, 8, 0],
                  rotate: [0, 1.5, 0],
                }}
                transition={{
                  duration: 6.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute bottom-10 left-8 z-20 w-56 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                    <PackageCheck size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-black text-slate-900">
                      Community Pickup
                    </p>
                    <p className="text-xs text-slate-500">
                      Local and convenient
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* floating card 4 */}
              <motion.div
                animate={{
                  y: [0, 15, 0],
                  x: [0, -8, 0],
                  rotate: [0, -1.5, 0],
                }}
                transition={{
                  duration: 6.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.8,
                }}
                className="absolute bottom-12 right-8 z-20 w-44 rounded-2xl border border-slate-200 bg-emerald-600 p-4 text-white shadow-lg"
              >
                <p className="text-xs font-bold text-emerald-100">
                  Reuse Benefit
                </p>
                <p className="mt-1 text-sm font-black">
                  More value.
                  <br />
                  Less waste.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStep({ text }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3">
      <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
      <p className="text-sm font-semibold text-slate-700">{text}</p>
    </div>
  );
}