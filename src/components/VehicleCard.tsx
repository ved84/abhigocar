"use client";

import Link from "next/link";
import { Users, Fuel, Gauge, MapPin, Check } from "lucide-react";
import { Vehicle } from "@/types";
import { formatINR } from "@/lib/pricing";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const coverImage = vehicle.images.find((img) => img.isCover) || vehicle.images[0];
  const imageUrl = coverImage?.url || "/cars/maruti-swift.jpg";

  const formatCategory = (cat: string) => {
    switch (cat) {
      case "HATCHBACK":
        return "City Hatchback";
      case "SEDAN":
        return "Executive Sedan";
      case "COMPACT_SUV":
        return "Compact SUV";
      case "SUV":
        return "Rugged 4x4 SUV";
      case "PREMIUM_SUV":
        return "Premium SUV";
      case "MUV_MPV":
        return "7-Seater Family MUV";
      case "ELECTRIC":
        return "Clean Electric EV";
      case "WEDDING_EVENT":
        return "VIP Luxury";
      default:
        return cat.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    }
  };

  const getDriveModeLabel = (mode: string) => {
    if (mode === "BOTH") return "Self-Drive or Chauffeur";
    if (mode === "CHAUFFEUR_DRIVEN") return "Chauffeur Driven";
    return "Self-Drive Available";
  };

  return (
    <article className="solid-card rounded-2xl overflow-hidden flex flex-col justify-between group">
      {/* Automotive Photography Container */}
      <div className="relative aspect-[16/10] w-full bg-[#0D1117] overflow-hidden border-b border-[#30363D]">
        <img
          src={imageUrl}
          alt={`${vehicle.make} ${vehicle.model} available for rent in ${vehicle.locality}, Bihar`}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
          loading="lazy"
        />

        {/* Category & Status Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-[#0D1117]/90 text-white rounded-md border border-[#30363D]">
            {formatCategory(vehicle.category)}
          </span>
          {vehicle.isFeatured && (
            <span className="px-2.5 py-1 text-[11px] font-bold bg-[#C63832] text-white rounded-md border border-red-500/30">
              Featured Car
            </span>
          )}
        </div>

        {/* Hub Location Badge */}
        <div className="absolute bottom-3 left-3 bg-[#0D1117]/90 text-white text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-[#30363D] z-10">
          <MapPin className="w-3.5 h-3.5 text-[#E03E36]" />
          <span className="capitalize">{vehicle.locality}, {vehicle.districtId}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          {/* Title & Trim */}
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <h3 className="font-display text-lg font-bold text-white group-hover:text-[#E03E36] transition-colors leading-snug">
              {vehicle.make} {vehicle.model}
            </h3>
            <span className="text-xs text-[#9CA3AF] font-mono px-2 py-0.5 rounded bg-[#21262D] border border-[#30363D]">
              {vehicle.year}
            </span>
          </div>

          <p className="text-xs text-[#9CA3AF] mb-3">
            {vehicle.variant} • <span className="text-[#F0F6FC] font-medium">{getDriveModeLabel(vehicle.rentalMode)}</span>
          </p>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-[#30363D] text-xs text-[#9CA3AF] mb-4 bg-[#0D1117] rounded-lg px-2">
            <div className="flex items-center gap-1.5 justify-center py-1">
              <Users className="w-3.5 h-3.5 text-[#E03E36]" />
              <span className="font-semibold text-white">{vehicle.seats} Seats</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center py-1 border-x border-[#30363D]">
              <Gauge className="w-3.5 h-3.5 text-[#E03E36]" />
              <span className="capitalize font-semibold text-white">{vehicle.transmission.toLowerCase()}</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center py-1">
              <Fuel className="w-3.5 h-3.5 text-[#E03E36]" />
              <span className="capitalize font-semibold text-white">{vehicle.fuelType.toLowerCase()}</span>
            </div>
          </div>
        </div>

        {/* Pricing, Allowance & Primary Action */}
        <div className="pt-2 flex items-end justify-between gap-3 border-t border-[#30363D]/60">
          <div>
            <div className="text-lg font-extrabold text-[#E03E36] leading-none">
              {formatINR(vehicle.dailyPrice)}
              <span className="text-xs font-normal text-[#9CA3AF]">/day</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#9CA3AF] mt-1">
              <Check className="w-3 h-3 text-[#E03E36]" />
              <span>{vehicle.includedKmPerDay} km/day included</span>
            </div>
          </div>

          <Link
            href={`/cars/${(vehicle.districtId || "patna").toLowerCase().trim()}/${vehicle.slug.trim()}`}
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-lg bg-[#C63832] hover:bg-[#E03E36] text-white transition-colors focus-visible:ring-2 focus-visible:ring-[#C63832] shrink-0"
          >
            <span>View & Book</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
