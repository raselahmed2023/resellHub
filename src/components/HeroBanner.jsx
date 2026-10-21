"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  MessageCircleMore,
  PackageCheck,
  Recycle,
  Sparkles,
} from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-[#f7faf8]">
      {/* Soft background */}
      <div className="pointer-events-none absolute -left-24 top-8 h-[360px] w-[360px] rounded-full bg-emerald-200/20 blur-[100px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[420px] w-[420px] rounded-full bg-cyan-100/30 blur-[110px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_.95fr] lg:gap-16">

          {/* LEFT */}
          <div className="max-w-[650px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-black text-emerald-700 shadow-sm">
              <Recycle size={14} />
              Smarter reuse for Bangladesh
            </div>

            {/* EXACTLY TWO LINES */}
            <h1 className="mt-6 font-black tracking-[-0.045em] text-slate-950">
              <span className="block whitespace-nowrap text-[34px] leading-[1.05] sm:text-[46px] lg:text-[54px]">
                Buy smarter.
              </span>

              <span className="mt-2 block whitespace-nowrap text-[34px] leading-[1.05] sm:text-[46px] lg:text-[54px]">
                Sell with less waste.
              </span>
            </h1>

            <p className="mt-6 max-w-[560px] text-[16px] leading-7 text-slate-600 sm:text-[17px]">
              Find affordable pre-owned products and recover value from
              things you no longer use.
            </p>
          </div>

          {/* RIGHT ANIMATION */}
          <div className="relative mx-auto w-full max-w-[570px]">
            <div className="relative h-[440px] overflow-hidden rounded-[34px] border border-white/80 bg-white/70 shadow-[0_30px_90px_rgba(15,23,42,0.10)] backdrop-blur-xl">

              {/* animated background glow */}
              <motion.div
                className="absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-100/60 blur-[65px]"
                animate={{
                  scale: [1, 1.08, 1],
                  opacity: [0.55, 0.85, 0.55],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* decorative ring */}
              <motion.div
                className="absolute left-1/2 top-1/2 h-[310px] w-[310px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-100/80"
                animate={{
                  scale: [1, 1.04, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* CENTER CARD */}
              <motion.div
                className="absolute left-1/2 top-1/2 z-10 w-[285px] -translate-x-1/2 -translate-y-1/2 rounded-[26px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.10)] will-change-transform"
                animate={{
                  y: [-4, 5, -4],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-600">
                  <Sparkles size={14} />
                  ReSell Flow
                </div>

                <h3 className="mt-3 text-[22px] font-black leading-tight text-slate-950">
                  Simple.
                  <br />
                  Useful.
                  <br />
                  Local.
                </h3>

                <div className="mt-5 space-y-2.5">
                  <FlowItem number="01" text="Discover useful products" />
                  <FlowItem number="02" text="Chat and make an offer" />
                  <FlowItem number="03" text="Reuse within community" />
                </div>
              </motion.div>

              {/* CHAT */}
              <motion.div
                className="absolute left-8 top-8 z-20 w-[215px] rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_14px_35px_rgba(15,23,42,0.12)] will-change-transform"
                animate={{
                  y: [0, -9, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <FloatingItem
                  icon={MessageCircleMore}
                  iconClass="bg-emerald-100 text-emerald-700"
                  title="Real-time Chat"
                  text="Talk before you deal"
                />
              </motion.div>

              {/* STUDENT */}
              <motion.div
                className="absolute right-7 top-[88px] z-20 w-[215px] rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_14px_35px_rgba(15,23,42,0.12)] will-change-transform"
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  duration: 7.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4,
                }}
              >
                <FloatingItem
                  icon={GraduationCap}
                  iconClass="bg-blue-100 text-blue-700"
                  title="Student Zone"
                  text="Campus-based exchange"
                />
              </motion.div>

              {/* PICKUP */}
              <motion.div
                className="absolute bottom-9 left-10 z-20 w-[220px] rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_14px_35px_rgba(15,23,42,0.12)] will-change-transform"
                animate={{
                  y: [0, 8, 0],
                }}
                transition={{
                  duration: 6.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.7,
                }}
              >
                <FloatingItem
                  icon={PackageCheck}
                  iconClass="bg-orange-100 text-orange-700"
                  title="Community Pickup"
                  text="Local and convenient"
                />
              </motion.div>

              {/* BENEFIT CARD */}
              <motion.div
                className="absolute bottom-10 right-9 z-30 rounded-2xl bg-emerald-600 px-5 py-4 text-white shadow-[0_15px_35px_rgba(5,150,105,0.22)] will-change-transform"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 7.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2,
                }}
              >
                <p className="text-[10px] font-bold text-emerald-100">
                  Reuse Benefit
                </p>

                <p className="mt-1 text-sm font-black leading-5">
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

function FlowItem({ number, text }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3">
      <span className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-emerald-100 text-[10px] font-black text-emerald-700">
        {number}
      </span>

      <p className="text-xs font-bold text-slate-700">
        {text}
      </p>
    </div>
  );
}

function FloatingItem({
  icon: Icon,
  iconClass,
  title,
  text,
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl ${iconClass}`}
      >
        <Icon size={18} />
      </div>

      <div>
        <p className="text-sm font-black text-slate-900">
          {title}
        </p>

        <p className="mt-0.5 text-xs leading-4 text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );
}