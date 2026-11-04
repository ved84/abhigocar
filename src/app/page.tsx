"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { store } from "@/lib/store";
import { BIHAR_DISTRICTS } from "@/data/districts";
import { INITIAL_VEHICLES } from "@/data/mockVehicles";
import { VehicleCard } from "@/components/VehicleCard";
import { HindiRulesSection } from "@/components/HindiRulesSection";
import { HeroEnquiryBox } from "@/components/HeroEnquiryBox";
import { Vehicle } from "@/types";
import {
  CheckCircle2,
  MessageCircle,
} from "lucide-react";

const HERO_BACKGROUND_IMAGES = [
  { url: "/cars/mahindra-scorpio.jpg", name: "Mahindra Scorpio-N 4x4" },
  { url: "/cars/toyota-innova-crysta.jpg", name: "Toyota Innova Crysta" },
  { url: "/cars/honda-city.jpg", name: "Honda City Executive" },
  { url: "/cars/toyota-fortuner.jpg", name: "Toyota Fortuner Legender" },
  { url: "/cars/maruti-swift.jpg", name: "Maruti Suzuki Swift" },
  { url: "/cars/mahindra-thar.jpg", name: "Mahindra Thar 4x4" },
];

export default function HomePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => INITIAL_VEHICLES);
  const [showAllVehicles, setShowAllVehicles] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Sync with live API so additions or deletions from admin reflect instantly on home page
  useEffect(() => {
    let isMounted = true;

    const fetchVehicles = () => {
      fetch("/api/vehicles", { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          if (isMounted && Array.isArray(data?.vehicles)) {
            setVehicles(data.vehicles);
          }
        })
        .catch(() => {});
    };

    fetchVehicles();

    // 1. Re-fetch when user refocuses the tab (e.g. returning from admin dashboard)
    window.addEventListener("focus", fetchVehicles);

    // 2. Re-fetch when admin updates or deletes vehicles
    const handleSync = () => fetchVehicles();
    window.addEventListener("abhigocar_vehicles_synced", handleSync);
    window.addEventListener("storage", handleSync);

    // 3. Keep fresh with background interval
    const interval = setInterval(fetchVehicles, 6000);

    return () => {
      isMounted = false;
      window.removeEventListener("focus", fetchVehicles);
      window.removeEventListener("abhigocar_vehicles_synced", handleSync);
      window.removeEventListener("storage", handleSync);
      clearInterval(interval);
    };
  }, []);

  // Cycle hero background images every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % HERO_BACKGROUND_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const keyDistricts = BIHAR_DISTRICTS.filter((d) => d.isPopular);
  const displayedCars = showAllVehicles ? vehicles : vehicles.slice(0, 9);

  return (
    <div className="bg-[#0D1117] text-[#F0F6FC]">
      {/* 1. Hero Section - Grounded Automotive Focus with Dynamic Car Background */}
      <section className="relative pt-10 pb-16 lg:py-20 border-b border-[#30363D] bg-[#0D1117] overflow-hidden">
        {/* Dynamic cycling automotive car background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
          {HERO_BACKGROUND_IMAGES.map((img, idx) => (
            <div
              key={img.url}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                idx === currentBgIndex
                  ? "opacity-85 sm:opacity-95 scale-100"
                  : "opacity-0 scale-105"
              }`}
              style={{
                backgroundImage: `url('${img.url}')`,
                backgroundPosition: "center 45%",
                backgroundSize: "cover",
              }}
            />
          ))}
          {/* Subtle directional scrim: keeps copy crisp on the left while keeping the car photo bright and clearly visible */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D1117]/90 via-[#0D1117]/50 to-[#0D1117]/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117]/75 via-transparent to-[#0D1117]/20" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Narrative Copy */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                Verified Car Rentals in Bihar. <br />
                <span className="text-[#E03E36]">
                  Direct WhatsApp Booking.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#9CA3AF] max-w-xl leading-relaxed">
                Clean commercial yellow-plate self-drive hatchbacks, Honda City executive sedans, Brezza and Scorpio-N SUVs, and Toyota Innova Crystas delivered to Patna Airport, Gaya, Muzaffarpur, Darbhanga, and all Bihar transit hubs.
              </p>

              {/* Verified Car Rental Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#F0F6FC] pt-1">
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#161B22]/90 backdrop-blur-xs border border-[#30363D]">
                  <CheckCircle2 className="w-4 h-4 text-[#E03E36] shrink-0" />
                  <span className="font-medium">250 km/day generous allowance</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#161B22]/90 backdrop-blur-xs border border-[#30363D]">
                  <CheckCircle2 className="w-4 h-4 text-[#E03E36] shrink-0" />
                  <span className="font-medium">Yellow-plate commercial cars</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#161B22]/90 backdrop-blur-xs border border-[#30363D]">
                  <CheckCircle2 className="w-4 h-4 text-[#E03E36] shrink-0" />
                  <span className="font-medium">Direct deposit refund upon return</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#161B22]/90 backdrop-blur-xs border border-[#30363D]">
                  <CheckCircle2 className="w-4 h-4 text-[#E03E36] shrink-0" />
                  <span className="font-medium">Helpline: +91 85389 18819</span>
                </div>
              </div>

              {/* Direct Actions & Car Slide Indicator */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="https://wa.me/918538918819"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#C63832] hover:bg-[#E03E36] text-white text-xs font-bold transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-[#C63832]"
                >
                  <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                  <span>Chat on WhatsApp (+91 85389 18819)</span>
                </a>

                <Link
                  href="/cars"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg bg-[#161B22] hover:bg-[#21262D] text-white text-xs font-bold transition-colors border border-[#30363D] focus-visible:ring-2 focus-visible:ring-[#C63832]"
                >
                  <span suppressHydrationWarning>Browse All {vehicles.length} Cars</span>
                </Link>
              </div>

              {/* Live Backdrop Indicator */}
              <div className="pt-1 flex items-center gap-2 text-[11px] text-[#8B949E]">
                <span>Car spotlight:</span>
                <span className="font-semibold text-[#C9D1D9]">
                  {HERO_BACKGROUND_IMAGES[currentBgIndex].name}
                </span>
                <div className="flex items-center gap-1 ml-2">
                  {HERO_BACKGROUND_IMAGES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentBgIndex(i)}
                      className={`h-1 rounded-full transition-all cursor-pointer ${
                        i === currentBgIndex ? "w-4 bg-[#E03E36]" : "w-1.5 bg-[#30363D] hover:bg-[#8B949E]"
                      }`}
                      aria-label={`View background ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Interactive Hero Enquiry Box */}
            <div className="lg:col-span-5 relative w-full">
              <HeroEnquiryBox vehicles={vehicles} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Cars Section */}
      <section className="py-14 sm:py-16 lg:py-20 border-b border-[#30363D] bg-[#0D1117]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
            <div>
              <span suppressHydrationWarning className="text-xs font-bold uppercase tracking-wider text-[#E03E36] block">
                Available Cars ({vehicles.length} Active Listings)
              </span>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-1">
                Featured Cars Ready to Drive
              </h2>
              <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1">
                Clean commercial cars stationed at airport terminals and district headquarters.
              </p>
            </div>
            <Link
              href="/cars"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E03E36] hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-[#C63832] rounded self-start sm:self-auto"
            >
              <span>View all available cars</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {displayedCars.map((car) => (
              <VehicleCard key={car.id} vehicle={car} />
            ))}
          </div>

          {vehicles.length > 9 && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setShowAllVehicles(!showAllVehicles)}
                className="px-6 py-3 rounded-lg bg-[#161B22] text-white text-xs font-bold hover:bg-[#21262D] transition-colors border border-[#30363D] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C63832]"
              >
                {showAllVehicles
                  ? "Show Fewer Cars"
                  : `Show All (${vehicles.length} Total Vehicles)`}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4. District Coverage Section */}
      <section className="py-14 sm:py-16 lg:py-20 border-b border-[#30363D] bg-[#0D1117]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#E03E36] block">
                Statewide Network
              </span>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-1">
                Browse Cars by District & Transit Hubs
              </h2>
              <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1 max-w-xl">
                Direct vehicle handover at Jay Prakash Narayan Airport (PAT), Darbhanga Airport (DHR), Gaya Airport (GAY), and district junctions across Bihar.
              </p>
            </div>
            <Link
              href="/districts"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E03E36] hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-[#C63832] rounded self-start sm:self-auto"
            >
              <span>See all 38 districts</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {keyDistricts.map((d) => (
              <Link
                key={d.slug}
                href={`/cars/${d.slug}`}
                className="solid-card p-5 rounded-xl flex flex-col justify-between group focus-visible:ring-2 focus-visible:ring-[#C63832]"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display text-base sm:text-lg font-bold text-white group-hover:text-[#E03E36] transition-colors">
                      {d.name}
                    </h3>
                    <span className="text-[10px] text-[#C9D1D9] font-medium px-2 py-0.5 rounded bg-[#21262D] border border-[#30363D]">
                      {d.slug === "patna" ? "Airport + Rly" : "Active Hub"}
                    </span>
                  </div>
                  <p className="text-xs text-[#9CA3AF] line-clamp-2 leading-relaxed mb-4">
                    {d.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#30363D] flex items-center justify-between text-xs text-[#E03E36] font-semibold">
                  <span>Explore Cars in {d.name}</span>
                  <span className="group-hover:text-white transition-colors">Select</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Hindi Rules Section */}
      <HindiRulesSection />

      {/* 6. Handover & Rental Workflow */}
      <section id="how-it-works" className="py-14 sm:py-16 lg:py-20 border-b border-[#30363D] bg-[#0D1117]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E03E36] block">
              Handover Procedure
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-1">
              How Renting on abhigocar Works
            </h2>
            <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1">
              Direct verification and transparent vehicle handover designed for hassle-free travel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#161B22] p-5 sm:p-6 rounded-xl border border-[#30363D] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#21262D] text-[#E03E36] flex items-center justify-center font-mono font-bold text-sm">
                01
              </div>
              <h3 className="font-display text-base font-bold text-white">
                Vehicle Selection
              </h3>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Choose your car model, rental mode (self-drive or chauffeur), and pickup district from our catalog.
              </p>
            </div>

            <div className="bg-[#161B22] p-5 sm:p-6 rounded-xl border border-[#30363D] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#21262D] text-[#E03E36] flex items-center justify-center font-mono font-bold text-sm">
                02
              </div>
              <h3 className="font-display text-base font-bold text-white">
                WhatsApp KYC Verification
              </h3>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Send your valid driving license and ID on WhatsApp (+91 85389 18819) to lock your reservation slot.
              </p>
            </div>

            <div className="bg-[#161B22] p-5 sm:p-6 rounded-xl border border-[#30363D] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#21262D] text-[#E03E36] flex items-center justify-center font-mono font-bold text-sm">
                03
              </div>
              <h3 className="font-display text-base font-bold text-white">
                Inspection & Handover
              </h3>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Receive the vehicle at your airport terminal, junction, or door with odometer log and fuel check.
              </p>
            </div>

            <div className="bg-[#161B22] p-5 sm:p-6 rounded-xl border border-[#30363D] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#21262D] text-[#E03E36] flex items-center justify-center font-mono font-bold text-sm">
                04
              </div>
              <h3 className="font-display text-base font-bold text-white">
                Return & Instant Deposit Refund
              </h3>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Return the vehicle at the agreed hub. Your security deposit is refunded immediately upon inspection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Bottom Direct CTA Section */}
      <section className="py-16 sm:py-20 bg-[#161B22] text-center border-t border-[#30363D]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E03E36] block">
            Direct Dispatch Desk
          </span>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Need a Car Delivered in Bihar Today?
          </h2>

          <p className="text-xs sm:text-sm text-[#9CA3AF] max-w-xl mx-auto leading-relaxed">
            Message our team with your pickup city and travel dates. We confirm vehicle availability and handover time promptly.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <a
              href="https://wa.me/918538918819"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-lg bg-[#C63832] hover:bg-[#E03E36] text-white text-xs sm:text-sm font-bold shadow-md transition-colors focus-visible:ring-2 focus-visible:ring-[#C63832]"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Chat on WhatsApp: +91 85389 18819</span>
            </a>

            <Link
              href="/cars"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#0D1117] hover:bg-[#21262D] text-white text-xs sm:text-sm font-bold transition-colors border border-[#30363D] focus-visible:ring-2 focus-visible:ring-[#C63832]"
            >
              <span>Explore All Vehicles</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
