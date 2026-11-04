import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { store } from "@/lib/store";
import { findDistrict } from "@/data/districts";
import { CarDetailClient } from "./CarDetailClient";
import { ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  return store.getVehicles({ onlyActive: false }).map((v) => ({
    district: v.districtId,
    slug: v.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ district: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = store.getVehicleBySlug(slug) || store.getVehicleById(slug);

  if (!vehicle) {
    return { title: "Vehicle Not Found | BiharDrive" };
  }

  return {
    title: `Rent ${vehicle.year} ${vehicle.make} ${vehicle.model} in ${vehicle.locality}, Bihar | BiharDrive`,
    description: `Rent ${vehicle.make} ${vehicle.model} ${vehicle.variant} in ${vehicle.locality}, ${vehicle.districtId}. Transparent pricing ₹${vehicle.dailyPrice}/day with 250 km included.`,
  };
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ district: string; slug: string }>;
}) {
  const { district: districtSlug, slug } = await params;
  const vehicle = store.getVehicleBySlug(slug) || store.getVehicleById(slug);

  if (!vehicle) {
    notFound();
  }

  const availabilityBlocks = store.getVehicleAvailabilityBlocks(vehicle.id);
  const district = findDistrict(vehicle.districtId);

  return (
    <div className="py-8 sm:py-12 bg-[#0E1216] text-[#F1F4F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#8F9CA8]">
          <Link href="/cars" className="hover:text-[#C63832] flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            All Cars
          </Link>
          <span>/</span>
          <Link href={`/cars/${vehicle.districtId}`} className="hover:text-[#C63832] capitalize transition-colors">
            {district ? district.name : vehicle.districtId}
          </Link>
          <span>/</span>
          <span className="text-white font-semibold">
            {vehicle.make} {vehicle.model}
          </span>
        </div>

        {/* Client Interactive Detail + Booking Form */}
        <Suspense
          fallback={
            <div className="py-20 text-center text-xs text-[#59615B]">
              Loading car specifications...
            </div>
          }
        >
          <CarDetailClient vehicle={vehicle} availabilityBlocks={availabilityBlocks} />
        </Suspense>
      </div>
    </div>
  );
}
