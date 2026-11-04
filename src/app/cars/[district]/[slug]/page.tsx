import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { store } from "@/lib/store";
import { findDistrict } from "@/data/districts";
import { getVehiclesData } from "@/lib/firebaseDb";
import { INITIAL_VEHICLES } from "@/data/mockVehicles";
import { CarDetailClient } from "./CarDetailClient";
import { ArrowLeft } from "lucide-react";
import { Vehicle } from "@/types";

async function resolveVehicle(slug: string, districtSlug?: string): Promise<Vehicle | undefined> {
  const cleanSlug = decodeURIComponent(slug).toLowerCase().trim();

  // 1. Check in-memory store by slug or ID
  let vehicle = store.getVehicleBySlug(cleanSlug) || store.getVehicleById(cleanSlug);

  // 2. Fallback to Firestore DB if available
  if (!vehicle) {
    try {
      const dbVehicles = await getVehiclesData();
      if (Array.isArray(dbVehicles) && dbVehicles.length > 0) {
        if (typeof store.syncVehicles === "function") {
          store.syncVehicles(dbVehicles);
        }
        vehicle = store.getVehicleBySlug(cleanSlug) || store.getVehicleById(cleanSlug);
      }
    } catch {}
  }

  // 3. Guaranteed fallback to INITIAL_VEHICLES (mock data)
  if (!vehicle) {
    vehicle = INITIAL_VEHICLES.find(
      (v) =>
        v.slug.toLowerCase().trim() === cleanSlug ||
        v.id.toLowerCase().trim() === cleanSlug ||
        cleanSlug.includes(v.slug.toLowerCase().trim()) ||
        v.slug.toLowerCase().trim().includes(cleanSlug)
    );
    if (vehicle && typeof store.syncVehicles === "function") {
      store.syncVehicles([vehicle]);
    }
  }

  // 4. Try matching with districtSlug if provided
  if (!vehicle && districtSlug) {
    const cleanDistrict = decodeURIComponent(districtSlug).toLowerCase().trim();
    vehicle = store.getVehicleBySlug(cleanDistrict) || store.getVehicleById(cleanDistrict);
  }

  return vehicle;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ district: string; slug: string }>;
}): Promise<Metadata> {
  const { district, slug } = await params;
  const vehicle = await resolveVehicle(slug, district);

  if (!vehicle) {
    return { title: "Vehicle Details | abhicargo" };
  }

  return {
    title: `Rent ${vehicle.year} ${vehicle.make} ${vehicle.model} in ${vehicle.locality}, Bihar | abhicargo`,
    description: `Rent ${vehicle.make} ${vehicle.model} ${vehicle.variant} in ${vehicle.locality}, ${vehicle.districtId}. Transparent pricing ₹${vehicle.dailyPrice}/day with 250 km included.`,
  };
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ district: string; slug: string }>;
}) {
  await connection();
  const { district: districtSlug, slug } = await params;
  const vehicle = await resolveVehicle(slug, districtSlug);

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
          <Link href={`/cars/${vehicle.districtId.toLowerCase()}`} className="hover:text-[#C63832] capitalize transition-colors">
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
