"use client";

import Link from "next/link";

export function CategorySelector() {
  const categories = [
    {
      key: "HATCHBACK",
      label: "City Hatchback",
      subtitle: "Swift, Baleno",
      desc: "High fuel efficiency and easy navigation in city corridors and bypass routes.",
      tag: "Self-Drive / Chauffeur",
    },
    {
      key: "SEDAN",
      label: "Executive Sedan",
      subtitle: "Honda City, Dzire",
      desc: "Plush leatherette seating, generous trunk capacity, and smooth highway comfort.",
      tag: "Executive Comfort",
    },
    {
      key: "COMPACT_SUV",
      label: "Compact SUV",
      subtitle: "Creta, Brezza",
      desc: "190mm ground clearance suited for state highway transit and town roads.",
      tag: "High Clearance",
    },
    {
      key: "SUV",
      label: "Rugged 4x4 SUV",
      subtitle: "Scorpio-N, Thar",
      desc: "High road clearance, powerful torque, and all-weather regional capability.",
      tag: "All-Terrain",
    },
    {
      key: "MUV_MPV",
      label: "7-Seater Family MUV",
      subtitle: "Innova Crysta, Ertiga",
      desc: "Spacious three-row seating with dedicated dual rear AC vents for group travel.",
      tag: "Family & Outstation",
    },
    {
      key: "ELECTRIC",
      label: "Clean Electric (EV)",
      subtitle: "Nexon EV Long Range",
      desc: "Quiet cabin, instant electric acceleration, and CCS2 fast charging compatibility.",
      tag: "Zero Emissions",
    },
    {
      key: "PREMIUM_SUV",
      label: "Flagship Luxury SUV",
      subtitle: "Fortuner Legender",
      desc: "Imposing road presence and premier highway refinement for VIP travel.",
      tag: "VIP Motorcade",
    },
    {
      key: "WEDDING_EVENT",
      label: "Wedding & VIP Luxury",
      subtitle: "Audi A6 Matrix",
      desc: "Chauffeur in formal attire with coordinated timing for wedding events.",
      tag: "Chauffeur Included",
    },
  ];

  return (
    <section className="py-14 sm:py-16 border-b border-[#30363D] bg-[#0D1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E03E36] block">
              Fleet Categories
            </span>
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mt-1">
              Vehicles Built for Every Bihar Route
            </h2>
            <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1">
              From nimble hatchbacks for Patna city to heavy 7-seaters for highway family trips.
            </p>
          </div>
          <Link
            href="/cars"
            className="text-xs font-bold text-[#E03E36] hover:text-white transition-colors py-1 focus-visible:ring-1 focus-visible:ring-[#C63832] rounded self-start md:self-auto"
          >
            Browse All Categories
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={`/cars?category=${cat.key}`}
              className="solid-card p-5 rounded-xl flex flex-col justify-between group focus-visible:ring-2 focus-visible:ring-[#C63832]"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display text-base font-bold text-white group-hover:text-[#E03E36] transition-colors">
                    {cat.label}
                  </span>
                  <span className="text-[10px] font-bold text-[#C9D1D9] px-2 py-0.5 rounded bg-[#21262D] border border-[#30363D]">
                    {cat.tag}
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#E03E36] mb-1.5">
                  {cat.subtitle}
                </div>
                <p className="text-xs text-[#9CA3AF] line-clamp-2 leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#30363D] flex items-center justify-between text-xs text-[#9CA3AF]">
                <span>View listings</span>
                <span className="text-[#E03E36] font-semibold group-hover:text-white transition-colors">
                  Select
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
