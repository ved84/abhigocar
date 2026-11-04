import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { getSession } from "@/lib/auth";
import { saveVehicleToFirestore } from "@/lib/firebaseDb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const districtId = searchParams.get("district") || undefined;
  const category = searchParams.get("category") || undefined;
  const fuelType = searchParams.get("fuel") || undefined;
  const transmission = searchParams.get("transmission") || undefined;
  const rentalMode = searchParams.get("mode") || undefined;
  const search = searchParams.get("search") || undefined;
  const sort = (searchParams.get("sort") as any) || undefined;
  const startDate = searchParams.get("startDate") || undefined;
  const endDate = searchParams.get("endDate") || undefined;
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
  const seats = searchParams.get("seats") ? Number(searchParams.get("seats")) : undefined;
  const includeInactive = searchParams.get("includeInactive") === "true";

  const session = await getSession();
  const onlyActive = includeInactive && session?.role === "ADMIN" ? false : true;

  const vehicles = store.getVehicles({
    districtId,
    category,
    fuelType,
    transmission,
    rentalMode,
    search,
    sort,
    startDate,
    endDate,
    minPrice,
    maxPrice,
    seats,
    onlyActive,
  });

  return NextResponse.json({ vehicles, total: vehicles.length });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (session?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
  }

  try {
    const body = await req.json();

    if (!body.make || !body.model || !body.districtId || !body.dailyPrice) {
      return NextResponse.json(
        { error: "Make, model, district, and daily price are mandatory." },
        { status: 400 }
      );
    }

    const slug = `${body.make}-${body.model}-${body.variant || "std"}-${body.districtId}-${Date.now().toString().slice(-4)}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");

    const vehicle = store.addVehicle({
      slug,
      registrationRef: body.registrationRef || "BR-01-XX-0000",
      make: body.make,
      model: body.model,
      variant: body.variant || "Standard",
      year: Number(body.year) || 2024,
      category: body.category || "HATCHBACK",
      fuelType: body.fuelType || "PETROL",
      transmission: body.transmission || "MANUAL",
      seats: Number(body.seats) || 5,
      luggageCapacity: Number(body.luggageCapacity) || 2,
      rentalMode: body.rentalMode || "BOTH",
      districtId: body.districtId,
      locality: body.locality || "District Center",
      pickupAddress: body.pickupAddress || `${body.districtId}, Bihar`,
      dailyPrice: Number(body.dailyPrice),
      securityDeposit: Number(body.securityDeposit) || 5000,
      includedKmPerDay: Number(body.includedKmPerDay) || 250,
      extraKmCharge: Number(body.extraKmCharge) || 12,
      driverChargePerDay: Number(body.driverChargePerDay) || 600,
      isActive: body.isActive !== undefined ? body.isActive : true,
      isFeatured: body.isFeatured !== undefined ? body.isFeatured : false,
      verificationStatus: "VERIFIED",
      isSampleListing: false, // User created listing
      description: body.description || "",
      termsAndConditions: body.termsAndConditions || "Valid driving license and identity proof required.",
      cancellationPolicy: body.cancellationPolicy || "Free cancellation up to 24 hours prior to trip.",
      features: body.features || ["Air Conditioning", "Power Steering"],
      images: body.images && body.images.length > 0
        ? body.images
        : [
            {
              id: `img-${Date.now()}`,
              vehicleId: "",
              url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
              isCover: true,
              sortOrder: 1,
            },
          ],
    });

    await saveVehicleToFirestore(vehicle);

    return NextResponse.json({ success: true, vehicle });
  } catch {
    return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 });
  }
}
