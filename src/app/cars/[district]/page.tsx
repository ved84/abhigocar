import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { BIHAR_DISTRICTS, findDistrict } from "@/data/districts";
import { store } from "@/lib/store";
import { INITIAL_VEHICLES } from "@/data/mockVehicles";
import { VehicleCard } from "@/components/VehicleCard";
import { SearchPanel } from "@/components/SearchPanel";
import { MapPin, Navigation, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ district: string }>;
}): Promise<Metadata> {
  const { district: slug } = await params;
  const clean = decodeURIComponent(slug).toLowerCase().trim();
  const district = findDistrict(clean);

  if (!district) {
    return { title: "Cars in District | abhicargo" };
  }

  return {
    title: `Car Rentals in ${district.name}, Bihar | abhicargo`,
    description: `Rent verified cars in ${district.name}, Bihar. Pickup at ${district.popularHubs.slice(0, 2).join(", ")}. Direct WhatsApp booking with included 250 km/day.`,
  };
}

export default async function DistrictPage({
  params,
}: {
  params: Promise<{ district: string }>;
}) {
  const { district: slug } = await params;
  const clean = decodeURIComponent(slug).toLowerCase().trim();
  const district = findDistrict(clean);

  if (!district) {
    // If the path was actually a car slug, e.g. /cars/maruti-swift-zxi-patna, redirect to the full detail route
    let vehicle = store.getVehicleBySlug(clean) || store.getVehicleById(clean);
    if (!vehicle) {
      vehicle = INITIAL_VEHICLES.find(
        (v) =>
          v.slug.toLowerCase().trim() === clean ||
          v.id.toLowerCase().trim() === clean
      );
    }
    if (vehicle) {
      redirect(`/cars/${vehicle.districtId.toLowerCase()}/${vehicle.slug}`);
    }
    notFound();
  }

  // Get cars registered or based in this district that are active
  const districtCars = store.getVehicles({ districtId: district.slug, onlyActive: true });
  const regionalCars = store.getVehicles({ onlyActive: true }).slice(0, 3);

  return (
    <div className="py-8 sm:py-12 bg-[#0E1216] text-[#F1F4F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#8F9CA8]">
          <Link href="/cars" className="hover:text-[#C63832] flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            All Cars
          </Link>
          <span>/</span>
          <Link href="/districts" className="hover:text-[#C63832] transition-colors">
            Districts
          </Link>
          <span>/</span>
          <span className="text-white font-semibold">{district.name}</span>
        </div>

        {/* District Hero Header with Glass Panel */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-xl border border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill text-[#FF6B64] text-xs font-bold">
                <MapPin className="w-3.5 h-3.5" />
                <span>District Hub #{district.name}</span>
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white">
                Car Rental Service in {district.name}
              </h1>
              <p className="text-sm text-[#8F9CA8] leading-relaxed max-w-2xl">
                {district.description}
              </p>

              {/* Pickup Hubs Chips */}
              <div className="pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8F9CA8] block mb-2">
                  Operating Pickup Nodes & Transit Points:
                </span>
                <div className="flex flex-wrap gap-2">
                  {district.popularHubs.map((hub) => (
                    <span
                      key={hub}
                      className="inline-flex items-center gap-1 text-xs px-3 py-1.5 glass-card text-[#F1F4F7] rounded-full font-medium"
                    >
                      <Navigation className="w-3 h-3 text-[#E03E36]" />
                      {hub}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 glass-card p-6 rounded-2xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B64] block">
                Available Cars
              </span>
              <div className="text-3xl font-bold text-white font-display">
                {districtCars.length} {districtCars.length === 1 ? "Car" : "Cars"} Ready
              </div>
              <p className="text-xs text-[#8F9CA8] leading-relaxed">
                Direct pickup and drop available at {district.popularHubs[0] || "headquarters"}.
              </p>
              <div className="pt-2 border-t border-white/[0.08] text-[11px] text-[#8F9CA8]">
                Common Aliases: {district.aliases.join(", ")}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Search For This District */}
        <div>
          <SearchPanel initialDistrict={district.slug} />
        </div>

        {/* Available Cars in District */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-white">
              Cars Currently Stationed in {district.name}
            </h2>
            <span className="text-xs text-[#8F9CA8]">
              {districtCars.length} active vehicle{districtCars.length === 1 ? "" : "s"}
            </span>
          </div>

          {districtCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {districtCars.map((car) => (
                <VehicleCard key={car.id} vehicle={car} />
              ))}
            </div>
          ) : (
            <div className="bg-[#141A1F] rounded-2xl border border-[#242D35] p-8 text-center space-y-4 shadow-md">
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="font-display text-lg font-bold text-white">
                  No permanently stationed cars in {district.name} right now
                </h3>
                <p className="text-xs text-[#8F9CA8] leading-relaxed">
                  Vehicles from neighboring hubs (such as Patna, Muzaffarpur, or Gaya) can be delivered to {district.name} directly via WhatsApp.
                </p>
              </div>

              <div className="pt-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C63832] block mb-4">
                  Nearest available cars for delivery to {district.name}:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                  {regionalCars.map((c) => (
                    <VehicleCard key={c.id} vehicle={c} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
