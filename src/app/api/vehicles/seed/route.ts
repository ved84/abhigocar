import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { INITIAL_VEHICLES } from "@/data/mockVehicles";
import { getSession } from "@/lib/auth";
import { saveVehicleToFirestore } from "@/lib/firebaseDb";

export async function POST() {
  const session = await getSession();
  if (session?.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Unauthorized. Admin privileges required." },
      { status: 403 }
    );
  }

  try {
    // Reset and reload all 13 dummy cars
    const vehicles =
      typeof store.resetToInitialVehicles === "function"
        ? store.resetToInitialVehicles()
        : [...INITIAL_VEHICLES];

    // Sync all dummy vehicles to Firestore if configured
    for (const vehicle of vehicles) {
      await saveVehicleToFirestore(vehicle);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully loaded all ${vehicles.length} dummy cars into the admin panel!`,
      vehicles,
      count: vehicles.length,
    });
  } catch (error) {
    console.error("Failed to seed dummy cars:", error);
    return NextResponse.json(
      { error: "Failed to load dummy car data." },
      { status: 500 }
    );
  }
}
