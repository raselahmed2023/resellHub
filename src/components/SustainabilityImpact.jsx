"use client";

import { useState } from "react";

const YOUTUBE_ID = "H4joP0RCUbk";

const STATS = [
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#10b981"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    value: "2,700 Liters",
    label: "Estimated water used to grow cotton for one T-shirt",
    source: "WWF",
  },
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#10b981"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6l-1 14H6L5 6" />
        <path d="M10 11v5" />
        <path d="M14 11v5" />
      </svg>
    ),
    value: "92 Million Tons",
    label: "Textile waste generated globally each year",
    source: "UNEP",
  },
];

export default function SustainabilityImpact() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="bg-[#1a2332] text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Why Second-Hand Matters
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
              Give Good Products a Second Life
            </h2>

            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-md">
              Choosing pre-owned products can help extend their useful life,
              reduce unnecessary disposal, and reduce the need for new
              production. ReSellHub makes it easier for useful products to stay
              in circulation instead of being thrown away.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {STATS.map(({ icon, value, label, source }) => (
              <div
                key={value}
                className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3 hover:bg-white/10 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  {icon}
                </div>

                <div>
                  <p className="text-white font-bold text-lg leading-tight">
                    {value}
                  </p>

                  <p className="text-gray-400 text-xs mt-2 leading-5">
                    {label}
                  </p>

                  <p className="text-[10px] text-emerald-400 font-semibold mt-2 uppercase tracking-wider">
                    Source: {source}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-gray-500 leading-5 max-w-lg">
            These figures are general environmental statistics and do not
            represent impact directly measured by ReSellHub.
          </p>
        </div>

        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl group">
          {!playing ? (
            <>
              <img
                src={`https://img.youtube.com/vi/${YOUTUBE_ID}/maxresdefault.jpg`}
                alt="Sustainability and reuse"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

              <button
                type="button"
                onClick={() => setPlaying(true)}
                className="absolute inset-0 flex items-center justify-center"
                aria-label="Play video"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 hover:scale-110 transition-all duration-200 flex items-center justify-center shadow-xl shadow-emerald-900/40">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="white"
                  >
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </div>
              </button>
            </>
          ) : (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0&modestbranding=1`}
              title="Sustainability and reuse video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </section>
  );
}