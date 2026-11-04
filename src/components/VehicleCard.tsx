import Link from "next/link";
import { Users, Fuel, Gauge, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { Vehicle } from "@/types";
import { formatINR } from "@/lib/pricing";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const coverImage = vehicle.images.find((img) => img.isCover) || vehicle.images[0];
  const imageUrl =
    coverImage?.url ||
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80";

  const formatCategory = (cat: string) => {
    return cat.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <article className="group bg-[#181E19] rounded-xl border border-[#2B352E] overflow-hidden hover:border-[#387F66] transition-all duration-200 flex flex-col justify-between shadow-xs">
      {/* Top Image Container */}
      <div className="relative aspect-[16/10] w-full bg-[#121613] overflow-hidden">
        <img
          src={imageUrl}
          alt={`${vehicle.make} ${vehicle.model} in ${vehicle.locality}`}
          className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-300"
          loading="lazy"
        />

        {/* Category & Status Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider bg-[#101411]/90 text-[#EEF0EB] rounded-md backdrop-blur-xs border border-[#2B352E]">
            {formatCategory(vehicle.category)}
          </span>
          {vehicle.isFeatured && (
            <span className="px-2 py-1 text-[11px] font-semibold bg-[#D4A359] text-[#101411] rounded-md flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3" />
              Featured
            </span>
          )}
        </div>

        {/* District Locality Tag */}
        <div className="absolute bottom-3 left-3 bg-[#101411]/90 text-[#EEF0EB] text-xs font-medium px-2.5 py-1 rounded-md flex items-center gap-1 border border-[#2B352E] backdrop-blur-xs">
          <MapPin className="w-3.5 h-3.5 text-[#387F66]" />
          <span className="capitalize">{vehicle.locality}, {vehicle.districtId}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          {/* Title & Year */}
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <h3 className="font-serif text-lg font-bold text-[#EEF0EB] group-hover:text-[#387F66] transition-colors leading-snug">
              {vehicle.make} {vehicle.model}
            </h3>
            <span className="text-xs text-[#8E9991] font-medium shrink-0">
              {vehicle.year}
            </span>
          </div>
          <p className="text-xs text-[#8E9991] mb-4 line-clamp-1">
            {vehicle.variant} • {vehicle.rentalMode === "BOTH" ? "Self-Drive or Chauffeur" : vehicle.rentalMode.replace(/_/g, " ")}
          </p>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-[#2B352E] text-xs text-[#8E9991] mb-4">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#387F66]" />
              <span>{vehicle.seats} Seats</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-[#387F66]" />
              <span className="capitalize">{vehicle.transmission.toLowerCase()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-[#387F66]" />
              <span className="capitalize">{vehicle.fuelType.toLowerCase()}</span>
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-[#EEF0EB]">
                {formatINR(vehicle.dailyPrice)}
              </span>
              <span className="text-xs text-[#8E9991]">/ day</span>
            </div>
            <div className="text-[11px] text-[#8E9991]">
              Deposit: {formatINR(vehicle.securityDeposit)} • {vehicle.includedKmPerDay} km/day
            </div>
          </div>

          <Link
            href={`/cars/${vehicle.districtId}/${vehicle.slug}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-md bg-[#2D6A54] text-white hover:bg-[#387F66] transition-colors shrink-0 shadow-xs"
          >
            <span>Book Car</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
