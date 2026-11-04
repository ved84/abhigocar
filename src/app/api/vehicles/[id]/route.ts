import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { getSession } from "@/lib/auth";
import { saveVehicleToFirestore, deleteVehicleFromFirestore } from "@/lib/firebaseDb";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const vehicle = store.getVehicleById(id) || store.getVehicleBySlug(id);
  if (!vehicle) {
    return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
  }
  return NextResponse.json({ vehicle });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (session?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
  }

  const { id } = await params;
  try {
    const updates = await req.json();
    const updated = store.updateVehicle(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }
    await saveVehicleToFirestore(updated);
    return NextResponse.json({ success: true, vehicle: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update vehicle" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (session?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
  }

  const { id } = await params;
  const deleted = store.deleteVehicle(id);
  if (!deleted) {
    return NextResponse.json({ error: "Vehicle not found or could not be removed." }, { status: 404 });
  }
  await deleteVehicleFromFirestore(id);
  return NextResponse.json({ success: true, message: "Vehicle removed." });
}
