import { Metadata } from "next";
import { store } from "@/lib/store";
import { INITIAL_VEHICLES } from "@/data/mockVehicles";
import { AdminPageWrapper } from "./AdminPageWrapper";

export const metadata: Metadata = {
  title: "Admin Dashboard | abhicargo",
  description: "Secure car operations and booking approval dashboard.",
};

export default function AdminPage() {
  let allVehicles: any[] = [];
  try {
    allVehicles = store.getVehicles({ onlyActive: false });
  } catch {
    allVehicles = [];
  }

  // Ensure dummy car data is always available in admin panel
  if (!allVehicles || allVehicles.length === 0) {
    if (typeof store.resetToInitialVehicles === "function") {
      allVehicles = store.resetToInitialVehicles();
    } else {
      allVehicles = [...INITIAL_VEHICLES];
    }
  }
  const allBookings = store.getBookings();
  const allInquiries = store.getInquiries();
  const allBlocks = store.getAllAvailabilityBlocks();

  return (
    <AdminPageWrapper
      initialVehicles={allVehicles}
      initialBookings={allBookings}
      initialInquiries={allInquiries}
      initialBlocks={allBlocks}
    />
  );
}
