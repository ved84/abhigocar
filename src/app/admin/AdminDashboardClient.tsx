"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
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
  Star,
  XCircle,
  RefreshCw,
  ExternalLink,
  LayoutGrid,
  Table as TableIcon,
  Car,
  CheckCircle2,
  AlertCircle,
  Sparkles,
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
  adminUser: { id?: string; email?: string; role?: string; [key: string]: unknown };
}) {
  const [activeTab, setActiveTab] = useState<"vehicles" | "bookings" | "calendar">("vehicles");

  // State
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>(initialBlocks);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Delete confirmation modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Vehicle filters & view
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [vehicleCategoryFilter, setVehicleCategoryFilter] = useState("ALL");
  const [vehicleDistrictFilter, setVehicleDistrictFilter] = useState("ALL");
  const [vehicleStatusFilter, setVehicleStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [vehicleViewMode, setVehicleViewMode] = useState<"table" | "grid">("table");

  // Vehicle Modal / Form State
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [vehicleForm, setVehicleForm] = useState({
    registrationRef: "BR-01-AB-1234",
    make: "",
    model: "",
    variant: "",
    year: 2024,
    category: "HATCHBACK" as Vehicle["category"],
    fuelType: "PETROL" as Vehicle["fuelType"],
    transmission: "MANUAL" as Vehicle["transmission"],
    seats: 5,
    luggageCapacity: 2,
    rentalMode: "BOTH" as Vehicle["rentalMode"],
    districtId: "patna",
    locality: "Bailey Road",
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
    isFeatured: false,
  });

  // Maintenance Block Form State
  const [newBlockVehicleId, setNewBlockVehicleId] = useState(vehicles[0]?.id || "");
  const [newBlockStart, setNewBlockStart] = useState("");
  const [newBlockEnd, setNewBlockEnd] = useState("");
  const [newBlockNotes, setNewBlockNotes] = useState("");

  // Booking Filter State
  const [bookingStatusFilter, setBookingStatusFilter] = useState("ALL");
  const [bookingSearch, setBookingSearch] = useState("");

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Auto-fetch latest vehicles on mount & on demand
  const fetchLatestFleet = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/vehicles?includeInactive=true");
      if (res.ok) {
        const data = await res.json();
        if (data?.vehicles) {
          setVehicles(data.vehicles);
          showToast("Cars synchronized with database.");
        }
      }
    } catch {
      showToast("Could not sync latest cars.", "error");
    } finally {
      setIsRefreshing(false);
    }
  };

  const notifyVehicleSync = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("abhigocar_vehicles_synced"));
      try {
        localStorage.setItem("abhigocar_vehicles_last_updated", Date.now().toString());
      } catch {}
    }
  };

  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedDummyCars = async () => {
    if (vehicles.length > 0 && !confirm("This will reload all 13 verified dummy cars (Swift, Scorpio, Fortuner, Brezza, Innova, etc.). Continue?")) {
      return;
    }
    setIsSeeding(true);
    try {
      const res = await fetch("/api/vehicles/seed", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.vehicles) {
        setVehicles(data.vehicles);
        notifyVehicleSync();
        showToast(`Successfully loaded all ${data.vehicles.length} dummy cars into the admin panel!`);
      } else {
        showToast(data.error || "Failed to load dummy cars", "error");
      }
    } catch {
      showToast("Failed to connect to server.", "error");
    } finally {
      setIsSeeding(false);
    }
  };

  useEffect(() => {
    fetchLatestFleet();
  }, []);

  // Handle Escape key to close modals (R-32)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showAddCarModal) setShowAddCarModal(false);
        if (deleteTargetId) setDeleteTargetId(null);
      }
    },
    [showAddCarModal, deleteTargetId]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Operational KPI metrics
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
        notifyVehicleSync();
        showToast(newStatus ? "Vehicle listing published live." : "Vehicle listing moved to draft.");
      } else {
        showToast("Error updating visibility on website.", "error");
      }
    } catch {
      showToast("Network error updating visibility.", "error");
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
        notifyVehicleSync();
        showToast(!current ? "Marked as featured car." : "Removed featured status.");
      } else {
        showToast("Error updating featured status.", "error");
      }
    } catch {
      showToast("Network error updating featured status.", "error");
    }
  };

  // Delete vehicle execution
  const executeDeleteVehicle = async () => {
    if (!deleteTargetId) return;
    try {
      const res = await fetch(`/api/vehicles/${deleteTargetId}`, { method: "DELETE" });
      if (res.ok) {
        setVehicles((prev) => prev.filter((v) => v.id !== deleteTargetId));
        notifyVehicleSync();
        showToast("Vehicle listing removed successfully.");
      } else {
        showToast("Failed to delete vehicle.", "error");
      }
    } catch {
      showToast("Network error deleting vehicle.", "error");
    } finally {
      setDeleteTargetId(null);
    }
  };

  // Save new car or edit
  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...vehicleForm,
      features: vehicleForm.featuresStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
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

    try {
      if (editingVehicleId) {
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
          notifyVehicleSync();
          showToast("Car details updated.");
        } else {
          showToast(data.error || "Failed to update car details", "error");
        }
      } else {
        const res = await fetch("/api/vehicles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok) {
          setVehicles((prev) => [data.vehicle, ...prev]);
          setShowAddCarModal(false);
          notifyVehicleSync();
          showToast("New vehicle created in database.");
        } else {
          showToast(data.error || "Failed to create vehicle", "error");
        }
      }
    } catch {
      showToast("Network error saving vehicle details.", "error");
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
      featuresStr: v.features?.join(", ") || "",
      imageUrl: v.images[0]?.url || "/cars/maruti-swift.jpg",
      isActive: v.isActive,
      isFeatured: v.isFeatured,
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
        showToast(`Booking ref ${data.booking.bookingRef} marked as ${status}.`);
      } else {
        showToast("Failed to update booking status.", "error");
      }
    } catch {
      showToast("Network error updating booking.", "error");
    }
  };

  // Add Maintenance Block
  const handleAddMaintenanceBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockVehicleId || !newBlockStart || !newBlockEnd) {
      showToast("Please select vehicle and date range.", "error");
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
    showToast("Maintenance dates blocked for vehicle.");
  };

  const handleRemoveBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    showToast("Maintenance block removed.");
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  };

  // Filtered Vehicles
  const filteredVehicles = vehicles.filter((v) => {
    if (vehicleSearch) {
      const s = vehicleSearch.toLowerCase().trim();
      const match =
        v.make.toLowerCase().includes(s) ||
        v.model.toLowerCase().includes(s) ||
        v.variant.toLowerCase().includes(s) ||
        v.registrationRef.toLowerCase().includes(s) ||
        v.districtId.toLowerCase().includes(s) ||
        v.locality.toLowerCase().includes(s);
      if (!match) return false;
    }

    if (vehicleCategoryFilter !== "ALL" && v.category !== vehicleCategoryFilter) {
      return false;
    }

    if (vehicleDistrictFilter !== "ALL" && v.districtId !== vehicleDistrictFilter) {
      return false;
    }

    if (vehicleStatusFilter === "ACTIVE" && !v.isActive) return false;
    if (vehicleStatusFilter === "INACTIVE" && v.isActive) return false;

    return true;
  });

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
    <div className="py-6 sm:py-8 bg-[#0D1117] text-[#F0F6FC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 space-y-6">
        {/* Toast Notification Banner */}
        {toastMessage && (
          <div
            className={`p-3 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all ${
              toastMessage.type === "success"
                ? "bg-[#1C2C24] border-emerald-600/60 text-emerald-300"
                : "bg-[#2D1515] border-red-700 text-red-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {toastMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
              <span>{toastMessage.text}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-white hover:opacity-80 p-0.5 cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

        {/* Admin Header - Car Management */}
        <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-5 sm:p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E03E36] block">
              Car & Booking Desk
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
              Admin Car Manager
            </h1>
            <p className="text-xs sm:text-sm text-[#9CA3AF] mt-0.5">
              Control website vehicle visibility, update rates, and manage bookings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleSeedDummyCars}
              disabled={isSeeding}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500"
              title="Populate admin panel with all 13 verified dummy cars"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isSeeding ? "animate-spin text-amber-400" : "text-amber-400"}`} />
              <span>{isSeeding ? "Loading Cars..." : "Load Demo Cars"}</span>
            </button>

            <button
              onClick={fetchLatestFleet}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-white text-xs font-semibold border border-[#30363D] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C63832]"
              title="Refresh Cars from Database"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#E03E36]" : ""}`} />
              <span>{isRefreshing ? "Syncing..." : "Sync Database"}</span>
            </button>

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
                  isFeatured: false,
                });
                setShowAddCarModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#C63832] hover:bg-[#E03E36] text-white text-xs font-bold shadow-sm transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C63832]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Vehicle Listing</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-lg border border-[#30363D] text-xs font-semibold text-[#9CA3AF] hover:text-white hover:bg-[#21262D] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C63832]"
            >
              Lock Console
            </button>
          </div>
        </div>

        {/* Operational Priority KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Urgent Dispatch Action Metric */}
          <div className="bg-[#161B22] p-4 sm:p-5 rounded-xl border border-[#30363D] space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#E03E36] block">
              Pending Booking Requests
            </span>
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              {pendingRequests}
            </span>
            <span className="text-xs text-[#9CA3AF] block">
              {pendingRequests > 0 ? "Requires approval action" : "All requests handled"}
            </span>
          </div>

          <div className="bg-[#161B22] p-4 sm:p-5 rounded-xl border border-[#30363D] space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
              Live on Website
            </span>
            <span className="font-display text-2xl sm:text-3xl font-bold text-emerald-400">
              {activeListings}
            </span>
            <span className="text-xs text-[#9CA3AF] block">Active vehicles for rent</span>
          </div>

          <div className="bg-[#161B22] p-4 sm:p-5 rounded-xl border border-[#30363D] space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
              Draft or Hidden
            </span>
            <span className="font-display text-2xl sm:text-3xl font-bold text-amber-400">
              {hiddenListings}
            </span>
            <span className="text-xs text-[#9CA3AF] block">Not visible to public</span>
          </div>

          <div className="bg-[#161B22] p-4 sm:p-5 rounded-xl border border-[#30363D] space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] block">
              Total Cars (Database)
            </span>
            <span className="font-display text-2xl sm:text-3xl font-bold text-white">
              {totalCars}
            </span>
            <span className="text-xs text-[#9CA3AF] block">Total vehicle records</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 border-b border-[#30363D] pb-px text-xs font-semibold">
          {[
            { id: "vehicles", label: `Vehicles (${vehicles.length})` },
            { id: "bookings", label: `WhatsApp Booking Requests (${bookings.length})` },
            { id: "calendar", label: `Maintenance Calendar (${blocks.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-t-lg transition-colors border-t border-x shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C63832] ${
                activeTab === tab.id
                  ? "bg-[#161B22] border-[#30363D] text-[#E03E36] font-bold shadow-sm border-b-transparent"
                  : "border-transparent text-[#9CA3AF] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: VEHICLES & VISIBILITY CONTROL */}
        {activeTab === "vehicles" && (
          <div className="space-y-4">
            {/* Zero Vehicles Banner */}
            {vehicles.length === 0 && (
              <div className="bg-[#161B22] p-8 rounded-xl border border-amber-500/40 text-center space-y-4 shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white">No cars loaded in database yet</h3>
                  <p className="text-xs text-[#9CA3AF] max-w-md mx-auto mt-1">
                    Click below to instantly populate the admin panel with all 13 verified dummy cars (Swift, Scorpio-N, Brezza, Creta, Fortuner, Innova Crysta, Thar, Nexon EV, Ertiga, Audi A6, Dzire) with full photos, rates, and specs.
                  </p>
                </div>
                <button
                  onClick={handleSeedDummyCars}
                  disabled={isSeeding}
                  className="px-6 py-2.5 rounded-lg bg-[#C63832] hover:bg-[#E03E36] text-white text-xs font-bold cursor-pointer transition-colors shadow-md"
                >
                  {isSeeding ? "Loading Demo Cars..." : "Load 13 Dummy Cars Now"}
                </button>
              </div>
            )}

            {/* Filter Toolbar */}
            <div className="bg-[#161B22] p-4 rounded-xl border border-[#30363D] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[260px]">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="text"
                    placeholder="Search by model, plate, or district..."
                    value={vehicleSearch}
                    onChange={(e) => setVehicleSearch(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 text-xs clean-input rounded-lg text-white placeholder-[#6E7681]"
                  />
                  {vehicleSearch && (
                    <button
                      onClick={() => setVehicleSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-white cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <select
                  value={vehicleCategoryFilter}
                  onChange={(e) => setVehicleCategoryFilter(e.target.value)}
                  className="h-9 px-2.5 text-xs bg-[#0D1117] border border-[#30363D] rounded-lg text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C63832]"
                >
                  <option value="ALL">All Categories</option>
                  <option value="HATCHBACK">Hatchback</option>
                  <option value="SEDAN">Sedan</option>
                  <option value="COMPACT_SUV">Compact SUV</option>
                  <option value="SUV">SUV</option>
                  <option value="MUV_MPV">MUV / MPV</option>
                  <option value="PREMIUM_SUV">Premium SUV</option>
                  <option value="ELECTRIC">Electric (EV)</option>
                  <option value="WEDDING_EVENT">Wedding & VIP</option>
                </select>

                {/* District Filter */}
                <select
                  value={vehicleDistrictFilter}
                  onChange={(e) => setVehicleDistrictFilter(e.target.value)}
                  className="h-9 px-2.5 text-xs bg-[#0D1117] border border-[#30363D] rounded-lg text-white cursor-pointer capitalize focus-visible:ring-2 focus-visible:ring-[#C63832]"
                >
                  <option value="ALL">All Districts</option>
                  {BIHAR_DISTRICTS.map((d) => (
                    <option key={d.slug} value={d.slug}>
                      {d.name}
                    </option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={vehicleStatusFilter}
                  onChange={(e) => setVehicleStatusFilter(e.target.value as any)}
                  className="h-9 px-2.5 text-xs bg-[#0D1117] border border-[#30363D] rounded-lg text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C63832]"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">Live on Website ({activeListings})</option>
                  <option value="INACTIVE">Hidden / Draft ({hiddenListings})</option>
                </select>
              </div>

              {/* View Mode Switcher */}
              <div className="flex items-center gap-1 border border-[#30363D] p-1 rounded-lg bg-[#0D1117]">
                <button
                  onClick={() => setVehicleViewMode("table")}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    vehicleViewMode === "table"
                      ? "bg-[#C63832] text-white"
                      : "text-[#9CA3AF] hover:text-white"
                  }`}
                  title="Table View"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setVehicleViewMode("grid")}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    vehicleViewMode === "grid"
                      ? "bg-[#C63832] text-white"
                      : "text-[#9CA3AF] hover:text-white"
                  }`}
                  title="Card Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Empty state */}
            {filteredVehicles.length === 0 ? (
              <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-12 text-center space-y-3">
                <Car className="w-10 h-10 text-[#9CA3AF] mx-auto opacity-50" />
                <p className="text-white font-bold">No vehicles match your active search or filter criteria.</p>
                <p className="text-xs text-[#9CA3AF]">
                  Try clearing your search query or reset the district and category filters.
                </p>
                <button
                  onClick={() => {
                    setVehicleSearch("");
                    setVehicleCategoryFilter("ALL");
                    setVehicleDistrictFilter("ALL");
                    setVehicleStatusFilter("ALL");
                  }}
                  className="px-4 py-2 rounded-lg bg-[#C63832] hover:bg-[#E03E36] text-white text-xs font-bold cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : vehicleViewMode === "table" ? (
              /* TABLE VIEW */
              <div className="bg-[#161B22] rounded-xl border border-[#30363D] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#F0F6FC]">
                    <thead className="bg-[#0D1117] border-b border-[#30363D] text-[#9CA3AF] uppercase text-[10px] tracking-wider font-bold">
                      <tr>
                        <th className="py-3 px-4">Car & Model</th>
                        <th className="py-3 px-4">Plate / Year</th>
                        <th className="py-3 px-4">District / Hub</th>
                        <th className="py-3 px-4">Daily Rate</th>
                        <th className="py-3 px-4 text-center">Website Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#30363D]">
                      {filteredVehicles.map((v) => (
                        <tr key={v.id} className="hover:bg-[#21262D] transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {v.isFeatured && (
                                <span title="Featured Vehicle">
                                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                                </span>
                              )}
                              <span className="font-bold text-white text-xs sm:text-sm">
                                {v.make} {v.model}
                              </span>
                            </div>
                            <div className="text-[11px] text-[#9CA3AF] flex items-center gap-1.5 mt-0.5">
                              <span>{v.variant}</span>
                              <span>•</span>
                              <span className="capitalize">{v.category.replace(/_/g, " ").toLowerCase()}</span>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#0D1117] border border-[#30363D] text-[#C9D1D9]">
                              {v.registrationRef}
                            </span>
                            <div className="text-[11px] text-[#9CA3AF] mt-0.5">{v.year}</div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="capitalize font-medium text-white">{v.districtId}</div>
                            <div className="text-[11px] text-[#9CA3AF] truncate max-w-[140px]">{v.locality}</div>
                          </td>

                          <td className="py-3 px-4 font-bold text-[#E03E36] whitespace-nowrap">
                            {formatINR(v.dailyPrice)}/day
                            <div className="text-[10px] text-[#9CA3AF] font-normal">
                              Deposit: {formatINR(v.securityDeposit)}
                            </div>
                          </td>

                          {/* Visibility Toggle Button */}
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleToggleVisibility(v.id, v.isActive)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors border cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C63832] ${
                                v.isActive
                                  ? "bg-[#1C2C24] border-emerald-600/50 text-emerald-300 hover:bg-[#23382D]"
                                  : "bg-[#21262D] border-[#30363D] text-[#9CA3AF] hover:bg-[#30363D]"
                              }`}
                            >
                              {v.isActive ? (
                                <>
                                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Live on Website</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3.5 h-3.5 text-neutral-400" />
                                  <span>Hidden (Draft)</span>
                                </>
                              )}
                            </button>
                          </td>

                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Preview link */}
                              <Link
                                href={`/cars/${v.districtId}/${v.slug}`}
                                target="_blank"
                                title="Preview Public Page"
                                className="p-1.5 rounded border border-[#30363D] text-[#9CA3AF] hover:text-white hover:bg-[#21262D] focus-visible:ring-1 focus-visible:ring-[#C63832]"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>

                              {/* Toggle Featured */}
                              <button
                                onClick={() => handleToggleFeatured(v.id, v.isFeatured)}
                                title={v.isFeatured ? "Remove Featured Tag" : "Mark as Featured"}
                                className={`p-1.5 rounded border border-[#30363D] cursor-pointer focus-visible:ring-1 focus-visible:ring-[#C63832] ${
                                  v.isFeatured
                                    ? "text-amber-400 bg-amber-950/40 border-amber-600/50"
                                    : "text-[#9CA3AF] hover:text-amber-400 hover:bg-[#21262D]"
                                }`}
                              >
                                <Star className="w-3.5 h-3.5" />
                              </button>

                              {/* Edit */}
                              <button
                                onClick={() => handleEditClick(v)}
                                title="Edit Full Vehicle Details"
                                className="p-1.5 rounded border border-[#30363D] text-[#9CA3AF] hover:text-white hover:bg-[#21262D] cursor-pointer focus-visible:ring-1 focus-visible:ring-[#C63832]"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => setDeleteTargetId(v.id)}
                                title="Delete Vehicle Record"
                                className="p-1.5 rounded border border-[#30363D] text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 cursor-pointer focus-visible:ring-1 focus-visible:ring-[#C63832]"
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
            ) : (
              /* CARD GRID VIEW */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVehicles.map((v) => (
                  <div
                    key={v.id}
                    className="bg-[#161B22] rounded-xl border border-[#30363D] p-4 shadow-sm space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top status bar */}
                      <div className="flex items-center justify-between pb-2 border-b border-[#30363D] text-xs">
                        <span className="font-mono text-[#9CA3AF]">{v.registrationRef}</span>
                        <div className="flex items-center gap-1.5">
                          {v.isFeatured && (
                            <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-600/40 text-amber-400 text-[10px] font-bold">
                              Featured
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              v.isActive
                                ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/40"
                                : "bg-[#21262D] text-[#9CA3AF] border border-[#30363D]"
                            }`}
                          >
                            {v.isActive ? "Live" : "Draft"}
                          </span>
                        </div>
                      </div>

                      {/* Title & Info */}
                      <div className="mt-2.5">
                        <h4 className="font-display text-base font-bold text-white">
                          {v.make} {v.model} ({v.year})
                        </h4>
                        <p className="text-xs text-[#9CA3AF] mt-0.5">{v.variant}</p>
                      </div>

                      {/* Specs */}
                      <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-[#9CA3AF]">
                        <div className="bg-[#0D1117] p-2 rounded-lg border border-[#30363D]">
                          <span className="text-[10px] block text-[#6E7681]">DISTRICT</span>
                          <span className="capitalize font-semibold text-white">{v.districtId}</span>
                        </div>
                        <div className="bg-[#0D1117] p-2 rounded-lg border border-[#30363D]">
                          <span className="text-[10px] block text-[#6E7681]">RATE</span>
                          <span className="font-bold text-[#E03E36]">{formatINR(v.dailyPrice)}/day</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-3 border-t border-[#30363D] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleVisibility(v.id, v.isActive)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C63832] ${
                          v.isActive
                            ? "bg-[#1C2C24] border-emerald-600/50 text-emerald-300"
                            : "bg-[#21262D] border-[#30363D] text-[#9CA3AF]"
                        }`}
                      >
                        {v.isActive ? "Active (Hide)" : "Draft (Make Live)"}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/cars/${v.districtId}/${v.slug}`}
                          target="_blank"
                          title="Preview"
                          className="p-1.5 rounded-lg border border-[#30363D] text-[#9CA3AF] hover:text-white"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleEditClick(v)}
                          title="Edit"
                          className="p-1.5 rounded-lg border border-[#30363D] text-[#9CA3AF] hover:text-white cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(v.id)}
                          title="Delete"
                          className="p-1.5 rounded-lg border border-[#30363D] text-rose-400 hover:text-rose-300 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BOOKINGS MANAGEMENT */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#161B22] p-4 rounded-xl border border-[#30363D]">
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="text"
                  placeholder="Search booking ref, customer, phone..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 text-xs clean-input rounded-lg text-white"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-[#9CA3AF] font-bold">Status:</span>
                <select
                  value={bookingStatusFilter}
                  onChange={(e) => setBookingStatusFilter(e.target.value)}
                  className="h-9 px-2 text-xs bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus-visible:ring-2 focus-visible:ring-[#C63832]"
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

            <div className="bg-[#161B22] rounded-xl border border-[#30363D] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#F0F6FC]">
                  <thead className="bg-[#0D1117] border-b border-[#30363D] text-[#9CA3AF] uppercase text-[10px] tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-4">Ref & Dates</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Vehicle</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Dispatch Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#30363D]">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-[#9CA3AF]">
                          No booking records match the selected filter.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => {
                        const veh = vehicles.find((v) => v.id === b.vehicleId);
                        return (
                          <tr key={b.id} className="hover:bg-[#21262D] transition-colors">
                            <td className="py-3 px-4">
                              <span className="font-mono font-bold text-white">
                                {b.bookingRef}
                              </span>
                              <div className="text-[11px] text-[#9CA3AF]">
                                {b.startDate} to {b.endDate} ({b.totalDays}d)
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <div className="font-semibold text-white">{b.customerName}</div>
                              <div className="text-[11px] text-[#9CA3AF]">{b.customerPhone}</div>
                            </td>

                            <td className="py-3 px-4">
                              <div className="font-medium text-white">
                                {veh ? `${veh.make} ${veh.model}` : b.vehicleId}
                              </div>
                              <div className="text-[11px] text-[#9CA3AF] capitalize">
                                {b.rentalModeSelected.replace(/_/g, " ").toLowerCase()}
                              </div>
                            </td>

                            <td className="py-3 px-4 font-bold text-[#E03E36]">
                              {formatINR(b.totalAmount)}
                            </td>

                            <td className="py-3 px-4">
                              <select
                                value={b.status}
                                onChange={(e) =>
                                  handleUpdateBookingStatus(b.id, e.target.value as any)
                                }
                                className="px-2 py-1 text-xs border border-[#30363D] rounded-md bg-[#0D1117] text-white font-semibold focus-visible:ring-2 focus-visible:ring-[#C63832]"
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
                                  className="px-3 py-1 bg-[#C63832] hover:bg-[#E03E36] text-white rounded text-xs font-bold transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C63832]"
                                >
                                  Approve & Dispatch
                                </button>
                              ) : (
                                <span className="text-xs text-[#9CA3AF]">Processed</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CALENDAR & MAINTENANCE BLOCKS */}
        {activeTab === "calendar" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            <div className="lg:col-span-5 bg-[#161B22] p-5 sm:p-6 rounded-xl border border-[#30363D] space-y-4 shadow-sm">
              <h3 className="font-display text-base font-bold text-white">
                Block Maintenance Dates
              </h3>
              <p className="text-xs text-[#9CA3AF]">
                Blocked dates automatically prevent public customer reservations for the selected car.
              </p>

              <form onSubmit={handleAddMaintenanceBlock} className="space-y-3 text-xs">
                <div>
                  <label htmlFor="block-vehicle-select" className="font-bold text-white block mb-1">
                    Select Vehicle
                  </label>
                  <select
                    id="block-vehicle-select"
                    value={newBlockVehicleId}
                    onChange={(e) => setNewBlockVehicleId(e.target.value)}
                    className="w-full h-9 px-2.5 border border-[#30363D] rounded-lg bg-[#0D1117] text-white focus-visible:ring-2 focus-visible:ring-[#C63832]"
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
                    <label htmlFor="block-start-date" className="font-bold text-white block mb-1">
                      Start Date
                    </label>
                    <input
                      id="block-start-date"
                      type="date"
                      value={newBlockStart}
                      onChange={(e) => setNewBlockStart(e.target.value)}
                      className="w-full h-9 px-2 clean-input rounded-lg text-white"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="block-end-date" className="font-bold text-white block mb-1">
                      End Date
                    </label>
                    <input
                      id="block-end-date"
                      type="date"
                      value={newBlockEnd}
                      min={newBlockStart}
                      onChange={(e) => setNewBlockEnd(e.target.value)}
                      className="w-full h-9 px-2 clean-input rounded-lg text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="block-notes" className="font-bold text-white block mb-1">
                    Maintenance Reason / Notes
                  </label>
                  <textarea
                    id="block-notes"
                    rows={2}
                    value={newBlockNotes}
                    onChange={(e) => setNewBlockNotes(e.target.value)}
                    placeholder="e.g. Periodic workshop service and tire replacement"
                    className="w-full p-2.5 clean-input rounded-lg text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-[#C63832] hover:bg-[#E03E36] text-white font-bold text-xs transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C63832]"
                >
                  Block Selected Dates
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-[#161B22] p-5 sm:p-6 rounded-xl border border-[#30363D] space-y-4 shadow-sm">
              <h3 className="font-display text-base font-bold text-white">
                Active Maintenance Blocks ({blocks.length})
              </h3>

              {blocks.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#9CA3AF] bg-[#0D1117] rounded-lg border border-[#30363D]">
                  No maintenance blocks currently scheduled. All active vehicles are available for trips.
                </div>
              ) : (
                <div className="space-y-3">
                  {blocks.map((b) => {
                    const veh = vehicles.find((v) => v.id === b.vehicleId);
                    return (
                      <div
                        key={b.id}
                        className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] flex items-center justify-between text-xs"
                      >
                        <div className="space-y-1">
                          <span className="font-bold text-white block">
                            {veh ? `${veh.make} ${veh.model}` : b.vehicleId}
                          </span>
                          <div className="text-[#9CA3AF] flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#E03E36]" />
                            <span>
                              {b.startDate} to {b.endDate}
                            </span>
                          </div>
                          {b.notes && <p className="text-[#9CA3AF] text-[11px]">{b.notes}</p>}
                        </div>

                        <button
                          onClick={() => handleRemoveBlock(b.id)}
                          className="px-3 py-1 rounded-lg bg-rose-950/40 text-rose-300 border border-rose-800 text-xs font-semibold hover:bg-rose-900 cursor-pointer focus-visible:ring-1 focus-visible:ring-rose-500"
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

        {/* Delete Confirmation In-App Modal (R-26, C-2) */}
        {deleteTargetId && (
          <div
            className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
          >
            <div className="bg-[#161B22] rounded-xl border border-[#30363D] max-w-sm w-full p-5 space-y-4 shadow-xl text-white">
              <h3 id="delete-dialog-title" className="font-display text-base font-bold text-white">
                Confirm Vehicle Deletion
              </h3>
              <p className="text-xs text-[#9CA3AF]">
                Are you sure you want to remove this vehicle listing from the database? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#30363D]">
                <button
                  type="button"
                  onClick={() => setDeleteTargetId(null)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#30363D] text-xs text-[#9CA3AF] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeDeleteVehicle}
                  className="px-3.5 py-1.5 rounded-lg bg-red-700 hover:bg-red-600 text-white text-xs font-bold cursor-pointer"
                >
                  Delete Listing
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Modal (Accessible with Escape key handling) */}
        {showAddCarModal && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="car-modal-title"
          >
            <div className="bg-[#161B22] rounded-2xl border border-[#30363D] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-5 text-[#F0F6FC] shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#30363D]">
                <h3 id="car-modal-title" className="font-display text-lg font-bold text-white">
                  {editingVehicleId ? "Edit Vehicle Listing & Rates" : "Add Vehicle to abhigocar"}
                </h3>
                <button
                  onClick={() => setShowAddCarModal(false)}
                  className="p-1 rounded text-[#9CA3AF] hover:text-white cursor-pointer"
                  aria-label="Close modal"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCar} className="space-y-4 text-xs">
                {/* Make, Model, Variant */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold block mb-1 text-white">Make (Brand)</label>
                    <input
                      type="text"
                      value={vehicleForm.make}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, make: e.target.value })}
                      placeholder="e.g. Maruti Suzuki, Toyota, Honda"
                      className="w-full h-9 px-2.5 clean-input rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1 text-white">Model Name</label>
                    <input
                      type="text"
                      value={vehicleForm.model}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                      placeholder="e.g. Swift, Fortuner, Brezza"
                      className="w-full h-9 px-2.5 clean-input rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1 text-white">Variant / Trim</label>
                    <input
                      type="text"
                      value={vehicleForm.variant}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, variant: e.target.value })}
                      placeholder="e.g. ZXi+ / 4x4 / ZX"
                      className="w-full h-9 px-2.5 clean-input rounded-lg"
                    />
                  </div>
                </div>

                {/* Plate, Year, Category */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold block mb-1 text-white">RTO Plate Ref (Internal)</label>
                    <input
                      type="text"
                      value={vehicleForm.registrationRef}
                      onChange={(e) =>
                        setVehicleForm({ ...vehicleForm, registrationRef: e.target.value })
                      }
                      placeholder="BR-01-XX-0000"
                      className="w-full h-9 px-2.5 clean-input rounded-lg uppercase font-mono"
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
                      className="w-full h-9 px-2.5 clean-input rounded-lg"
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
                      className="w-full h-9 px-2 border border-[#30363D] bg-[#0D1117] text-white rounded-lg focus-visible:ring-2 focus-visible:ring-[#C63832]"
                    >
                      <option value="HATCHBACK">Hatchback</option>
                      <option value="SEDAN">Sedan</option>
                      <option value="COMPACT_SUV">Compact SUV</option>
                      <option value="SUV">SUV</option>
                      <option value="MUV_MPV">MUV / MPV</option>
                      <option value="PREMIUM_SUV">Premium SUV</option>
                      <option value="ELECTRIC">Electric (EV)</option>
                      <option value="WEDDING_EVENT">Wedding & VIP</option>
                    </select>
                  </div>
                </div>

                {/* District, Locality, Daily Price */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold block mb-1 text-white">Primary District</label>
                    <select
                      value={vehicleForm.districtId}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, districtId: e.target.value })}
                      className="w-full h-9 px-2 border border-[#30363D] bg-[#0D1117] text-white rounded-lg capitalize focus-visible:ring-2 focus-visible:ring-[#C63832]"
                    >
                      {BIHAR_DISTRICTS.map((d) => (
                        <option key={d.slug} value={d.slug}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-bold block mb-1 text-white">Locality / Pickup Hub</label>
                    <input
                      type="text"
                      value={vehicleForm.locality}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, locality: e.target.value })}
                      placeholder="e.g. Airport, Station, Bailey Road"
                      className="w-full h-9 px-2.5 clean-input rounded-lg"
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
                      className="w-full h-9 px-2.5 clean-input rounded-lg"
                      required
                    />
                  </div>
                </div>

                {/* Security Deposit, Km Allowance, Extra Km */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold block mb-1 text-white">Refundable Deposit (₹)</label>
                    <input
                      type="number"
                      value={vehicleForm.securityDeposit}
                      onChange={(e) =>
                        setVehicleForm({ ...vehicleForm, securityDeposit: Number(e.target.value) })
                      }
                      className="w-full h-9 px-2.5 clean-input rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1 text-white">Included km/day</label>
                    <input
                      type="number"
                      value={vehicleForm.includedKmPerDay}
                      onChange={(e) =>
                        setVehicleForm({ ...vehicleForm, includedKmPerDay: Number(e.target.value) })
                      }
                      className="w-full h-9 px-2.5 clean-input rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1 text-white">Extra km charge (₹/km)</label>
                    <input
                      type="number"
                      value={vehicleForm.extraKmCharge}
                      onChange={(e) =>
                        setVehicleForm({ ...vehicleForm, extraKmCharge: Number(e.target.value) })
                      }
                      className="w-full h-9 px-2.5 clean-input rounded-lg"
                      required
                    />
                  </div>
                </div>

                {/* Photo Image URL */}
                <div>
                  <label className="font-bold block mb-1 text-white">Photo Image URL</label>
                  <input
                    type="text"
                    value={vehicleForm.imageUrl}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, imageUrl: e.target.value })}
                    placeholder="/cars/maruti-swift.jpg or image URL"
                    className="w-full h-9 px-2.5 clean-input rounded-lg"
                    required
                  />
                </div>

                {/* Features comma-separated */}
                <div>
                  <label className="font-bold block mb-1 text-white">Features (comma-separated)</label>
                  <input
                    type="text"
                    value={vehicleForm.featuresStr}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, featuresStr: e.target.value })}
                    placeholder="Air Conditioning, Touchscreen Audio, ABS, Dual Airbags"
                    className="w-full h-9 px-2.5 clean-input rounded-lg"
                  />
                </div>

                {/* Visibility and Featured Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-[#0D1117] border border-[#30363D] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Make Live on Website</span>
                      <span className="text-[10px] text-[#9CA3AF]">
                        Toggle off to save in draft mode.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={vehicleForm.isActive}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, isActive: e.target.checked })}
                      className="w-5 h-5 accent-[#C63832] cursor-pointer"
                    />
                  </div>

                  <div className="p-3 rounded-lg bg-[#0D1117] border border-[#30363D] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Featured Car</span>
                      <span className="text-[10px] text-[#9CA3AF]">
                        Display prominently in home grid.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={vehicleForm.isFeatured}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, isFeatured: e.target.checked })}
                      className="w-5 h-5 accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#30363D] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCarModal(false)}
                    className="px-4 py-2 border border-[#30363D] rounded-lg text-[#9CA3AF] hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#C63832] hover:bg-[#E03E36] text-white rounded-lg font-bold transition-colors cursor-pointer"
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
