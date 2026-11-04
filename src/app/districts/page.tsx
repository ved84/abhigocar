import { Metadata } from "next";
import Link from "next/link";
import { BIHAR_DISTRICTS } from "@/data/districts";
import { store } from "@/lib/store";
import { Plane, ArrowRight, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "All 38 Bihar Districts & Transit Hubs | BiharDrive",
  description:
    "Comprehensive car rental network covering all 38 districts of Bihar. Operating at Jay Prakash Narayan Airport (PAT), Darbhanga Airport (DHR), Gaya Airport (GAY), and regional transit hubs.",
};

export default function DistrictsDirectoryPage() {
  const allVehicles = store.getVehicles({ onlyActive: true });

  return (
    <div className="py-10 sm:py-16 bg-[#0E1216] text-[#F1F4F7] relative">
      {/* Ambient background glow */}
      <div className="ambient-glow-red" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        {/* Header */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B64] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#E03E36]" />
            Statewide Coverage
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white mt-1">
            All 38 Bihar Districts & Transit Hubs
          </h1>
          <p className="text-xs sm:text-sm text-[#8F9CA8] mt-2 max-w-2xl leading-relaxed">
            From the banks of the Ganges in Patna to the tea gardens of Kishanganj and the hills of Kaimur, find verified vehicle options and transit pickup spots across Bihar.
          </p>
        </div>

        {/* Airport Hub Highlights with Glass Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="glass-panel p-6 rounded-2xl space-y-2.5 relative group border border-white/10 hover:border-[#C63832]/50 transition-all">
            <div className="flex items-center gap-2.5 text-base font-bold text-white font-display">
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#E03E36]">
                <Plane className="w-4 h-4" />
              </div>
              <span>Patna Airport (PAT)</span>
            </div>
            <p className="text-xs text-[#8F9CA8] leading-relaxed">
              Jay Prakash Narayan International Airport terminal pickup for flights from Delhi, Mumbai, Bengaluru, and Kolkata.
            </p>
            <Link
              href="/cars/patna"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6B64] hover:text-white pt-2 group-hover:translate-x-0.5 transition-transform"
            >
              <span>Explore Patna Fleet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-2.5 relative group border border-white/10 hover:border-[#C63832]/50 transition-all">
            <div className="flex items-center gap-2.5 text-base font-bold text-white font-display">
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#E03E36]">
                <Plane className="w-4 h-4" />
              </div>
              <span>Darbhanga Airport (DHR)</span>
            </div>
            <p className="text-xs text-[#8F9CA8] leading-relaxed">
              Civil enclave servicing North Bihar and Mithila region with direct airport terminal vehicle handover.
            </p>
            <Link
              href="/cars/darbhanga"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6B64] hover:text-white pt-2 group-hover:translate-x-0.5 transition-transform"
            >
              <span>Explore Darbhanga Fleet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-2.5 relative group border border-white/10 hover:border-[#C63832]/50 transition-all">
            <div className="flex items-center gap-2.5 text-base font-bold text-white font-display">
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#E03E36]">
                <Plane className="w-4 h-4" />
              </div>
              <span>Gaya Airport (GAY)</span>
            </div>
            <p className="text-xs text-[#8F9CA8] leading-relaxed">
              International seasonal pilgrimage gateway for Bodh Gaya, Mahabodhi Temple, and Gaya Ji ancestral offerings.
            </p>
            <Link
              href="/cars/gaya"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6B64] hover:text-white pt-2 group-hover:translate-x-0.5 transition-transform"
            >
              <span>Explore Gaya Fleet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 38 Districts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {BIHAR_DISTRICTS.map((d) => {
            const count = allVehicles.filter(
              (v) => v.districtId.toLowerCase() === d.slug.toLowerCase()
            ).length;

            return (
              <Link
                key={d.slug}
                href={`/cars/${d.slug}`}
                className="group glass-card p-5 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-display text-base font-bold text-white group-hover:text-[#FF6B64] transition-colors">
                      {d.name}
                    </h3>
                    {count > 0 ? (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/[0.04] text-[#FF6B64] border border-white/10 backdrop-blur-xs">
                        {count} {count === 1 ? "car" : "cars"}
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#8F9CA8]">Regional</span>
                    )}
                  </div>
                  <p className="text-xs text-[#8F9CA8] line-clamp-2 leading-relaxed mb-3">
                    {d.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-medium">
                  <span className="truncate text-[11px] text-[#8F9CA8]">
                    {d.popularHubs[0]?.split("(")[0]?.trim()}
                  </span>
                  <span className="font-bold text-[#E03E36] group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
