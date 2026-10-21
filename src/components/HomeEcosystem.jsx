"use client";

import { motion } from "framer-motion";

import {
  ArrowRight,
  GraduationCap,
  MessageCircleMore,
  PackageCheck,
} from "lucide-react";

const FEATURES = [
  {
    icon: MessageCircleMore,

    label: "Negotiation",

    title: "Real-time Chat + Offer",

    description:
      "Second-hand prices are rarely final. Buyers and sellers can talk naturally, make offers, counter prices and agree before completing the deal.",

    psychology:
      "Control + commitment",

    steps: [
      "Chat",
      "Offer",
      "Counter",
      "Agree",
    ],
  },

  {
    icon: GraduationCap,

    label: "Student Community",

    title: "Student Exchange Zone",

    description:
      "Students can discover books, calculators, cycles, electronics and hostel essentials around their own university community.",

    psychology:
      "Familiarity + community trust",

    steps: [
      "Campus",
      "Discover",
      "Chat",
      "Exchange",
    ],
  },

  {
    icon: PackageCheck,

    label: "Local Convenience",

    title: "Community Pickup",

    description:
      "Users from the same area can join scheduled pickup windows instead of arranging every small-value product handover separately.",

    psychology:
      "Convenience + social proof",

    steps: [
      "Area",
      "Schedule",
      "Join",
      "Pickup",
    ],
  },
];

export default function HomeEcosystem() {
  return (
    <section className="bg-[#f7faf8] py-16 sm:py-20">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="max-w-3xl">

          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">
            Built around real behavior
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            A simpler second-hand experience.
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            We are not adding dozens of features.
            ReSellHub focuses on a few interactions
            that solve real problems people face when
            buying and selling pre-owned products.
          </p>
        </div>

        {/* Features */}
        <div className="mt-10 grid gap-5 lg:grid-cols-3">

          {FEATURES.map(
            (feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.article
                  key={feature.title}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.08,
                  }}
                  className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >

                  {/* Top */}
                  <div className="flex items-start justify-between gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                      <Icon size={22} />
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-slate-500">
                      {feature.psychology}
                    </span>
                  </div>

                  {/* Content */}
                  <p className="mt-6 text-xs font-bold text-emerald-600">
                    {feature.label}
                  </p>

                  <h3 className="mt-1 text-xl font-black text-slate-950">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {feature.description}
                  </p>

                  {/* Flow */}
                  <div className="mt-6 rounded-2xl bg-slate-50 p-4">

                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      How it works
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">

                      {feature.steps.map(
                        (step, stepIndex) => (
                          <div
                            key={step}
                            className="flex items-center gap-2"
                          >

                            <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700">
                              {step}
                            </span>

                            {stepIndex <
                              feature.steps.length -
                                1 && (
                              <ArrowRight
                                size={13}
                                className="text-slate-300"
                              />
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}