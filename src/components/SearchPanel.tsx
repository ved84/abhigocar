"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Compass, Search } from "lucide-react";
import { BIHAR_DISTRICTS } from "@/data/districts";
import { motion } from "framer-motion";

export function SearchPanel({
  initialDistrict = "",
  initialMode = "ALL",
  initialStartDate = "",
  initialEndDate = "",
}: {
  initialDistrict?: string;
  initialMode?: string;
  initialStartDate?: string;
  initialEndDate?: string;
}) {
  const router = useRouter();
  const [district, setDistrict] = useState(initialDistrict);
  const [mode, setMode] = useState(initialMode);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (district && district !== "ALL") params.set("district", district);
    if (mode && mode !== "ALL") params.set("mode", mode);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);

    router.push(`/cars?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="glass-panel rounded-2xl p-6 sm:p-7 shadow-xl text-[#F1F4F7] border border-white/10"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* District Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#A6B2BC] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#E03E36]" />
            District in Bihar
          </label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full h-11 px-3 text-sm glass-input rounded-xl cursor-pointer"
          >
            <option value="ALL" className="bg-[#141A20] text-white">All 38 Bihar Districts</option>
            {BIHAR_DISTRICTS.map((d) => (
              <option key={d.slug} value={d.slug} className="bg-[#141A20] text-white">
                {d.name} {d.isPopular ? "★" : ""} ({d.popularHubs[0]?.split("(")[0]?.trim() || "District Center"})
              </option>
            ))}
          </select>
        </div>

        {/* Rental Mode */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#A6B2BC] flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#E03E36]" />
            Drive Preference
          </label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full h-11 px-3 text-sm glass-input rounded-xl cursor-pointer"
          >
            <option value="ALL" className="bg-[#141A20] text-white">Any (Self-Drive or Chauffeur)</option>
            <option value="SELF_DRIVE" className="bg-[#141A20] text-white">Self-Drive</option>
            <option value="CHAUFFEUR_DRIVEN" className="bg-[#141A20] text-white">Chauffeur-Driven</option>
          </select>
        </div>

        {/* Start Date */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#A6B2BC] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#E03E36]" />
            Pickup Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full h-11 px-3 text-sm glass-input rounded-xl cursor-pointer"
          />
        </div>

        {/* Return Date */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#A6B2BC] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#E03E36]" />
            Return Date
          </label>
          <input
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full h-11 px-3 text-sm glass-input rounded-xl cursor-pointer"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-5 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-[#8F9CA8]">
          Direct WhatsApp booking confirmation with dispatch coordinator at <strong className="text-white">+91 85389 18819</strong>.
        </p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-[#C63832] to-[#B02E28] hover:from-[#E03E36] hover:to-[#C63832] text-white text-xs font-bold transition-all shadow-md shadow-red-950/40 border border-red-400/20 cursor-pointer"
        >
          <Search className="w-4 h-4" />
          <span>Find Available Cars</span>
        </motion.button>
      </div>
    </form>
  );
}
