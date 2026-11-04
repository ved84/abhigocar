import { Metadata } from "next";
import Link from "next/link";
import { BIHAR_DISTRICTS } from "@/data/districts";
import { store } from "@/lib/store";
import { MapPin, Navigation, ArrowRight, Plane } from "lucide-react";

export const metadata: Metadata = {
  title: "All 38 Bihar Districts & Transit Hubs | BiharDrive",
  description:
    "Comprehensive car rental network covering all 38 districts of Bihar. Operating at Jay Prakash Narayan Airport (PAT), Darbhanga Airport (DHR), Gaya Airport (GAY), and regional junctions.",
};

export default function DistrictsDirectoryPage() {
  const allVehicles = store.getVehicles({ onlyActive: true });

  return (
    <div className="py-8 sm:py-12 text-[#EEF0EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#387F66]">
            Statewide Coverage
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#EEF0EB] mt-1">
            All 38 Bihar Districts & Transit Hubs
          </h1>
          <p className="text-xs sm:text-sm text-[#8E9991] mt-1 max-w-2xl">
            From the banks of the Ganges in Patna to the tea gardens of Kishanganj and the hills of Kaimur, find verified vehicle options and transit pickup spots.
          </p>
        </div>

        {/* Airport Hub Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#181E19] p-5 rounded-xl border border-[#2B352E] space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#EEF0EB]">
              <Plane className="w-4 h-4 text-[#387F66]" />
              <span>Patna Airport (PAT)</span>
            </div>
            <p className="text-xs text-[#8E9991]">
              Jay Prakash Narayan International Airport terminal pickup for flights from Delhi, Mumbai, Bengaluru, and Kolkata.
            </p>
            <Link
              href="/cars/patna"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#387F66] pt-1 hover:underline"
            >
              <span>Explore Patna Cars</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-[#181E19] p-5 rounded-xl border border-[#2B352E] space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#EEF0EB]">
              <Plane className="w-4 h-4 text-[#387F66]" />
              <span>Darbhanga Airport (DHR)</span>
            </div>
            <p className="text-xs text-[#8E9991]">
              Civil enclave servicing North Bihar and Mithila region with direct airport parking vehicle handover.
            </p>
            <Link
              href="/cars/darbhanga"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#387F66] pt-1 hover:underline"
            >
              <span>Explore Darbhanga Cars</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-[#181E19] p-5 rounded-xl border border-[#2B352E] space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#EEF0EB]">
              <Plane className="w-4 h-4 text-[#387F66]" />
              <span>Gaya Airport (GAY)</span>
            </div>
            <p className="text-xs text-[#8E9991]">
              International seasonal pilgrimage gateway for Bodh Gaya, Mahabodhi Temple, and Gaya Ji ancestral offerings.
            </p>
            <Link
              href="/cars/gaya"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#387F66] pt-1 hover:underline"
            >
              <span>Explore Gaya Cars</span>
              <ArrowRight className="w-3 h-3" />
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
                className="group bg-[#181E19] p-5 rounded-xl border border-[#2B352E] hover:border-[#387F66] transition-all flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-serif text-base font-bold text-[#EEF0EB] group-hover:text-[#387F66] transition-colors">
                      {d.name}
                    </h3>
                    {count > 0 ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#162E24] text-[#387F66] border border-[#2D6A54]/30">
                        {count} {count === 1 ? "car" : "cars"}
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#8E9991]">Regional</span>
                    )}
                  </div>
                  <p className="text-xs text-[#8E9991] line-clamp-2 leading-relaxed mb-3">
                    {d.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#2B352E] flex items-center justify-between text-xs text-[#387F66] font-medium">
                  <span className="truncate text-[11px] text-[#8E9991]">
                    {d.popularHubs[0]?.split("(")[0]?.trim()}
                  </span>
                  <span className="font-bold">&rarr;</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
