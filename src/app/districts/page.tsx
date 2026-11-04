import { Metadata } from "next";
import Link from "next/link";
import { BIHAR_DISTRICTS } from "@/data/districts";
import { store } from "@/lib/store";
import { Plane } from "lucide-react";

export const metadata: Metadata = {
  title: "All 38 Bihar Districts & Transit Hubs | abhigocar",
  description:
    "Comprehensive car rental network covering all 38 districts of Bihar. Operating at Jay Prakash Narayan Airport (PAT), Darbhanga Airport (DHR), Gaya Airport (GAY), and regional transit hubs.",
};

export default function DistrictsDirectoryPage() {
  const allVehicles = store.getVehicles({ onlyActive: true });

  return (
    <div className="py-10 sm:py-16 bg-[#0D1117] text-[#F0F6FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#E03E36] block">
            Statewide Coverage
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white mt-1">
            All 38 Bihar Districts & Transit Hubs
          </h1>
          <p className="text-xs sm:text-sm text-[#9CA3AF] mt-2 max-w-2xl leading-relaxed">
            From the airport terminals of Patna and Darbhanga to the historical corridors of Gaya, Nalanda, and Bhagalpur, find verified vehicle options and transit pickup spots across Bihar.
          </p>
        </div>

        {/* Airport Hub Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#161B22] p-6 rounded-xl space-y-3 border border-[#30363D] shadow-sm">
            <div className="flex items-center gap-2.5 text-base font-bold text-white font-display">
              <div className="w-8 h-8 rounded-lg bg-[#21262D] border border-[#30363D] flex items-center justify-center text-[#E03E36]">
                <Plane className="w-4 h-4" />
              </div>
              <span>Patna Airport (PAT)</span>
            </div>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Jay Prakash Narayan International Airport terminal pickup for flights from Delhi, Mumbai, Bengaluru, and Kolkata.
            </p>
            <Link
              href="/cars/patna"
              className="inline-flex items-center text-xs font-bold text-[#E03E36] hover:text-white pt-2 transition-colors focus-visible:ring-1 focus-visible:ring-[#C63832] rounded"
            >
              <span>Explore Cars in Patna</span>
            </Link>
          </div>

          <div className="bg-[#161B22] p-6 rounded-xl space-y-3 border border-[#30363D] shadow-sm">
            <div className="flex items-center gap-2.5 text-base font-bold text-white font-display">
              <div className="w-8 h-8 rounded-lg bg-[#21262D] border border-[#30363D] flex items-center justify-center text-[#E03E36]">
                <Plane className="w-4 h-4" />
              </div>
              <span>Darbhanga Airport (DHR)</span>
            </div>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Civil enclave servicing North Bihar and Mithila region with direct airport terminal vehicle handover.
            </p>
            <Link
              href="/cars/darbhanga"
              className="inline-flex items-center text-xs font-bold text-[#E03E36] hover:text-white pt-2 transition-colors focus-visible:ring-1 focus-visible:ring-[#C63832] rounded"
            >
              <span>Explore Cars in Darbhanga</span>
            </Link>
          </div>

          <div className="bg-[#161B22] p-6 rounded-xl space-y-3 border border-[#30363D] shadow-sm">
            <div className="flex items-center gap-2.5 text-base font-bold text-white font-display">
              <div className="w-8 h-8 rounded-lg bg-[#21262D] border border-[#30363D] flex items-center justify-center text-[#E03E36]">
                <Plane className="w-4 h-4" />
              </div>
              <span>Gaya Airport (GAY)</span>
            </div>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Pilgrimage and tourist gateway for Bodh Gaya, Mahabodhi Temple, and Gaya Ji ancestral offerings.
            </p>
            <Link
              href="/cars/gaya"
              className="inline-flex items-center text-xs font-bold text-[#E03E36] hover:text-white pt-2 transition-colors focus-visible:ring-1 focus-visible:ring-[#C63832] rounded"
            >
              <span>Explore Cars in Gaya</span>
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
                className="group solid-card p-5 rounded-xl flex flex-col justify-between focus-visible:ring-2 focus-visible:ring-[#C63832]"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-display text-base font-bold text-white group-hover:text-[#E03E36] transition-colors">
                      {d.name}
                    </h3>
                    {count > 0 ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#21262D] text-[#E03E36] border border-[#30363D]">
                        {count} {count === 1 ? "car" : "cars"}
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#9CA3AF]">Regional</span>
                    )}
                  </div>
                  <p className="text-xs text-[#9CA3AF] line-clamp-2 leading-relaxed mb-3">
                    {d.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#30363D] flex items-center justify-between text-xs font-medium">
                  <span className="truncate text-[11px] text-[#9CA3AF]">
                    {d.popularHubs[0]?.split("(")[0]?.trim()}
                  </span>
                  <span className="font-semibold text-[#E03E36] group-hover:text-white transition-colors">
                    Explore
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
