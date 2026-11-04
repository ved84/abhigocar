import { Metadata } from "next";
import { Suspense } from "react";
import { store } from "@/lib/store";
import { ExploreCarsClient } from "./ExploreCarsClient";

export const metadata: Metadata = {
  title: "Explore Cars | BiharDrive Regional Fleet",
  description:
    "Browse verified car rentals across all 38 districts of Bihar. Filter by category, transmission, fuel, and rental mode.",
};

async function CarsListContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;

  const district = typeof resolvedParams.district === "string" ? resolvedParams.district : undefined;
  const category = typeof resolvedParams.category === "string" ? resolvedParams.category : undefined;
  const mode = typeof resolvedParams.mode === "string" ? resolvedParams.mode : undefined;
  const fuel = typeof resolvedParams.fuel === "string" ? resolvedParams.fuel : undefined;
  const transmission = typeof resolvedParams.transmission === "string" ? resolvedParams.transmission : undefined;
  const seats = typeof resolvedParams.seats === "string" ? Number(resolvedParams.seats) : undefined;
  const sort = typeof resolvedParams.sort === "string" ? (resolvedParams.sort as any) : "newest";
  const search = typeof resolvedParams.search === "string" ? resolvedParams.search : undefined;
  const startDate = typeof resolvedParams.startDate === "string" ? resolvedParams.startDate : undefined;
  const endDate = typeof resolvedParams.endDate === "string" ? resolvedParams.endDate : undefined;

  const vehicles = store.getVehicles({
    districtId: district,
    category,
    rentalMode: mode,
    fuelType: fuel,
    transmission,
    seats,
    sort,
    search,
    startDate,
    endDate,
    onlyActive: true,
  });

  return (
    <ExploreCarsClient
      initialVehicles={vehicles}
      initialDistrict={district}
      initialCategory={category}
      initialMode={mode}
      initialSort={sort}
      initialFuel={fuel}
      initialTransmission={transmission}
      initialSeats={seats ? seats.toString() : undefined}
      initialSearch={search}
      initialStartDate={startDate}
      initialEndDate={endDate}
    />
  );
}

export default function ExploreCarsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#20493A]">
            Regional Fleet Directory
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C221E] mt-1">
            Explore verified cars in Bihar
          </h1>
          <p className="text-xs sm:text-sm text-[#59615B] mt-1">
            Transparent INR pricing, included 250 km/day, and direct WhatsApp dispatch.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="py-16 text-center text-xs text-[#59615B]">
              Loading fleet listings...
            </div>
          }
        >
          <CarsListContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
