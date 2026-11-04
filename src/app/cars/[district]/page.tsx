import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BIHAR_DISTRICTS, findDistrict } from "@/data/districts";
import { store } from "@/lib/store";
import { VehicleCard } from "@/components/VehicleCard";
import { SearchPanel } from "@/components/SearchPanel";
import { MapPin, Navigation, ArrowLeft, ShieldCheck, Plane } from "lucide-react";

export function generateStaticParams() {
  return BIHAR_DISTRICTS.map((d) => ({ district: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ district: string }>;
}): Promise<Metadata> {
  const { district: slug } = await params;
  const district = findDistrict(slug);

  if (!district) {
    return { title: "District Fleet | BiharDrive" };
  }

  return {
    title: `Car Rentals in ${district.name}, Bihar | Self-Drive & Chauffeur Fleet`,
    description: `Rent verified cars in ${district.name}, Bihar. Pickup at ${district.popularHubs.slice(0, 2).join(", ")}. Real transparent pricing with included 250 km/day.`,
  };
}

export default async function DistrictPage({
  params,
}: {
  params: Promise<{ district: string }>;
}) {
  const { district: slug } = await params;
  const district = findDistrict(slug);

  if (!district) {
    notFound();
  }

  // Get cars registered or based in this district that are active
  const districtCars = store.getVehicles({ districtId: district.slug, onlyActive: true });
  const regionalCars = store.getVehicles({ onlyActive: true }).slice(0, 3);

  return (
    <div className="py-8 sm:py-12 text-[#EEF0EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#8E9991]">
          <Link href="/cars" className="hover:text-[#387F66] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            All Cars
          </Link>
          <span>/</span>
          <Link href="/districts" className="hover:text-[#387F66]">
            Districts
          </Link>
          <span>/</span>
          <span className="text-[#EEF0EB] font-semibold">{district.name}</span>
        </div>

        {/* District Hero Header */}
        <div className="bg-[#181E19] rounded-xl border border-[#2B352E] p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#162E24] text-[#387F66] text-xs font-semibold border border-[#2D6A54]/30">
                <MapPin className="w-3.5 h-3.5" />
                <span>District Hub #{district.name}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#EEF0EB]">
                Car rental service in {district.name}
              </h1>
              <p className="text-sm text-[#8E9991] leading-relaxed max-w-2xl">
                {district.description}
              </p>

              {/* Pickup Hubs Chips */}
              <div className="pt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8E9991] block mb-2">
                  Operating Pickup Nodes & Transit Points:
                </span>
                <div className="flex flex-wrap gap-2">
                  {district.popularHubs.map((hub) => (
                    <span
                      key={hub}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-[#101411] border border-[#2B352E] text-[#EEF0EB] rounded-md font-medium"
                    >
                      <Navigation className="w-3 h-3 text-[#387F66]" />
                      {hub}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-[#101411] p-5 rounded-lg border border-[#2B352E] space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#387F66] block">
                Local Fleet Status
              </span>
              <div className="text-2xl font-bold text-[#EEF0EB] font-serif">
                {districtCars.length} {districtCars.length === 1 ? "Car" : "Cars"} Available
              </div>
              <p className="text-xs text-[#8E9991] leading-relaxed">
                Direct pickup and drop available at {district.popularHubs[0] || "headquarters"}.
              </p>
              <div className="pt-2 border-t border-[#2B352E] text-[11px] text-[#8E9991]">
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
            <h2 className="font-serif text-2xl font-bold text-[#EEF0EB]">
              Cars currently positioned in {district.name}
            </h2>
            <span className="text-xs text-[#8E9991]">
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
            <div className="bg-[#181E19] rounded-xl border border-[#2B352E] p-8 text-center space-y-4">
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="font-serif text-lg font-bold text-[#EEF0EB]">
                  No permanently stationed cars in {district.name} right now
                </h3>
                <p className="text-xs text-[#8E9991] leading-relaxed">
                  Vehicles from neighboring hubs (such as Patna, Muzaffarpur, or Gaya) can be dispatched to {district.name} directly via WhatsApp.
                </p>
              </div>

              <div className="pt-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#387F66] block mb-4">
                  Nearest available fleet for delivery to {district.name}:
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
