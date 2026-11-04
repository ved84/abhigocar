"use client";

import { useState } from "react";
import { Vehicle, Booking, CustomerInquiry, AvailabilityBlock } from "@/types";
import { BIHAR_DISTRICTS } from "@/data/districts";
import { formatINR } from "@/lib/pricing";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  Search,
  Eye,
  EyeOff,
  Sparkles,
  XCircle,
} from "lucide-react";

export function AdminDashboardClient({
  initialVehicles,
  initialBookings,
  initialBlocks,
}: {
  initialVehicles: Vehicle[];
  initialBookings: Booking[];
  initialInquiries: CustomerInquiry[];
  initialBlocks: AvailabilityBlock[];
  adminUser: any;
}) {
  const [activeTab, setActiveTab] = useState<
    "vehicles" | "bookings" | "calendar"
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
    imageUrl: "/cars/maruti-swift.jpg",
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
    <div className="py-8 bg-[#0E1216] text-[#F1F4F7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Admin Header */}
        <div className="bg-[#141A1F] rounded-xl border border-[#242D35] p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C63832] animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C63832]">
                Fleet Control & Visibility Manager
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Admin Operations Console
            </h1>
            <p className="text-xs text-[#8F9CA8]">
              Manage which cars appear on the public website, toggle visibility, and monitor reservations.
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
                  imageUrl: "/cars/maruti-swift.jpg",
                  isActive: true,
                });
                setShowAddCarModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#C63832] hover:bg-[#E03E36] text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Car Listing</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md border border-[#242D35] text-xs font-semibold text-[#8F9CA8] hover:text-white hover:bg-[#0E1216] transition-colors cursor-pointer"
            >
              Lock Console
            </button>
          </div>
        </div>

        {/* Visibility KPI Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#141A1F] p-5 rounded-xl border border-[#242D35] shadow-md space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8F9CA8] block">
              Total Cars (Database)
            </span>
            <span className="font-display text-3xl font-bold text-white">
              {totalCars}
            </span>
            <span className="text-[11px] text-[#8F9CA8] block">All listings in database</span>
          </div>

          <div className="bg-[#141A1F] p-5 rounded-xl border border-[#242D35] shadow-md space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
              Live on Website (Public)
            </span>
            <span className="font-display text-3xl font-bold text-emerald-400">
              {activeListings}
            </span>
            <span className="text-[11px] text-emerald-400/80 block">Visible to customers</span>
          </div>

          <div className="bg-[#141A1F] p-5 rounded-xl border border-[#242D35] shadow-md space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
              Hidden / Draft
            </span>
            <span className="font-display text-3xl font-bold text-amber-400">
              {hiddenListings}
            </span>
            <span className="text-[11px] text-amber-400/80 block">Only visible to admin</span>
          </div>

          <div className="bg-[#141A1F] p-5 rounded-xl border border-[#242D35] shadow-md space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C63832] block">
              Pending Requests
            </span>
            <span className="font-display text-3xl font-bold text-[#C63832]">
              {pendingRequests}
            </span>
            <span className="text-[11px] text-[#8F9CA8] block">Awaiting dispatch</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 border-b border-[#242D35] pb-px text-xs font-semibold">
          {[
            { id: "vehicles", label: `Cars & Website Visibility (${vehicles.length})` },
            { id: "bookings", label: `WhatsApp Booking Requests (${bookings.length})` },
            { id: "calendar", label: "Maintenance Calendar" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-t-lg transition-colors border-t border-x shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#141A1F] border-[#242D35] text-[#C63832] font-bold shadow-md border-b-transparent"
                  : "border-transparent text-[#8F9CA8] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: VEHICLES FLEET & VISIBILITY CONTROL */}
        {activeTab === "vehicles" && (
          <div className="space-y-4">
            <div className="bg-[#141A1F] rounded-xl border border-[#242D35] overflow-hidden shadow-md">
              <div className="p-4 border-b border-[#242D35] flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-white">
                    Car Listings & Website Visibility Control
                  </h3>
                  <p className="text-xs text-[#8F9CA8]">
                    Toggle the switch to instantly show or hide a car from the public website.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#F1F4F7]">
                  <thead className="bg-[#0E1216] border-b border-[#242D35] text-[#8F9CA8] uppercase text-[10px] tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-4">Car & Model</th>
                      <th className="py-3 px-4">RTO Plate (Private)</th>
                      <th className="py-3 px-4">District / Locality</th>
                      <th className="py-3 px-4">Rate</th>
                      <th className="py-3 px-4 text-center">Public Website Visibility</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#242D35]">
                    {vehicles.map((v) => (
                      <tr key={v.id} className="hover:bg-[#1D242C] transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">
                            {v.make} {v.model} ({v.year})
                          </div>
                          <div className="text-[11px] text-[#8F9CA8]">{v.variant}</div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#0E1216] border border-[#242D35] text-[#8F9CA8]">
                            {v.registrationRef}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="capitalize font-medium text-white">{v.districtId}</div>
                          <div className="text-[11px] text-[#8F9CA8]">{v.locality}</div>
                        </td>

                        <td className="py-3 px-4 font-bold text-[#C63832]">
                          {formatINR(v.dailyPrice)}/day
                        </td>

                        {/* Visibility Toggle Button */}
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleVisibility(v.id, v.isActive)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
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
                              className={`p-1.5 rounded border border-[#242D35] cursor-pointer ${
                                v.isFeatured ? "text-amber-400 bg-amber-950/40" : "text-[#8F9CA8]"
                              }`}
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleEditClick(v)}
                              title="Edit Details"
                              className="p-1.5 rounded border border-[#242D35] text-[#8F9CA8] hover:text-white cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteVehicle(v.id)}
                              title="Delete Car"
                              className="p-1.5 rounded border border-[#242D35] text-rose-400 hover:text-rose-300 cursor-pointer"
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
            <div className="bg-[#141A1F] rounded-xl border border-[#242D35] p-4 shadow-md flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F9CA8]" />
                <input
                  type="text"
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  placeholder="Filter by ref, name, phone..."
                  className="w-full h-9 pl-9 pr-3 text-xs bg-[#0E1216] border border-[#242D35] rounded-md text-white focus:outline-none focus:border-[#C63832]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-[#8F9CA8] font-bold">Status:</span>
                <select
                  value={bookingStatusFilter}
                  onChange={(e) => setBookingStatusFilter(e.target.value)}
                  className="h-9 px-2 text-xs bg-[#0E1216] border border-[#242D35] rounded-md text-white"
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

            <div className="bg-[#141A1F] rounded-xl border border-[#242D35] overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#F1F4F7]">
                  <thead className="bg-[#0E1216] border-b border-[#242D35] text-[#8F9CA8] uppercase text-[10px] tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-4">Ref & Dates</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Vehicle</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Dispatch</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#242D35]">
                    {filteredBookings.map((b) => {
                      const veh = vehicles.find((v) => v.id === b.vehicleId);
                      return (
                        <tr key={b.id} className="hover:bg-[#1D242C] transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-white">
                              {b.bookingRef}
                            </span>
                            <div className="text-[11px] text-[#8F9CA8]">
                              {b.startDate} to {b.endDate} ({b.totalDays}d)
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-semibold text-white">{b.customerName}</div>
                            <div className="text-[11px] text-[#8F9CA8]">{b.customerPhone}</div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-medium text-white">
                              {veh ? `${veh.make} ${veh.model}` : b.vehicleId}
                            </div>
                            <div className="text-[11px] text-[#8F9CA8] capitalize">
                              {b.rentalModeSelected.replace(/_/g, " ").toLowerCase()}
                            </div>
                          </td>

                          <td className="py-3 px-4 font-bold text-[#C63832]">
                            {formatINR(b.totalAmount)}
                          </td>

                          <td className="py-3 px-4">
                            <select
                              value={b.status}
                              onChange={(e) =>
                                handleUpdateBookingStatus(b.id, e.target.value as any)
                              }
                              className="px-2 py-1 text-xs border border-[#242D35] rounded-md bg-[#0E1216] text-white font-semibold"
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
                                className="px-3 py-1 bg-[#C63832] hover:bg-[#E03E36] text-white rounded text-xs font-bold transition-colors shadow-sm cursor-pointer"
                              >
                                Approve
                              </button>
                            ) : (
                              <span className="text-[11px] text-[#8F9CA8]">Managed</span>
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
            <div className="lg:col-span-5 bg-[#141A1F] p-6 rounded-xl border border-[#242D35] shadow-md space-y-4">
              <h3 className="font-display text-base font-bold text-white">
                Block Maintenance Dates
              </h3>
              <p className="text-xs text-[#8F9CA8]">
                Blocked dates automatically prevent double-booking for the selected vehicle.
              </p>

              <form onSubmit={handleAddMaintenanceBlock} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-white block mb-1">
                    Select Vehicle
                  </label>
                  <select
                    value={newBlockVehicleId}
                    onChange={(e) => setNewBlockVehicleId(e.target.value)}
                    className="w-full h-9 px-2 border border-[#242D35] rounded-md bg-[#0E1216] text-white"
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
                    <label className="font-bold text-white block mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={newBlockStart}
                      onChange={(e) => setNewBlockStart(e.target.value)}
                      className="w-full h-9 px-2 border border-[#242D35] rounded-md bg-[#0E1216] text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-white block mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={newBlockEnd}
                      min={newBlockStart}
                      onChange={(e) => setNewBlockEnd(e.target.value)}
                      className="w-full h-9 px-2 border border-[#242D35] rounded-md bg-[#0E1216] text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-white block mb-1">
                    Maintenance Reason / Notes
                  </label>
                  <textarea
                    rows={2}
                    value={newBlockNotes}
                    onChange={(e) => setNewBlockNotes(e.target.value)}
                    placeholder="e.g. Periodic oil service and brake inspection"
                    className="w-full p-2 border border-[#242D35] rounded-md bg-[#0E1216] text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-md bg-[#C63832] hover:bg-[#E03E36] text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
                >
                  Block Dates
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-[#141A1F] p-6 rounded-xl border border-[#242D35] shadow-md space-y-4">
              <h3 className="font-display text-base font-bold text-white">
                Active Maintenance Blocks ({blocks.length})
              </h3>

              {blocks.length === 0 ? (
                <p className="text-xs text-[#8F9CA8]">No dates currently blocked.</p>
              ) : (
                <div className="space-y-3">
                  {blocks.map((b) => {
                    const veh = vehicles.find((v) => v.id === b.vehicleId);
                    return (
                      <div
                        key={b.id}
                        className="p-4 rounded-lg bg-[#0E1216] border border-[#242D35] flex items-center justify-between text-xs"
                      >
                        <div className="space-y-1">
                          <span className="font-bold text-white block">
                            {veh ? `${veh.make} ${veh.model}` : b.vehicleId}
                          </span>
                          <div className="text-[#8F9CA8] flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#C63832]" />
                            <span>
                              {b.startDate} to {b.endDate}
                            </span>
                          </div>
                          {b.notes && <p className="text-[#8F9CA8] text-[11px]">{b.notes}</p>}
                        </div>

                        <button
                          onClick={() => handleRemoveBlock(b.id)}
                          className="px-3 py-1 rounded bg-rose-950/40 text-rose-300 border border-rose-800 text-xs font-semibold hover:bg-rose-900 cursor-pointer"
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
            <div className="bg-[#141A1F] rounded-xl border border-[#242D35] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 text-[#F1F4F7] shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#242D35]">
                <h3 className="font-display text-lg font-bold text-white">
                  {editingVehicleId ? "Edit Car Listing" : "Add New Vehicle to Fleet"}
                </h3>
                <button
                  onClick={() => setShowAddCarModal(false)}
                  className="p-1 rounded text-[#8F9CA8] hover:text-white cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCar} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold block mb-1 text-white">Make</label>
                    <input
                      type="text"
                      value={vehicleForm.make}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, make: e.target.value })}
                      placeholder="e.g. Maruti Suzuki"
                      className="w-full h-9 px-2.5 border border-[#242D35] bg-[#0E1216] text-white rounded-md focus:border-[#C63832] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1 text-white">Model</label>
                    <input
                      type="text"
                      value={vehicleForm.model}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                      placeholder="e.g. Swift, Scorpio-N"
                      className="w-full h-9 px-2.5 border border-[#242D35] bg-[#0E1216] text-white rounded-md focus:border-[#C63832] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1 text-white">Variant</label>
                    <input
                      type="text"
                      value={vehicleForm.variant}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, variant: e.target.value })}
                      placeholder="e.g. ZXi+ Dualjet"
                      className="w-full h-9 px-2.5 border border-[#242D35] bg-[#0E1216] text-white rounded-md focus:border-[#C63832] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold block mb-1 text-white">RTO Plate (Private)</label>
                    <input
                      type="text"
                      value={vehicleForm.registrationRef}
                      onChange={(e) =>
                        setVehicleForm({ ...vehicleForm, registrationRef: e.target.value })
                      }
                      placeholder="BR-01-XX-0000"
                      className="w-full h-9 px-2.5 border border-[#242D35] bg-[#0E1216] text-white rounded-md uppercase font-mono focus:border-[#C63832] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1 text-white">Year</label>
                    <input
                      type="number"
                      value={vehicleForm.year}
                      onChange={(e) =>
                        setVehicleForm({ ...vehicleForm, year: Number(e.target.value) })
                      }
                      className="w-full h-9 px-2.5 border border-[#242D35] bg-[#0E1216] text-white rounded-md focus:border-[#C63832] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1 text-white">Category</label>
                    <select
                      value={vehicleForm.category}
                      onChange={(e) =>
                        setVehicleForm({ ...vehicleForm, category: e.target.value as any })
                      }
                      className="w-full h-9 px-2 border border-[#242D35] bg-[#0E1216] text-white rounded-md"
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
                    <label className="font-bold block mb-1 text-white">District</label>
                    <select
                      value={vehicleForm.districtId}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, districtId: e.target.value })}
                      className="w-full h-9 px-2 border border-[#242D35] bg-[#0E1216] text-white rounded-md"
                    >
                      {BIHAR_DISTRICTS.map((d) => (
                        <option key={d.slug} value={d.slug}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-bold block mb-1 text-white">Locality</label>
                    <input
                      type="text"
                      value={vehicleForm.locality}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, locality: e.target.value })}
                      placeholder="e.g. Boring Road, Airport"
                      className="w-full h-9 px-2.5 border border-[#242D35] bg-[#0E1216] text-white rounded-md focus:border-[#C63832] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1 text-white">Daily Rate (₹)</label>
                    <input
                      type="number"
                      value={vehicleForm.dailyPrice}
                      onChange={(e) =>
                        setVehicleForm({ ...vehicleForm, dailyPrice: Number(e.target.value) })
                      }
                      className="w-full h-9 px-2.5 border border-[#242D35] bg-[#0E1216] text-white rounded-md focus:border-[#C63832] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold block mb-1 text-white">Photo Image URL</label>
                  <input
                    type="text"
                    value={vehicleForm.imageUrl}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, imageUrl: e.target.value })}
                    placeholder="/cars/honda-city.jpg or image URL"
                    className="w-full h-9 px-2.5 border border-[#242D35] bg-[#0E1216] text-white rounded-md focus:border-[#C63832] focus:outline-none"
                    required
                  />
                </div>

                {/* Initial Visibility Switch */}
                <div className="p-3 rounded-md bg-[#0E1216] border border-[#242D35] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">Make Live on Website</span>
                    <span className="text-[11px] text-[#8F9CA8]">
                      If turned off, this car will remain hidden in draft mode and only visible to admin.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={vehicleForm.isActive}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, isActive: e.target.checked })}
                    className="w-5 h-5 accent-[#C63832]"
                  />
                </div>

                <div className="pt-3 border-t border-[#242D35] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCarModal(false)}
                    className="px-4 py-2 border border-[#242D35] rounded-md text-[#8F9CA8] hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#C63832] hover:bg-[#E03E36] text-white rounded-md font-bold transition-colors shadow-md cursor-pointer"
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
