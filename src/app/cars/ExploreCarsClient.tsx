"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const [isPending, startTransition] = useTransition();

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
  const [startDate, setStartDate] = useState(initialStartDate || "");
  const [endDate, setEndDate] = useState(initialEndDate || "");

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
    const sd = overrides?.startDate !== undefined ? overrides.startDate : startDate;
    const ed = overrides?.endDate !== undefined ? overrides.endDate : endDate;

    if (d && d !== "ALL") params.set("district", d);
    if (c && c !== "ALL") params.set("category", c);
    if (m && m !== "ALL") params.set("mode", m);
    if (f && f !== "ALL") params.set("fuel", f);
    if (t && t !== "ALL") params.set("transmission", t);
    if (s && s !== "ALL") params.set("seats", s);
    if (so) params.set("sort", so);
    if (q) params.set("search", q);
    if (sd) params.set("startDate", sd);
    if (ed) params.set("endDate", ed);

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
    setStartDate("");
    setEndDate("");

    startTransition(() => {
      router.push("/cars");
    });
  };

  return (
    <div>
      {/* Top Bar */}
      <div className="bg-[#181E19] rounded-xl border border-[#2B352E] p-4 mb-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E9991]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            placeholder="Search car make, model, or locality (e.g. Swift, Danapur)..."
            className="w-full h-10 pl-9 pr-4 text-xs sm:text-sm bg-[#101411] border border-[#2B352E] rounded-md text-[#EEF0EB] focus:outline-none focus:border-[#387F66]"
          />
        </div>

        {/* Right side controls */}
        <div className="flex items-center justify-between md:justify-end gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md border border-[#2B352E] bg-[#101411] text-[#EEF0EB]"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#387F66]" />
            <span>Filters</span>
          </button>

          <span className="text-xs text-[#8E9991] hidden sm:inline">
            Showing <strong className="text-[#EEF0EB]">{initialVehicles.length}</strong> available cars
          </span>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8E9991] hidden lg:inline">Sort:</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                applyFilters({ sort: e.target.value });
              }}
              className="h-10 px-3 text-xs bg-[#101411] border border-[#2B352E] rounded-md text-[#EEF0EB] focus:outline-none focus:border-[#387F66]"
            >
              <option value="newest">Newest Fleet First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="seats_desc">Seats: Most Capacity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar + Results */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block md:col-span-4 lg:col-span-3 bg-[#181E19] p-5 rounded-xl border border-[#2B352E] space-y-5 shadow-xs sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-[#2B352E]">
            <h3 className="font-serif text-sm font-bold text-[#EEF0EB] flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#387F66]" />
              Filter Fleet
            </h3>
            <button
              onClick={handleReset}
              className="text-xs text-[#8E9991] hover:text-[#387F66] flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* District */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#8E9991] block text-[11px]">
              District
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full h-9 px-2.5 text-xs bg-[#101411] border border-[#2B352E] rounded-md text-[#EEF0EB]"
            >
              <option value="ALL">All 38 Districts</option>
              {BIHAR_DISTRICTS.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name} {d.isPopular ? "★" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#8E9991] block text-[11px]">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-9 px-2.5 text-xs bg-[#101411] border border-[#2B352E] rounded-md text-[#EEF0EB]"
            >
              <option value="ALL">All Categories</option>
              <option value="HATCHBACK">Hatchback</option>
              <option value="SEDAN">Sedan</option>
              <option value="COMPACT_SUV">Compact SUV</option>
              <option value="SUV">SUV & 4x4</option>
              <option value="MUV_MPV">MUV / MPV (7-Seater)</option>
              <option value="PREMIUM_SUV">Premium SUV</option>
              <option value="ELECTRIC">Electric (EV)</option>
              <option value="WEDDING_EVENT">Wedding & VIP</option>
            </select>
          </div>

          {/* Rental Mode */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#8E9991] block text-[11px]">
              Drive Preference
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full h-9 px-2.5 text-xs bg-[#101411] border border-[#2B352E] rounded-md text-[#EEF0EB]"
            >
              <option value="ALL">Any Mode</option>
              <option value="SELF_DRIVE">Self-Drive</option>
              <option value="CHAUFFEUR_DRIVEN">Chauffeur-Driven</option>
            </select>
          </div>

          {/* Transmission */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#8E9991] block text-[11px]">
              Transmission
            </label>
            <select
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              className="w-full h-9 px-2.5 text-xs bg-[#101411] border border-[#2B352E] rounded-md text-[#EEF0EB]"
            >
              <option value="ALL">Any Transmission</option>
              <option value="MANUAL">Manual</option>
              <option value="AUTOMATIC">Automatic</option>
            </select>
          </div>

          {/* Fuel Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#8E9991] block text-[11px]">
              Fuel Type
            </label>
            <select
              value={fuel}
              onChange={(e) => setFuel(e.target.value)}
              className="w-full h-9 px-2.5 text-xs bg-[#101411] border border-[#2B352E] rounded-md text-[#EEF0EB]"
            >
              <option value="ALL">Any Fuel</option>
              <option value="PETROL">Petrol</option>
              <option value="DIESEL">Diesel</option>
              <option value="CNG">CNG</option>
              <option value="ELECTRIC">Electric</option>
            </select>
          </div>

          {/* Minimum Seats */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#8E9991] block text-[11px]">
              Capacity
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {["ALL", "5", "7"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeats(s)}
                  className={`py-1.5 text-xs font-medium rounded-md border ${
                    seats === s
                      ? "bg-[#2D6A54] text-white border-[#2D6A54]"
                      : "bg-[#101411] text-[#EEF0EB] border-[#2B352E]"
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
            className="w-full py-2.5 rounded-md bg-[#2D6A54] hover:bg-[#387F66] text-white text-xs font-bold transition-colors shadow-xs"
          >
            Apply Filters
          </button>
        </aside>

        {/* Listings Grid */}
        <main className="md:col-span-8 lg:col-span-9">
          {initialVehicles.length === 0 ? (
            <div className="bg-[#181E19] rounded-xl border border-[#2B352E] p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#101411] text-[#387F66] flex items-center justify-center mx-auto">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#EEF0EB]">
                  No vehicles match the selected criteria
                </h3>
                <p className="text-xs text-[#8E9991] max-w-sm mx-auto mt-1">
                  Try clearing specific filters, or message directly on WhatsApp: +91 93540 35140.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md bg-[#2D6A54] text-white hover:bg-[#387F66]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {initialVehicles.map((car) => (
                <VehicleCard key={car.id} vehicle={car} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-end">
          <div className="w-full max-w-xs bg-[#181E19] h-full p-5 overflow-y-auto space-y-5 border-l border-[#2B352E]">
            <div className="flex items-center justify-between pb-3 border-b border-[#2B352E]">
              <h3 className="font-serif text-base font-bold text-[#EEF0EB]">Filters</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-md text-[#8E9991]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold uppercase tracking-wider text-[#8E9991] block mb-1">
                  District
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full h-9 px-2 border border-[#2B352E] rounded-md bg-[#101411] text-[#EEF0EB]"
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
                <label className="font-semibold uppercase tracking-wider text-[#8E9991] block mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-9 px-2 border border-[#2B352E] rounded-md bg-[#101411] text-[#EEF0EB]"
                >
                  <option value="ALL">All Categories</option>
                  <option value="HATCHBACK">Hatchback</option>
                  <option value="SEDAN">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="MUV_MPV">MUV / MPV</option>
                  <option value="ELECTRIC">Electric</option>
                  <option value="WEDDING_EVENT">Wedding & VIP</option>
                </select>
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider text-[#8E9991] block mb-1">
                  Mode
                </label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full h-9 px-2 border border-[#2B352E] rounded-md bg-[#101411] text-[#EEF0EB]"
                >
                  <option value="ALL">Any Mode</option>
                  <option value="SELF_DRIVE">Self-Drive</option>
                  <option value="CHAUFFEUR_DRIVEN">Chauffeur-Driven</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-[#2B352E] flex gap-2">
              <button
                onClick={() => {
                  handleReset();
                  setMobileFilterOpen(false);
                }}
                className="flex-1 py-2 text-xs font-semibold border border-[#2B352E] rounded-md bg-[#101411] text-[#EEF0EB]"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  applyFilters();
                  setMobileFilterOpen(false);
                }}
                className="flex-1 py-2 text-xs font-semibold bg-[#2D6A54] text-white rounded-md"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
