

"use client";

import { useState } from "react";

const YOUTUBE_ID = "H4joP0RCUbk";

const STATS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
    value: "2,700 Liters",
    label: "Water saved per cotton shirt",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/>
      </svg>
    ),
    value: "15.5 Tons",
    label: "CO₂ offset this month",
  },
];



export default function SustainabilityImpact() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="bg-[#1a2332] text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

       
        <div className="flex flex-col gap-8">

        
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
              The Impact of One Purchase
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-md">
              By choosing second-hand, you're not just saving money- you're saving
              the planet. Every transaction on ReSell Hub directly contributes to a
              massive reduction in landfill waste and manufacturing carbon emissions.
            </p>
          </div>

       
          <div className="grid grid-cols-2 gap-4">
            {STATS.map(({ icon, value, label }) => (
              <div
                key={label}
                className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3 hover:bg-white/10 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  {icon}
                </div>
                <div>
                  <p className="text-white font-bold text-lg leading-none">{value}</p>
                  <p className="text-gray-400 text-xs mt-1">{label}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

       
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl group">

          {!playing ? (
            <>
             
              <img
                src={`https://img.youtube.com/vi/${YOUTUBE_ID}/maxresdefault.jpg`}
                alt="Impact video thumbnail"
                className="w-full h-full object-cover"
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

              {/* Play button */}
              <button
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
                    <polygon points="5,3 19,12 5,21"/>
                  </svg>
                </div>
              </button>
            </>
          ) : (
            
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0&modestbranding=1`}
              title="Impact Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}

        </div>

      </div>
    </section>
  );
}