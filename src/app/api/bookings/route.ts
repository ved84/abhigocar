import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { calculatePricingBreakdown } from "@/lib/pricing";
import { getSession } from "@/lib/auth";
import { saveBookingToFirestore } from "@/lib/firebaseDb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email") || undefined;
  const status = searchParams.get("status") || undefined;
  const vehicleId = searchParams.get("vehicleId") || undefined;

  const session = await getSession();

  // If user is not admin and searching without email or with different email, restrict
  if (session?.role !== "ADMIN") {
    if (!email && !session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }
  }

  const bookings = store.getBookings({
    customerEmail: session?.role === "ADMIN" ? email : (session?.email || email),
    status,
    vehicleId,
  });

  return NextResponse.json({ bookings, count: bookings.length });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      vehicleId,
      customerName,
      customerEmail,
      customerPhone,
      customerCity,
      drivingLicenseNo,
      startDate,
      endDate,
      pickupTime,
      returnTime,
      rentalModeSelected,
      pickupLocation,
    } = body;

    if (!vehicleId || !customerName || !customerEmail || !customerPhone || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Mandatory booking details missing." },
        { status: 400 }
      );
    }

    const vehicle = store.getVehicleById(vehicleId);
    if (!vehicle) {
      return NextResponse.json({ error: "Car listing not found." }, { status: 404 });
    }

    // Server-side pricing calculation to prevent client tampering
    const breakdown = calculatePricingBreakdown(
      vehicle,
      startDate,
      endDate,
      rentalModeSelected || "SELF_DRIVE"
    );

    const result = store.createBooking({
      vehicleId,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      customerPhone: customerPhone.trim(),
      customerCity: customerCity || vehicle.districtId,
      drivingLicenseNo: drivingLicenseNo || undefined,
      startDate,
      endDate,
      pickupTime: pickupTime || "09:00 AM",
      returnTime: returnTime || "08:00 PM",
      totalDays: breakdown.totalDays,
      rentalModeSelected: rentalModeSelected || "SELF_DRIVE",
      pickupLocation: pickupLocation || vehicle.pickupAddress,
      baseDailyRate: breakdown.baseDailyRate,
      baseAmount: breakdown.baseAmount,
      driverCharges: breakdown.driverCharges,
      securityDeposit: breakdown.securityDeposit,
      taxesAmount: breakdown.taxesAmount,
      totalAmount: breakdown.totalAmount,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    if (result.booking) {
      await saveBookingToFirestore(result.booking);
    }

    return NextResponse.json({
      success: true,
      booking: result.booking,
      message: `Booking request recorded with reference ${result.booking?.bookingRef}.`,
    });
  } catch {
    return NextResponse.json({ error: "Failed to process booking request" }, { status: 500 });
  }
}
