"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Compass, Search } from "lucide-react";
import { BIHAR_DISTRICTS } from "@/data/districts";

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
      className="bg-[#181E19] rounded-xl border border-[#2B352E] p-4 sm:p-5 shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* District Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#8E9991] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#387F66]" />
            District in Bihar
          </label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full h-11 px-3 text-sm bg-[#101411] border border-[#2B352E] rounded-md text-[#EEF0EB] focus:outline-none focus:border-[#387F66] transition-colors"
          >
            <option value="ALL">All 38 Bihar Districts</option>
            {BIHAR_DISTRICTS.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name} {d.isPopular ? "★" : ""} ({d.popularHubs[0]?.split("(")[0]?.trim() || "District Center"})
              </option>
            ))}
          </select>
        </div>

        {/* Rental Mode */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#8E9991] flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#387F66]" />
            Drive Preference
          </label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full h-11 px-3 text-sm bg-[#101411] border border-[#2B352E] rounded-md text-[#EEF0EB] focus:outline-none focus:border-[#387F66] transition-colors"
          >
            <option value="ALL">Any (Self-Drive or Chauffeur)</option>
            <option value="SELF_DRIVE">Self-Drive</option>
            <option value="CHAUFFEUR_DRIVEN">Chauffeur-Driven</option>
          </select>
        </div>

        {/* Start Date */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#8E9991] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#387F66]" />
            Pickup Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full h-11 px-3 text-sm bg-[#101411] border border-[#2B352E] rounded-md text-[#EEF0EB] focus:outline-none focus:border-[#387F66] transition-colors"
          />
        </div>

        {/* Return Date */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#8E9991] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#387F66]" />
            Return Date
          </label>
          <input
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full h-11 px-3 text-sm bg-[#101411] border border-[#2B352E] rounded-md text-[#EEF0EB] focus:outline-none focus:border-[#387F66] transition-colors"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-4 pt-4 border-t border-[#2B352E] flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-[#8E9991]">
          Direct WhatsApp booking confirmation with dispatch coordinator at <strong className="text-[#EEF0EB]">+91 93540 35140</strong>.
        </p>
        <button
          type="submit"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md bg-[#2D6A54] hover:bg-[#387F66] text-white text-sm font-semibold transition-all shadow-xs"
        >
          <Search className="w-4 h-4" />
          <span>Find Available Cars</span>
        </button>
      </div>
    </form>
  );
}
