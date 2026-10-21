"use client";

import Link from "next/link";

import {
  ArrowRight,
  CircleDollarSign,
  Leaf,
  PackageOpen,
} from "lucide-react";

export default function HomeReuseImpact() {
  return (
    <section className="bg-slate-950 py-16 text-white sm:py-20">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="grid items-center gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">

          {/* Left */}
          <div>

            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">
              More than buying & selling
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Save money today.
              <br />
              Keep products useful longer.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              ReSellHub makes sustainability a natural
              result of everyday buying and selling.
              When a useful product changes hands
              instead of becoming waste, its useful
              life continues.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-black text-slate-950 transition hover:bg-emerald-400"
            >
              Explore products

              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right */}
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">

            <p className="text-xs font-bold text-emerald-400">
              Every successful reuse matters
            </p>

            <h3 className="mt-2 text-xl font-black">
              Small decisions can extend product life.
            </h3>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">

              <ImpactItem
                icon={CircleDollarSign}
                title="Recover Value"
                description="Turn unused products into useful value again."
              />

              <ImpactItem
                icon={PackageOpen}
                title="Reuse More"
                description="Keep good products in circulation for longer."
              />

              <ImpactItem
                icon={Leaf}
                title="Waste Less"
                description="Reduce unnecessary disposal through reuse."
              />
            </div>

            <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-5">

              <p className="text-sm font-black text-white">
                Your impact stays personal.
              </p>

              <p className="mt-2 text-xs leading-6 text-slate-400">
                Logged-in members can track their own
                reuse activity and impact privately
                from their account dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ImpactItem({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
        <Icon size={18} />
      </div>

      <p className="mt-4 text-sm font-black text-white">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-400">
        {description}
      </p>
    </div>
  );
}