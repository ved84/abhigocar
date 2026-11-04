import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { getSession } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const booking = store.getBookingByRef(id) || store.getBookings().find((b) => b.id === id);
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
  return NextResponse.json({ booking });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (session?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
  }

  const { id } = await params;
  try {
    const { status, paymentStatus, adminNotes, paymentNotes } = await req.json();

    let updated = null;
    if (status) {
      updated = store.updateBookingStatus(id, status, adminNotes);
    }
    if (paymentStatus) {
      updated = store.updatePaymentStatus(id, paymentStatus, paymentNotes);
    }

    if (!updated) {
      return NextResponse.json({ error: "Booking record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update booking status" }, { status: 500 });
  }
}
