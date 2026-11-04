"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Vehicle } from "@/types";
import { BIHAR_DISTRICTS } from "@/data/districts";
import { VehicleCard } from "@/components/VehicleCard";
import {
  Filter,
  X,
  SlidersHorizontal,
  RotateCcw,
  Search,
  Car,
} from "lucide-react";

export function ExploreCarsClient({
  initialVehicles,
  initialDistrict,
  initialCategory,
  initialMode,
  initialSort,
  initialFuel,
  initialTransmission,
  initialSeats,
  initialSearch,
  initialStartDate,
  initialEndDate,
}: {
  initialVehicles: Vehicle[];
  initialDistrict?: string;
  initialCategory?: string;
  initialMode?: string;
  initialSort?: string;
  initialFuel?: string;
  initialTransmission?: string;
  initialSeats?: string;
  initialSearch?: string;
  initialStartDate?: string;
  initialEndDate?: string;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter states
  const [district, setDistrict] = useState(initialDistrict || "ALL");
  const [category, setCategory] = useState(initialCategory || "ALL");
  const [mode, setMode] = useState(initialMode || "ALL");
  const [fuel, setFuel] = useState(initialFuel || "ALL");
  const [transmission, setTransmission] = useState(initialTransmission || "ALL");
  const [seats, setSeats] = useState(initialSeats || "ALL");
  const [sort, setSort] = useState(initialSort || "newest");
  const [searchTerm, setSearchTerm] = useState(initialSearch || "");
  const [startDate] = useState(initialStartDate || "");
  const [endDate] = useState(initialEndDate || "");

  const applyFilters = (overrides?: Record<string, string>) => {
    const params = new URLSearchParams();

    const d = overrides?.district !== undefined ? overrides.district : district;
    const c = overrides?.category !== undefined ? overrides.category : category;
    const m = overrides?.mode !== undefined ? overrides.mode : mode;
    const f = overrides?.fuel !== undefined ? overrides.fuel : fuel;
    const t = overrides?.transmission !== undefined ? overrides.transmission : transmission;
    const s = overrides?.seats !== undefined ? overrides.seats : seats;
    const so = overrides?.sort !== undefined ? overrides.sort : sort;
    const q = overrides?.search !== undefined ? overrides.search : searchTerm;

    if (d && d !== "ALL") params.set("district", d);
    if (c && c !== "ALL") params.set("category", c);
    if (m && m !== "ALL") params.set("mode", m);
    if (f && f !== "ALL") params.set("fuel", f);
    if (t && t !== "ALL") params.set("transmission", t);
    if (s && s !== "ALL") params.set("seats", s);
    if (so) params.set("sort", so);
    if (q) params.set("search", q);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);

    startTransition(() => {
      router.push(`/cars?${params.toString()}`);
    });
  };

  const handleReset = () => {
    setDistrict("ALL");
    setCategory("ALL");
    setMode("ALL");
    setFuel("ALL");
    setTransmission("ALL");
    setSeats("ALL");
    setSort("newest");
    setSearchTerm("");

    startTransition(() => {
      router.push("/cars");
    });
  };

  return (
    <div className="text-[#F0F6FC]">
      {/* Top Search & Sort Bar */}
      <div className="bg-[#161B22] rounded-xl p-4 mb-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#30363D]">
        {/* Search Input */}
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            placeholder="Search make, model, or city (e.g. Swift, Bailey Road, City)..."
            className="w-full h-11 pl-10 pr-4 text-xs sm:text-sm clean-input rounded-lg placeholder-[#6E7681]"
          />
        </div>

        {/* Right side controls */}
        <div className="flex items-center justify-between md:justify-end gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-[#21262D] border border-[#30363D] text-white"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#E03E36]" />
            <span>Filters</span>
          </button>

          <span className="text-xs text-[#9CA3AF] hidden sm:inline">
            Showing <strong className="text-white">{initialVehicles.length}</strong> vehicles
          </span>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#9CA3AF] hidden lg:inline">Sort:</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                applyFilters({ sort: e.target.value });
              }}
              className="h-11 px-3 text-xs bg-[#0D1117] border border-[#30363D] text-white rounded-lg cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C63832]"
            >
              <option value="newest" className="bg-[#161B22] text-white">Newest First</option>
              <option value="seats_desc" className="bg-[#161B22] text-white">Seats: 7+ Passenger</option>
              <option value="seats_asc" className="bg-[#161B22] text-white">Seats: Compact (4-5)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar + Results */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block md:col-span-4 lg:col-span-3 bg-[#161B22] p-5 rounded-xl space-y-4 shadow-sm sticky top-24 border border-[#30363D]">
          <div className="flex items-center justify-between pb-3 border-b border-[#30363D]">
            <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#E03E36]" />
              Filter Cars
            </h3>
            <button
              onClick={handleReset}
              className="text-xs text-[#9CA3AF] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* District */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] block text-[11px]">
              District
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full h-10 px-3 text-xs bg-[#0D1117] border border-[#30363D] text-white rounded-lg cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C63832]"
            >
              <option value="ALL" className="bg-[#161B22] text-white">All 38 Districts</option>
              {BIHAR_DISTRICTS.map((d) => (
                <option key={d.slug} value={d.slug} className="bg-[#161B22] text-white">
                  {d.name} {d.isPopular ? "★" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] block text-[11px]">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 px-3 text-xs bg-[#0D1117] border border-[#30363D] text-white rounded-lg cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C63832]"
            >
              <option value="ALL" className="bg-[#161B22] text-white">All Categories</option>
              <option value="HATCHBACK" className="bg-[#161B22] text-white">Hatchback</option>
              <option value="SEDAN" className="bg-[#161B22] text-white">Sedan</option>
              <option value="COMPACT_SUV" className="bg-[#161B22] text-white">Compact SUV</option>
              <option value="SUV" className="bg-[#161B22] text-white">SUV & 4x4</option>
              <option value="MUV_MPV" className="bg-[#161B22] text-white">MUV / MPV (7-Seater)</option>
              <option value="PREMIUM_SUV" className="bg-[#161B22] text-white">Premium SUV</option>
              <option value="ELECTRIC" className="bg-[#161B22] text-white">Electric (EV)</option>
              <option value="WEDDING_EVENT" className="bg-[#161B22] text-white">Wedding & VIP</option>
            </select>
          </div>

          {/* Rental Mode */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] block text-[11px]">
              Drive Preference
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full h-10 px-3 text-xs bg-[#0D1117] border border-[#30363D] text-white rounded-lg cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C63832]"
            >
              <option value="ALL" className="bg-[#161B22] text-white">Any Mode</option>
              <option value="SELF_DRIVE" className="bg-[#161B22] text-white">Self-Drive</option>
              <option value="CHAUFFEUR_DRIVEN" className="bg-[#161B22] text-white">Chauffeur-Driven</option>
            </select>
          </div>

          {/* Transmission */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] block text-[11px]">
              Transmission
            </label>
            <select
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              className="w-full h-10 px-3 text-xs bg-[#0D1117] border border-[#30363D] text-white rounded-lg cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C63832]"
            >
              <option value="ALL" className="bg-[#161B22] text-white">Any Transmission</option>
              <option value="MANUAL" className="bg-[#161B22] text-white">Manual</option>
              <option value="AUTOMATIC" className="bg-[#161B22] text-white">Automatic</option>
            </select>
          </div>

          {/* Fuel Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] block text-[11px]">
              Fuel Type
            </label>
            <select
              value={fuel}
              onChange={(e) => setFuel(e.target.value)}
              className="w-full h-10 px-3 text-xs bg-[#0D1117] border border-[#30363D] text-white rounded-lg cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C63832]"
            >
              <option value="ALL" className="bg-[#161B22] text-white">Any Fuel</option>
              <option value="PETROL" className="bg-[#161B22] text-white">Petrol</option>
              <option value="DIESEL" className="bg-[#161B22] text-white">Diesel</option>
              <option value="CNG" className="bg-[#161B22] text-white">CNG</option>
              <option value="ELECTRIC" className="bg-[#161B22] text-white">Electric</option>
            </select>
          </div>

          {/* Minimum Seats */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] block text-[11px]">
              Seating Capacity
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {["ALL", "5", "7"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeats(s)}
                  className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer border ${
                    seats === s
                      ? "bg-[#C63832] text-white border-red-500/50"
                      : "bg-[#0D1117] border-[#30363D] text-[#9CA3AF] hover:text-white"
                  }`}
                >
                  {s === "ALL" ? "Any" : `${s}+ Seats`}
                </button>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          <button
            onClick={() => applyFilters()}
            className="w-full py-2.5 rounded-lg bg-[#C63832] hover:bg-[#E03E36] text-white text-xs font-bold transition-colors shadow-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C63832]"
          >
            Apply Filters
          </button>
        </aside>

        {/* Listings Grid */}
        <main className="md:col-span-8 lg:col-span-9">
          {initialVehicles.length === 0 ? (
            <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-12 text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#0D1117] text-[#E03E36] flex items-center justify-center mx-auto border border-[#30363D]">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white">
                  No vehicles match your active filters
                </h3>
                <p className="text-xs text-[#9CA3AF] max-w-sm mx-auto mt-1">
                  Try clearing specific filters, or enquire directly on WhatsApp: +91 85389 18819.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-[#C63832] hover:bg-[#E03E36] text-white cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {initialVehicles.map((car) => (
                <VehicleCard key={car.id} vehicle={car} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex justify-end" role="dialog" aria-modal="true">
          <div className="w-full max-w-xs bg-[#161B22] h-full p-5 overflow-y-auto space-y-5 border-l border-[#30363D] text-[#F0F6FC]">
            <div className="flex items-center justify-between pb-3 border-b border-[#30363D]">
              <h3 className="font-display text-base font-bold text-white">Filter Cars</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-md text-[#9CA3AF] hover:text-white cursor-pointer"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold uppercase tracking-wider text-[#9CA3AF] block mb-1">
                  District
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full h-9 px-2.5 text-xs bg-[#0D1117] border border-[#30363D] rounded-lg text-[#F0F6FC]"
                >
                  <option value="ALL">All 38 Districts</option>
                  {BIHAR_DISTRICTS.map((d) => (
                    <option key={d.slug} value={d.slug}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-[#9CA3AF] block mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-9 px-2.5 text-xs bg-[#0D1117] border border-[#30363D] rounded-lg text-[#F0F6FC]"
                >
                  <option value="ALL">All Categories</option>
                  <option value="HATCHBACK">Hatchback</option>
                  <option value="SEDAN">Sedan</option>
                  <option value="COMPACT_SUV">Compact SUV</option>
                  <option value="SUV">SUV & 4x4</option>
                  <option value="MUV_MPV">MUV / MPV (7-Seater)</option>
                  <option value="PREMIUM_SUV">Premium SUV</option>
                  <option value="ELECTRIC">Electric (EV)</option>
                </select>
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-[#9CA3AF] block mb-1">
                  Drive Preference
                </label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full h-9 px-2.5 text-xs bg-[#0D1117] border border-[#30363D] rounded-lg text-[#F0F6FC]"
                >
                  <option value="ALL">Any Mode</option>
                  <option value="SELF_DRIVE">Self-Drive</option>
                  <option value="CHAUFFEUR_DRIVEN">Chauffeur-Driven</option>
                </select>
              </div>

              <button
                onClick={() => {
                  applyFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-2.5 rounded-lg bg-[#C63832] hover:bg-[#E03E36] text-white text-xs font-bold cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
