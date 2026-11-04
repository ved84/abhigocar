"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function CategorySelector() {
  const categories = [
    {
      key: "HATCHBACK",
      label: "City Hatchback",
      subtitle: "Swift, Baleno",
      desc: "High fuel efficiency & agility for city traffic and bypass corridors.",
      tag: "Self-Drive / Chauffeur",
    },
    {
      key: "SEDAN",
      label: "Executive Sedan",
      subtitle: "Honda City, Dzire",
      desc: "Plush leatherette seats, generous boot space, and smooth highway ride.",
      tag: "Popular Choice",
    },
    {
      key: "COMPACT_SUV",
      label: "Compact SUV",
      subtitle: "Creta, Brezza",
      desc: "High 190mm ground clearance suited for state corridors and city runs.",
      tag: "High Clearance",
    },
    {
      key: "SUV",
      label: "Rugged 4x4 SUV",
      subtitle: "Scorpio-N, Thar",
      desc: "Commanding road authority and true all-terrain capability.",
      tag: "All-Terrain",
    },
    {
      key: "MUV_MPV",
      label: "7-Seater Family MUV",
      subtitle: "Innova Crysta, Ertiga",
      desc: "Spacious captain seating with independent rear AC blowers.",
      tag: "Family & Group",
    },
    {
      key: "ELECTRIC",
      label: "Clean Electric (EV)",
      subtitle: "Nexon EV Long Range",
      desc: "Zero tailpipe emissions, instant torque, and CCS2 fast charging.",
      tag: "100% Electric",
    },
    {
      key: "PREMIUM_SUV",
      label: "Flagship SUV",
      subtitle: "Fortuner Legender",
      desc: "Premier street presence with catamaran styling and heavy highway power.",
      tag: "VIP Fleet",
    },
    {
      key: "WEDDING_EVENT",
      label: "Wedding & VIP Luxury",
      subtitle: "Audi A6 Matrix",
      desc: "Dedicated chauffeur in formal attire with floral coordination.",
      tag: "Chauffeur Included",
    },
  ];

  return (
    <section className="py-16 border-b border-white/[0.08] relative bg-[#0E1216]">
      {/* Subtle background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#C63832]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B64] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E03E36]" />
              Fleet Categories
            </span>
            <h2 className="font-display text-2xl md:text-4xl font-extrabold text-white mt-1">
              Purpose-Built Vehicles for Every Bihar Route
            </h2>
          </div>
          <Link
            href="/cars"
            className="text-xs font-bold text-[#FF6B64] hover:text-white transition-colors flex items-center gap-1 group"
          >
            <span>Browse All Categories</span>
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.key}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Link
                href={`/cars?category=${cat.key}`}
                className="glass-card p-6 rounded-2xl flex flex-col justify-between h-full group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-display text-lg font-bold text-white group-hover:text-[#FF6B64] transition-colors">
                      {cat.label}
                    </span>
                    <span className="text-[10px] font-bold text-[#FF6B64] px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-sm">
                      {cat.tag}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#E2E8F0] mb-2">
                    {cat.subtitle}
                  </div>
                  <p className="text-xs text-[#8F9CA8] line-clamp-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-[#8F9CA8]">
                  <span>Explore Models</span>
                  <span className="text-[#E03E36] font-bold group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
