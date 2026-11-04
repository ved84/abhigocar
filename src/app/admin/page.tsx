import { Metadata } from "next";
import { store } from "@/lib/store";
import { AdminPageWrapper } from "./AdminPageWrapper";

export const metadata: Metadata = {
  title: "Admin Fleet Console | BiharDrive",
  description: "Secure Bihar regional fleet operations and booking approval dashboard.",
};

export default function AdminPage() {
  const allVehicles = store.getVehicles({ onlyActive: false });
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
