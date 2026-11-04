"use client";

import { useState } from "react";
import Link from "next/link";
import { Vehicle, Booking, CustomerInquiry, AvailabilityBlock } from "@/types";
import { BIHAR_DISTRICTS } from "@/data/districts";
import { formatINR } from "@/lib/pricing";
import {
  Car,
  Shield,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Calendar,
  AlertTriangle,
  Search,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
  Lock,
} from "lucide-react";

export function AdminDashboardClient({
  initialVehicles,
  initialBookings,
  initialInquiries,
  initialBlocks,
  adminUser,
}: {
  initialVehicles: Vehicle[];
  initialBookings: Booking[];
  initialInquiries: CustomerInquiry[];
  initialBlocks: AvailabilityBlock[];
  adminUser: any;
}) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "vehicles" | "bookings" | "calendar"
  >("vehicles");

  // State
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>(initialBlocks);

  // Vehicle Modal / Form State
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [vehicleForm, setVehicleForm] = useState({
    registrationRef: "BR-01-AB-1234",
    make: "",
    model: "",
    variant: "",
    year: 2024,
    category: "HATCHBACK",
    fuelType: "PETROL",
    transmission: "MANUAL",
    seats: 5,
    luggageCapacity: 2,
    rentalMode: "BOTH",
    districtId: "patna",
    locality: "Boring Road",
    pickupAddress: "Patna, Bihar",
    dailyPrice: 2000,
    securityDeposit: 4000,
    includedKmPerDay: 250,
    extraKmCharge: 12,
    driverChargePerDay: 600,
    description: "",
    featuresStr: "Air Conditioning, Bluetooth Audio, Power Windows, Dual Airbags",
    imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
    isActive: true,
  });

  // Maintenance Block Form State
  const [newBlockVehicleId, setNewBlockVehicleId] = useState(vehicles[0]?.id || "");
  const [newBlockStart, setNewBlockStart] = useState("");
  const [newBlockEnd, setNewBlockEnd] = useState("");
  const [newBlockNotes, setNewBlockNotes] = useState("");

  // Booking Filter State
  const [bookingStatusFilter, setBookingStatusFilter] = useState("ALL");
  const [bookingSearch, setBookingSearch] = useState("");

  // KPI Calculations
  const totalCars = vehicles.length;
  const activeListings = vehicles.filter((v) => v.isActive).length;
  const hiddenListings = vehicles.filter((v) => !v.isActive).length;
  const pendingRequests = bookings.filter((b) => b.status === "PENDING_APPROVAL").length;
  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED" || b.status === "ACTIVE").length;

  // Toggle vehicle visibility on website
  const handleToggleVisibility = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    try {
      const res = await fetch(`/api/vehicles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });
      if (res.ok) {
        setVehicles((prev) =>
          prev.map((v) => (v.id === id ? { ...v, isActive: newStatus } : v))
        );
      }
    } catch {
      alert("Error updating visibility on website");
    }
  };

  // Toggle featured
  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/vehicles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !current }),
      });
      if (res.ok) {
        setVehicles((prev) =>
          prev.map((v) => (v.id === id ? { ...v, isFeatured: !current } : v))
        );
      }
    } catch {
      alert("Error updating featured status");
    }
  };

  // Delete vehicle
  const handleDeleteVehicle = async (id: string) => {
    if (!confirm("Are you sure you want to remove this car listing?")) return;
    try {
      const res = await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
      if (res.ok) {
        setVehicles((prev) => prev.filter((v) => v.id !== id));
      }
    } catch {
      alert("Error deleting vehicle");
    }
  };

  // Save new car or edit
  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...vehicleForm,
      features: vehicleForm.featuresStr.split(",").map((s) => s.trim()).filter(Boolean),
      images: [
        {
          id: `img-${Date.now()}`,
          vehicleId: editingVehicleId || "",
          url: vehicleForm.imageUrl,
          isCover: true,
          sortOrder: 1,
        },
      ],
    };

    if (editingVehicleId) {
      // Edit
      const res = await fetch(`/api/vehicles/${editingVehicleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setVehicles((prev) =>
          prev.map((v) => (v.id === editingVehicleId ? data.vehicle : v))
        );
        setShowAddCarModal(false);
        setEditingVehicleId(null);
      }
    } else {
      // Add
      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setVehicles((prev) => [data.vehicle, ...prev]);
        setShowAddCarModal(false);
      }
    }
  };

  const handleEditClick = (v: Vehicle) => {
    setEditingVehicleId(v.id);
    setVehicleForm({
      registrationRef: v.registrationRef,
      make: v.make,
      model: v.model,
      variant: v.variant,
      year: v.year,
      category: v.category,
      fuelType: v.fuelType,
      transmission: v.transmission,
      seats: v.seats,
      luggageCapacity: v.luggageCapacity,
      rentalMode: v.rentalMode,
      districtId: v.districtId,
      locality: v.locality,
      pickupAddress: v.pickupAddress,
      dailyPrice: v.dailyPrice,
      securityDeposit: v.securityDeposit,
      includedKmPerDay: v.includedKmPerDay,
      extraKmCharge: v.extraKmCharge,
      driverChargePerDay: v.driverChargePerDay,
      description: v.description,
      featuresStr: v.features.join(", "),
      imageUrl: v.images[0]?.url || "",
      isActive: v.isActive,
    });
    setShowAddCarModal(true);
  };

  // Booking Status Update
  const handleUpdateBookingStatus = async (
    id: string,
    status: Booking["status"],
    adminNote?: string
  ) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNotes: adminNote }),
      });
      const data = await res.json();
      if (res.ok) {
        setBookings((prev) => prev.map((b) => (b.id === id ? data.booking : b)));
      }
    } catch {
      alert("Failed to update booking status");
    }
  };

  // Add Maintenance Block
  const handleAddMaintenanceBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockVehicleId || !newBlockStart || !newBlockEnd) {
      alert("Please select vehicle and date range");
      return;
    }
    const newBlock: AvailabilityBlock = {
      id: `blk-${Date.now()}`,
      vehicleId: newBlockVehicleId,
      startDate: newBlockStart,
      endDate: newBlockEnd,
      reason: "MAINTENANCE",
      notes: newBlockNotes || "Scheduled workshop maintenance",
    };
    setBlocks((prev) => [newBlock, ...prev]);
    setNewBlockNotes("");
    setNewBlockStart("");
    setNewBlockEnd("");
  };

  const handleRemoveBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    if (bookingStatusFilter !== "ALL" && b.status !== bookingStatusFilter) return false;
    if (bookingSearch) {
      const s = bookingSearch.toLowerCase();
      return (
        b.bookingRef.toLowerCase().includes(s) ||
        b.customerName.toLowerCase().includes(s) ||
        b.customerPhone.includes(s)
      );
    }
    return true;
  });

  return (
    <div className="py-8 text-[#EEF0EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Admin Header */}
        <div className="bg-[#181E19] rounded-xl border border-[#2B352E] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#387F66]">
                Fleet Control & Visibility Manager
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#EEF0EB] mt-0.5">
              Admin Operations Console
            </h1>
            <p className="text-xs text-[#8E9991]">
              Manage which cars appear on the public website, prices, and maintenance.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setEditingVehicleId(null);
                setVehicleForm({
                  registrationRef: `BR-01-${Math.floor(1000 + Math.random() * 9000)}`,
                  make: "",
                  model: "",
                  variant: "",
                  year: 2024,
                  category: "HATCHBACK",
                  fuelType: "PETROL",
                  transmission: "MANUAL",
                  seats: 5,
                  luggageCapacity: 2,
                  rentalMode: "BOTH",
                  districtId: "patna",
                  locality: "Patna Center",
                  pickupAddress: "Patna, Bihar",
                  dailyPrice: 2200,
                  securityDeposit: 4000,
                  includedKmPerDay: 250,
                  extraKmCharge: 12,
                  driverChargePerDay: 600,
                  description: "High quality vehicle maintained for Bihar state routes.",
                  featuresStr: "Air Conditioning, Touchscreen Audio, ABS, Dual Airbags",
                  imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
                  isActive: true,
                });
                setShowAddCarModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#2D6A54] hover:bg-[#387F66] text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Car Listing</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md border border-[#2B352E] text-xs font-semibold text-[#8E9991] hover:text-[#EEF0EB] hover:bg-[#101411]"
            >
              Lock Console
            </button>
          </div>
        </div>

        {/* Visibility KPI Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#181E19] p-5 rounded-xl border border-[#2B352E] space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8E9991] block">
              Total Cars (Admin View)
            </span>
            <span className="font-serif text-3xl font-bold text-[#EEF0EB]">
              {totalCars}
            </span>
            <span className="text-[11px] text-[#8E9991] block">All listings in database</span>
          </div>

          <div className="bg-[#181E19] p-5 rounded-xl border border-[#2B352E] space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#387F66] block">
              Live on Website (Public)
            </span>
            <span className="font-serif text-3xl font-bold text-emerald-400">
              {activeListings}
            </span>
            <span className="text-[11px] text-emerald-400/80 block">Visible to customers</span>
          </div>

          <div className="bg-[#181E19] p-5 rounded-xl border border-[#2B352E] space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-500 block">
              Hidden / Draft
            </span>
            <span className="font-serif text-3xl font-bold text-amber-400">
              {hiddenListings}
            </span>
            <span className="text-[11px] text-amber-400/80 block">Only visible to admin</span>
          </div>

          <div className="bg-[#181E19] p-5 rounded-xl border border-[#2B352E] space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#D4A359] block">
              Pending Requests
            </span>
            <span className="font-serif text-3xl font-bold text-[#D4A359]">
              {pendingRequests}
            </span>
            <span className="text-[11px] text-[#8E9991] block">Awaiting dispatch</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 border-b border-[#2B352E] pb-px text-xs font-semibold">
          {[
            { id: "vehicles", label: `Cars & Website Visibility (${vehicles.length})` },
            { id: "bookings", label: `WhatsApp Booking Requests (${bookings.length})` },
            { id: "calendar", label: "Maintenance Calendar" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-t-lg transition-colors border-t border-x shrink-0 ${
                activeTab === tab.id
                  ? "bg-[#181E19] border-[#2B352E] text-[#387F66] font-bold"
                  : "border-transparent text-[#8E9991] hover:text-[#EEF0EB]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: VEHICLES FLEET & VISIBILITY CONTROL */}
        {activeTab === "vehicles" && (
          <div className="space-y-4">
            <div className="bg-[#181E19] rounded-xl border border-[#2B352E] overflow-hidden shadow-xs">
              <div className="p-4 border-b border-[#2B352E] flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#EEF0EB]">
                    Car Listings & Website Visibility Control
                  </h3>
                  <p className="text-xs text-[#8E9991]">
                    Toggle the switch to instantly show or hide a car from the public website.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#EEF0EB]">
                  <thead className="bg-[#141A15] border-b border-[#2B352E] text-[#8E9991] uppercase text-[10px] tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Car & Model</th>
                      <th className="py-3 px-4">RTO Plate (Private)</th>
                      <th className="py-3 px-4">District / Locality</th>
                      <th className="py-3 px-4">Rate</th>
                      <th className="py-3 px-4 text-center">Public Website Visibility</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2B352E]">
                    {vehicles.map((v) => (
                      <tr key={v.id} className="hover:bg-[#1E2620]/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#EEF0EB]">
                            {v.make} {v.model} ({v.year})
                          </div>
                          <div className="text-[11px] text-[#8E9991]">{v.variant}</div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#101411] border border-[#2B352E] text-[#D4A359]">
                            {v.registrationRef}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="capitalize font-medium">{v.districtId}</div>
                          <div className="text-[11px] text-[#8E9991]">{v.locality}</div>
                        </td>

                        <td className="py-3 px-4 font-semibold text-[#387F66]">
                          {formatINR(v.dailyPrice)}/day
                        </td>

                        {/* Visibility Toggle Button */}
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleVisibility(v.id, v.isActive)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                              v.isActive
                                ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60"
                                : "bg-neutral-900 border-neutral-700 text-neutral-400 hover:bg-neutral-800"
                            }`}
                          >
                            {v.isActive ? (
                              <>
                                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Live on Website</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3.5 h-3.5 text-neutral-500" />
                                <span>Hidden from Website</span>
                              </>
                            )}
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleToggleFeatured(v.id, v.isFeatured)}
                              title="Toggle Featured Tag"
                              className={`p-1.5 rounded border border-[#2B352E] ${
                                v.isFeatured ? "text-amber-400 bg-amber-950/30" : "text-[#8E9991]"
                              }`}
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleEditClick(v)}
                              title="Edit Details"
                              className="p-1.5 rounded border border-[#2B352E] text-[#387F66] hover:text-white"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteVehicle(v.id)}
                              title="Delete Car"
                              className="p-1.5 rounded border border-[#2B352E] text-rose-400 hover:text-rose-300"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BOOKINGS MANAGEMENT */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            <div className="bg-[#181E19] rounded-xl border border-[#2B352E] p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E9991]" />
                <input
                  type="text"
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  placeholder="Filter by ref, name, phone..."
                  className="w-full h-9 pl-9 pr-3 text-xs bg-[#101411] border border-[#2B352E] rounded-md text-[#EEF0EB]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-[#8E9991]">Status:</span>
                <select
                  value={bookingStatusFilter}
                  onChange={(e) => setBookingStatusFilter(e.target.value)}
                  className="h-9 px-2 text-xs bg-[#101411] border border-[#2B352E] rounded-md text-[#EEF0EB]"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING_APPROVAL">Pending Approval</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="ACTIVE">Active Trip</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="bg-[#181E19] rounded-xl border border-[#2B352E] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#EEF0EB]">
                  <thead className="bg-[#141A15] border-b border-[#2B352E] text-[#8E9991] uppercase text-[10px] tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Ref & Dates</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Vehicle</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Dispatch</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2B352E]">
                    {filteredBookings.map((b) => {
                      const veh = vehicles.find((v) => v.id === b.vehicleId);
                      return (
                        <tr key={b.id} className="hover:bg-[#1E2620]/40 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-[#EEF0EB]">
                              {b.bookingRef}
                            </span>
                            <div className="text-[11px] text-[#8E9991]">
                              {b.startDate} to {b.endDate} ({b.totalDays}d)
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-semibold">{b.customerName}</div>
                            <div className="text-[11px] text-[#8E9991]">{b.customerPhone}</div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-medium">
                              {veh ? `${veh.make} ${veh.model}` : b.vehicleId}
                            </div>
                            <div className="text-[11px] text-[#8E9991] capitalize">
                              {b.rentalModeSelected.replace(/_/g, " ").toLowerCase()}
                            </div>
                          </td>

                          <td className="py-3 px-4 font-bold text-[#387F66]">
                            {formatINR(b.totalAmount)}
                          </td>

                          <td className="py-3 px-4">
                            <select
                              value={b.status}
                              onChange={(e) =>
                                handleUpdateBookingStatus(b.id, e.target.value as any)
                              }
                              className="px-2 py-1 text-xs border border-[#2B352E] rounded-md bg-[#101411] text-[#EEF0EB] font-semibold"
                            >
                              <option value="PENDING_APPROVAL">Pending Approval</option>
                              <option value="CONFIRMED">Confirmed</option>
                              <option value="ACTIVE">Active Trip</option>
                              <option value="COMPLETED">Completed</option>
                              <option value="CANCELLED">Cancelled</option>
                            </select>
                          </td>

                          <td className="py-3 px-4 text-right">
                            {b.status === "PENDING_APPROVAL" ? (
                              <button
                                onClick={() => handleUpdateBookingStatus(b.id, "CONFIRMED")}
                                className="px-3 py-1 bg-[#2D6A54] text-white rounded text-xs font-semibold"
                              >
                                Approve
                              </button>
                            ) : (
                              <span className="text-[11px] text-[#8E9991]">Managed</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CALENDAR & MAINTENANCE BLOCKS */}
        {activeTab === "calendar" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-[#181E19] p-6 rounded-xl border border-[#2B352E] shadow-xs space-y-4">
              <h3 className="font-serif text-base font-bold text-[#EEF0EB]">
                Block Maintenance Dates
              </h3>
              <p className="text-xs text-[#8E9991]">
                Blocked dates automatically prevent double-booking for the selected vehicle.
              </p>

              <form onSubmit={handleAddMaintenanceBlock} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-[#EEF0EB] block mb-1">
                    Select Vehicle
                  </label>
                  <select
                    value={newBlockVehicleId}
                    onChange={(e) => setNewBlockVehicleId(e.target.value)}
                    className="w-full h-9 px-2 border border-[#2B352E] rounded-md bg-[#101411] text-[#EEF0EB]"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.make} {v.model} ({v.registrationRef}) - {v.districtId}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-[#EEF0EB] block mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={newBlockStart}
                      onChange={(e) => setNewBlockStart(e.target.value)}
                      className="w-full h-9 px-2 border border-[#2B352E] rounded-md bg-[#101411] text-[#EEF0EB]"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#EEF0EB] block mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={newBlockEnd}
                      min={newBlockStart}
                      onChange={(e) => setNewBlockEnd(e.target.value)}
                      className="w-full h-9 px-2 border border-[#2B352E] rounded-md bg-[#101411] text-[#EEF0EB]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-[#EEF0EB] block mb-1">
                    Maintenance Reason / Notes
                  </label>
                  <textarea
                    rows={2}
                    value={newBlockNotes}
                    onChange={(e) => setNewBlockNotes(e.target.value)}
                    placeholder="e.g. Periodic oil service and brake inspection"
                    className="w-full p-2 border border-[#2B352E] rounded-md bg-[#101411] text-[#EEF0EB]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-md bg-[#2D6A54] text-white font-semibold text-xs hover:bg-[#387F66]"
                >
                  Block Dates
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-[#181E19] p-6 rounded-xl border border-[#2B352E] shadow-xs space-y-4">
              <h3 className="font-serif text-base font-bold text-[#EEF0EB]">
                Active Maintenance Blocks ({blocks.length})
              </h3>

              {blocks.length === 0 ? (
                <p className="text-xs text-[#8E9991]">No dates currently blocked.</p>
              ) : (
                <div className="space-y-3">
                  {blocks.map((b) => {
                    const veh = vehicles.find((v) => v.id === b.vehicleId);
                    return (
                      <div
                        key={b.id}
                        className="p-4 rounded-lg bg-[#101411] border border-[#2B352E] flex items-center justify-between text-xs"
                      >
                        <div className="space-y-1">
                          <span className="font-bold text-[#EEF0EB] block">
                            {veh ? `${veh.make} ${veh.model}` : b.vehicleId}
                          </span>
                          <div className="text-[#8E9991] flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#387F66]" />
                            <span>
                              {b.startDate} to {b.endDate}
                            </span>
                          </div>
                          {b.notes && <p className="text-[#8E9991] text-[11px]">{b.notes}</p>}
                        </div>

                        <button
                          onClick={() => handleRemoveBlock(b.id)}
                          className="px-3 py-1 rounded bg-rose-950/40 text-rose-300 border border-rose-800 text-xs font-semibold hover:bg-rose-900"
                        >
                          Remove Block
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showAddCarModal && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-[#181E19] rounded-xl border border-[#2B352E] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#2B352E]">
                <h3 className="font-serif text-lg font-bold text-[#EEF0EB]">
                  {editingVehicleId ? "Edit Car Listing" : "Add New Vehicle to Fleet"}
                </h3>
                <button
                  onClick={() => setShowAddCarModal(false)}
                  className="p-1 rounded text-[#8E9991] hover:text-[#EEF0EB]"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCar} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-[#EEF0EB]">Make</label>
                    <input
                      type="text"
                      value={vehicleForm.make}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, make: e.target.value })}
                      placeholder="e.g. Maruti Suzuki"
                      className="w-full h-9 px-2.5 border border-[#2B352E] bg-[#101411] text-[#EEF0EB] rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-[#EEF0EB]">Model</label>
                    <input
                      type="text"
                      value={vehicleForm.model}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                      placeholder="e.g. Swift, Scorpio-N"
                      className="w-full h-9 px-2.5 border border-[#2B352E] bg-[#101411] text-[#EEF0EB] rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-[#EEF0EB]">Variant</label>
                    <input
                      type="text"
                      value={vehicleForm.variant}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, variant: e.target.value })}
                      placeholder="e.g. ZXi+ Dualjet"
                      className="w-full h-9 px-2.5 border border-[#2B352E] bg-[#101411] text-[#EEF0EB] rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-[#EEF0EB]">RTO Plate (Private)</label>
                    <input
                      type="text"
                      value={vehicleForm.registrationRef}
                      onChange={(e) =>
                        setVehicleForm({ ...vehicleForm, registrationRef: e.target.value })
                      }
                      placeholder="BR-01-XX-0000"
                      className="w-full h-9 px-2.5 border border-[#2B352E] bg-[#101411] text-[#EEF0EB] rounded-md uppercase font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-[#EEF0EB]">Year</label>
                    <input
                      type="number"
                      value={vehicleForm.year}
                      onChange={(e) =>
                        setVehicleForm({ ...vehicleForm, year: Number(e.target.value) })
                      }
                      className="w-full h-9 px-2.5 border border-[#2B352E] bg-[#101411] text-[#EEF0EB] rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-[#EEF0EB]">Category</label>
                    <select
                      value={vehicleForm.category}
                      onChange={(e) =>
                        setVehicleForm({ ...vehicleForm, category: e.target.value as any })
                      }
                      className="w-full h-9 px-2 border border-[#2B352E] bg-[#101411] text-[#EEF0EB] rounded-md"
                    >
                      <option value="HATCHBACK">Hatchback</option>
                      <option value="SEDAN">Sedan</option>
                      <option value="COMPACT_SUV">Compact SUV</option>
                      <option value="SUV">SUV</option>
                      <option value="MUV_MPV">MUV / MPV</option>
                      <option value="PREMIUM_SUV">Premium SUV</option>
                      <option value="ELECTRIC">Electric</option>
                      <option value="WEDDING_EVENT">Wedding & VIP</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-[#EEF0EB]">District</label>
                    <select
                      value={vehicleForm.districtId}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, districtId: e.target.value })}
                      className="w-full h-9 px-2 border border-[#2B352E] bg-[#101411] text-[#EEF0EB] rounded-md"
                    >
                      {BIHAR_DISTRICTS.map((d) => (
                        <option key={d.slug} value={d.slug}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-[#EEF0EB]">Locality</label>
                    <input
                      type="text"
                      value={vehicleForm.locality}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, locality: e.target.value })}
                      placeholder="e.g. Boring Road, Airport"
                      className="w-full h-9 px-2.5 border border-[#2B352E] bg-[#101411] text-[#EEF0EB] rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-[#EEF0EB]">Daily Price (₹)</label>
                    <input
                      type="number"
                      value={vehicleForm.dailyPrice}
                      onChange={(e) =>
                        setVehicleForm({ ...vehicleForm, dailyPrice: Number(e.target.value) })
                      }
                      className="w-full h-9 px-2.5 border border-[#2B352E] bg-[#101411] text-[#EEF0EB] rounded-md"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-[#EEF0EB]">Photo Image URL</label>
                  <input
                    type="url"
                    value={vehicleForm.imageUrl}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full h-9 px-2.5 border border-[#2B352E] bg-[#101411] text-[#EEF0EB] rounded-md"
                    required
                  />
                </div>

                {/* Initial Visibility Switch */}
                <div className="p-3 rounded-md bg-[#101411] border border-[#2B352E] flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-[#EEF0EB] block">Make Live on Website</span>
                    <span className="text-[11px] text-[#8E9991]">
                      If turned off, this car will remain hidden in draft mode and only visible to admin.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={vehicleForm.isActive}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, isActive: e.target.checked })}
                    className="w-5 h-5 accent-[#2D6A54]"
                  />
                </div>

                <div className="pt-3 border-t border-[#2B352E] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCarModal(false)}
                    className="px-4 py-2 border border-[#2B352E] rounded-md text-[#8E9991]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#2D6A54] text-white rounded-md font-semibold hover:bg-[#387F66]"
                  >
                    {editingVehicleId ? "Save Changes" : "Create Vehicle"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
