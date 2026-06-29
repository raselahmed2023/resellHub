"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Star,
  PackageCheck,
  MapPin,
  BadgeCheck,
} from "lucide-react";

const sellers = [
  {
    name: "Rasel Ahmed",
    category: "Electronics Seller",
    location: "Dhaka",
    listings: 18,
    rating: 4.9,
    initials: "R",
  },
  {
    name: "Nusrat Jahan",
    category: "Fashion & Lifestyle",
    location: "Chattogram",
    listings: 14,
    rating: 4.8,
    initials: "N",
  },
  {
    name: "Tanvir Hasan",
    category: "Vehicles & Furniture",
    location: "Sylhet",
    listings: 21,
    rating: 5.0,
    initials: "T",
  },
];

export default function TrustedSellersShowcase() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">
              Trusted Sellers
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
              Top-rated sellers you can trust
            </h2>
            <p className="text-sm text-gray-500 mt-2 max-w-2xl">
              Verified and active sellers help make ReSell Hub safer for buyers.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 w-fit">
            <ShieldCheck size={16} />
            <span className="text-xs font-bold">Verified seller showcase</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {sellers.map(
            ({ name, category, location, listings, rating, initials }, index) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className="bg-slate-50 rounded-3xl border border-gray-200 p-6 hover:bg-white hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-lg font-black">
                        {initials}
                      </div>
                      <div className="absolute -right-1 -bottom-1 w-6 h-6 rounded-full bg-white border border-emerald-100 flex items-center justify-center">
                        <BadgeCheck size={16} className="text-emerald-600" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-black text-gray-900">
                        {name}
                      </h3>
                      <p className="text-xs text-gray-500">{category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500">
                    <Star size={15} className="fill-amber-400" />
                    <span className="text-sm font-black">{rating}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 px-4 py-3">
                    <div className="flex items-center gap-2 text-gray-500">
                      <PackageCheck size={16} />
                      <span className="text-xs font-semibold">Active Listings</span>
                    </div>
                    <span className="text-sm font-black text-gray-900">
                      {listings}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 px-4 py-3">
                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin size={16} />
                      <span className="text-xs font-semibold">Location</span>
                    </div>
                    <span className="text-sm font-black text-gray-900">
                      {location}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3">
                  <ShieldCheck size={17} />
                  <span className="text-xs font-bold">
                    Verified trusted seller
                  </span>
                </div>
              </motion.div>
            )
          )}
        </div>
      </div>
    </section>
  );
}