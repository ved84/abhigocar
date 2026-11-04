"use client";

import Link from "next/link";
import { Users, Fuel, Gauge, MapPin, ArrowRight, Sparkles, Check } from "lucide-react";
import { Vehicle } from "@/types";
import { motion } from "framer-motion";

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
    if (mode === "CHAUFFEUR_DRIVEN") return "With Chauffeur Only";
    return "Self-Drive Available";
  };

  return (
    <motion.article
      whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
      className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group relative"
    >
      {/* Automotive Photography Container */}
      <div className="relative aspect-[16/10] w-full bg-[#0B0F13] overflow-hidden">
        <img
          src={imageUrl}
          alt={`${vehicle.make} ${vehicle.model} in ${vehicle.locality}`}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white rounded-full border border-white/10 shadow-sm">
            {formatCategory(vehicle.category)}
          </span>
          {vehicle.isFeatured && (
            <span className="px-2.5 py-1 text-[11px] font-bold bg-[#C63832] text-white rounded-full flex items-center gap-1 shadow-md shadow-red-950/60 border border-red-400/30">
              <Sparkles className="w-3 h-3" />
              Featured
            </span>
          )}
        </div>

        {/* Hub Location Badge */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10 z-10">
          <MapPin className="w-3.5 h-3.5 text-[#E03E36]" />
          <span className="capitalize">{vehicle.locality}, {vehicle.districtId}</span>
        </div>

        {/* Subtle photo gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E1216] via-transparent to-transparent opacity-60" />
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between">
        <div>
          {/* Title & Trim */}
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <h3 className="font-display text-xl font-bold text-white group-hover:text-[#FF6B64] transition-colors leading-snug">
              {vehicle.make} {vehicle.model}
            </h3>
            <span className="text-xs text-[#8F9CA8] font-mono shrink-0 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10">
              {vehicle.year}
            </span>
          </div>

          <p className="text-xs text-[#8F9CA8] mb-4">
            {vehicle.variant} • <span className="text-white font-semibold">{getDriveModeLabel(vehicle.rentalMode)}</span>
          </p>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/[0.08] text-xs text-[#8F9CA8] mb-4 bg-white/[0.02] rounded-xl px-2">
            <div className="flex items-center gap-1.5 justify-center py-1">
              <Users className="w-3.5 h-3.5 text-[#E03E36]" />
              <span className="font-semibold text-white">{vehicle.seats} Seats</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center py-1 border-x border-white/[0.08]">
              <Gauge className="w-3.5 h-3.5 text-[#E03E36]" />
              <span className="capitalize font-semibold text-white">{vehicle.transmission.toLowerCase()}</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center py-1">
              <Fuel className="w-3.5 h-3.5 text-[#E03E36]" />
              <span className="capitalize font-semibold text-white">{vehicle.fuelType.toLowerCase()}</span>
            </div>
          </div>
        </div>

        {/* Footer & CTA */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1 text-xs font-bold text-white">
              <Check className="w-3.5 h-3.5 text-[#E03E36]" />
              <span>{vehicle.includedKmPerDay} km/day allowance</span>
            </div>
            <span className="text-[11px] text-[#8F9CA8]">Direct WhatsApp Booking</span>
          </div>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link
              href={`/cars/${vehicle.districtId}/${vehicle.slug}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#C63832] to-[#B02E28] hover:from-[#E03E36] hover:to-[#C63832] text-white transition-all shrink-0 shadow-md shadow-red-950/40 border border-red-400/20"
            >
              <span>Book Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}
