"use client";

import { useState, useEffect } from "react";
import { Vehicle, Booking, CustomerInquiry, AvailabilityBlock } from "@/types";
import { AdminDashboardClient } from "./AdminDashboardClient";
import { AdminLoginGate } from "./AdminLoginGate";
import { Shield } from "lucide-react";

export function AdminPageWrapper({
  initialVehicles,
  initialBookings,
  initialInquiries,
  initialBlocks,
}: {
  initialVehicles: Vehicle[];
  initialBookings: Booking[];
  initialInquiries: CustomerInquiry[];
  initialBlocks: AvailabilityBlock[];
}) {
  const [checking, setChecking] = useState(true);
  const [adminUser, setAdminUser] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?.role === "ADMIN") {
          setAdminUser(data.user);
        } else {
          setAdminUser(null);
        }
      })
      .catch(() => setAdminUser(null))
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 rounded-full bg-[#E2EBE5] text-[#20493A] flex items-center justify-center mx-auto animate-pulse">
          <Shield className="w-5 h-5" />
        </div>
        <p className="text-xs text-[#59615B]">Checking administrator session...</p>
      </div>
    );
  }

  if (!adminUser) {
    return <AdminLoginGate />;
  }

  return (
    <AdminDashboardClient
      initialVehicles={initialVehicles}
      initialBookings={initialBookings}
      initialInquiries={initialInquiries}
      initialBlocks={initialBlocks}
      adminUser={adminUser}
    />
  );
}
