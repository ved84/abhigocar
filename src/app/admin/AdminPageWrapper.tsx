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
  const [adminUser, setAdminUser] = useState<{ id?: string; email?: string; role?: string; [key: string]: unknown } | null>(null);

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
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#0D1117] text-center space-y-3 p-6">
        <div className="w-10 h-10 rounded-xl bg-[#21262D] border border-[#30363D] text-[#E03E36] flex items-center justify-center mx-auto">
          <Shield className="w-5 h-5 animate-spin" />
        </div>
        <p className="text-xs text-[#9CA3AF]">Checking administrator session...</p>
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
