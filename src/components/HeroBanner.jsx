"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  Search,
  ShoppingBag,
  Sparkles,
  WalletCards,
} from "lucide-react";

const QUICK_SEARCHES = [
  "Mobile Phones",
  "Books",
  "Furniture",
  "Electronics",
];

export default function HeroBanner() {
  const [query, setQuery] = useState("");

  const router = useRouter();

  const handleSearch = (event) => {
    event.preventDefault();

    const value = query.trim();

    if (!value) {
      router.push("/products");
      return;
    }

    router.push(
      `/products?search=${encodeURIComponent(value)}`
    );
  };

  return (
    <section className="relative overflow-hidden border-b border-emerald-100/70 bg-[#f7faf8]">

      {/* Background */}
      <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl" />

      <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-orange-100/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr] lg:gap-16">

          {/* Left */}
          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-black text-emerald-700 shadow-sm">
              <Sparkles size={14} />

              Smarter reuse for Bangladesh
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Buy smarter.
              <br />

              Sell what you
              <span className="text-emerald-600">
                {" "}
                no longer use.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Find useful pre-owned products for less,
              recover value from things sitting unused,
              and give good products another useful life.
            </p>

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="mt-8 max-w-2xl"
            >
              <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_16px_50px_rgba(15,23,42,0.08)] transition focus-within:border-emerald-300 focus-within:ring-4 focus-within:ring-emerald-100/70">

                <Search
                  size={20}
                  className="ml-3 flex-none text-slate-400"
                />

                <input
                  type="text"
                  value={query}
                  onChange={(event) =>
                    setQuery(event.target.value)
                  }
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

            {/* Quick Search */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-bold text-slate-600">
                Popular:
              </span>

              {QUICK_SEARCHES.map((item) => (
                <Link
                  key={item}
                  href={`/products?category=${encodeURIComponent(
                    item
                  )}`}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-semibold transition hover:border-emerald-300 hover:text-emerald-700"
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-black text-white transition hover:bg-slate-800"
              >
                Browse products

                <ArrowRight size={16} />
              </Link>

              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-sm font-black text-slate-800 transition hover:border-emerald-300 hover:text-emerald-700"
              >
                Start selling
              </Link>
            </div>
          </div>

          {/* Right Psychology Card */}
          <div className="relative">
            <div className="rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur">

              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">
                The ReSell mindset
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-950">
                Value first.
                <br />
                Waste less.
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                People do not need to come here only to
                save the environment. They come to save
                money or recover value. Reuse becomes
                the positive result.
              </p>

              <div className="mt-6 space-y-3">

                {/* Money */}
                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">

                  <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <WalletCards size={21} />
                  </div>

                  <div>
                    <p className="text-sm font-black text-slate-900">
                      Save or recover money
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Buy affordably or recover value
                      from products you no longer use.
                    </p>
                  </div>
                </div>

                {/* Reuse */}
                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">

                  <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <ShoppingBag size={21} />
                  </div>

                  <div>
                    <p className="text-sm font-black text-slate-900">
                      Keep useful products moving
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      What is unused for one person can
                      still be valuable to someone else.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-emerald-600 p-5 text-white">

                <p className="text-xs font-bold text-emerald-100">
                  Our simple principle
                </p>

                <p className="mt-1 text-lg font-black leading-7">
                  Good products deserve another useful
                  life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}