import { Vehicle, Booking, AvailabilityBlock, CustomerInquiry } from "@/types";
import { INITIAL_VEHICLES } from "@/data/mockVehicles";
import { INITIAL_BOOKINGS, INITIAL_AVAILABILITY_BLOCKS, INITIAL_INQUIRIES } from "@/data/mockBookings";

// In-memory persistent singleton for the Next.js runtime process
class DataStore {
  private vehicles: Vehicle[];
  private bookings: Booking[];
  private availabilityBlocks: AvailabilityBlock[];
  private inquiries: CustomerInquiry[];

  constructor() {
    this.vehicles = [...INITIAL_VEHICLES];
    this.bookings = [...INITIAL_BOOKINGS];
    this.availabilityBlocks = [...INITIAL_AVAILABILITY_BLOCKS];
    this.inquiries = [...INITIAL_INQUIRIES];
  }

  // --- VEHICLES ---
  getVehicles(filters?: {
    districtId?: string;
    category?: string;
    fuelType?: string;
    transmission?: string;
    rentalMode?: string;
    minPrice?: number;
    maxPrice?: number;
    seats?: number;
    search?: string;
    onlyActive?: boolean;
    sort?: "price_asc" | "price_desc" | "newest" | "seats_desc";
    startDate?: string;
    endDate?: string;
  }): Vehicle[] {
    let list = this.vehicles;

    if (filters?.onlyActive ?? true) {
      list = list.filter((v) => v.isActive);
    }

    if (filters?.districtId) {
      const q = filters.districtId.toLowerCase();
      list = list.filter((v) => v.districtId.toLowerCase() === q);
    }

    if (filters?.category && filters.category !== "ALL") {
      list = list.filter((v) => v.category === filters.category);
    }

    if (filters?.fuelType && filters.fuelType !== "ALL") {
      list = list.filter((v) => v.fuelType === filters.fuelType);
    }

    if (filters?.transmission && filters.transmission !== "ALL") {
      list = list.filter((v) => v.transmission === filters.transmission);
    }

    if (filters?.rentalMode && filters.rentalMode !== "ALL") {
      list = list.filter(
        (v) => v.rentalMode === filters.rentalMode || v.rentalMode === "BOTH"
      );
    }

    if (filters?.minPrice !== undefined) {
      list = list.filter((v) => v.dailyPrice >= filters.minPrice!);
    }

    if (filters?.maxPrice !== undefined) {
      list = list.filter((v) => v.dailyPrice <= filters.maxPrice!);
    }

    if (filters?.seats !== undefined && filters.seats > 0) {
      list = list.filter((v) => v.seats >= filters.seats!);
    }

    if (filters?.search) {
      const s = filters.search.toLowerCase().trim();
      list = list.filter(
        (v) =>
          v.make.toLowerCase().includes(s) ||
          v.model.toLowerCase().includes(s) ||
          v.variant.toLowerCase().includes(s) ||
          v.locality.toLowerCase().includes(s) ||
          v.districtId.toLowerCase().includes(s)
      );
    }

    // Availability dates filter
    if (filters?.startDate && filters?.endDate) {
      list = list.filter((v) =>
        this.isVehicleAvailable(v.id, filters.startDate!, filters.endDate!)
      );
    }

    // Sorting
    if (filters?.sort === "price_asc") {
      list = [...list].sort((a, b) => a.dailyPrice - b.dailyPrice);
    } else if (filters?.sort === "price_desc") {
      list = [...list].sort((a, b) => b.dailyPrice - a.dailyPrice);
    } else if (filters?.sort === "seats_desc") {
      list = [...list].sort((a, b) => b.seats - a.seats);
    } else if (filters?.sort === "newest") {
      list = [...list].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return list;
  }

  getVehicleBySlug(slug: string): Vehicle | undefined {
    return this.vehicles.find((v) => v.slug === slug);
  }

  getVehicleById(id: string): Vehicle | undefined {
    return this.vehicles.find((v) => v.id === id);
  }

  addVehicle(vehicleData: Omit<Vehicle, "id" | "createdAt" | "updatedAt">): Vehicle {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: `veh-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.vehicles.unshift(newVehicle);
    return newVehicle;
  }

  updateVehicle(id: string, updates: Partial<Vehicle>): Vehicle | null {
    const idx = this.vehicles.findIndex((v) => v.id === id);
    if (idx === -1) return null;
    this.vehicles[idx] = {
      ...this.vehicles[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.vehicles[idx];
  }

  deleteVehicle(id: string): boolean {
    const initialLen = this.vehicles.length;
    this.vehicles = this.vehicles.filter((v) => v.id !== id);
    return this.vehicles.length < initialLen;
  }

  // --- AVAILABILITY & CONFLICT PREVENTION ---
  isVehicleAvailable(vehicleId: string, startDate: string, endDate: string): boolean {
    const reqStart = new Date(startDate).getTime();
    const reqEnd = new Date(endDate).getTime();

    if (isNaN(reqStart) || isNaN(reqEnd) || reqEnd < reqStart) {
      return false;
    }

    // Check confirmed or pending bookings
    const hasBookingConflict = this.bookings.some((b) => {
      if (b.vehicleId !== vehicleId) return false;
      if (b.status === "CANCELLED" || b.status === "REJECTED") return false;

      const bStart = new Date(b.startDate).getTime();
      const bEnd = new Date(b.endDate).getTime();

      // Overlap condition: startA <= endB and endA >= startB
      return reqStart <= bEnd && reqEnd >= bStart;
    });

    if (hasBookingConflict) return false;

    // Check maintenance or owner blocks
    const hasBlockConflict = this.availabilityBlocks.some((blk) => {
      if (blk.vehicleId !== vehicleId) return false;

      const blkStart = new Date(blk.startDate).getTime();
      const blkEnd = new Date(blk.endDate).getTime();

      return reqStart <= blkEnd && reqEnd >= blkStart;
    });

    return !hasBlockConflict;
  }

  getVehicleAvailabilityBlocks(vehicleId: string): AvailabilityBlock[] {
    return this.availabilityBlocks.filter((b) => b.vehicleId === vehicleId);
  }

  getAllAvailabilityBlocks(): AvailabilityBlock[] {
    return [...this.availabilityBlocks];
  }

  addAvailabilityBlock(
    block: Omit<AvailabilityBlock, "id">
  ): AvailabilityBlock {
    const newBlock: AvailabilityBlock = {
      ...block,
      id: `blk-${Date.now()}`,
    };
    this.availabilityBlocks.push(newBlock);
    return newBlock;
  }

  removeAvailabilityBlock(id: string): boolean {
    const initialLen = this.availabilityBlocks.length;
    this.availabilityBlocks = this.availabilityBlocks.filter((b) => b.id !== id);
    return this.availabilityBlocks.length < initialLen;
  }

  // --- BOOKINGS ---
  getBookings(filter?: {
    status?: string;
    vehicleId?: string;
    customerEmail?: string;
  }): Booking[] {
    let list = this.bookings;
    if (filter?.status && filter.status !== "ALL") {
      list = list.filter((b) => b.status === filter.status);
    }
    if (filter?.vehicleId) {
      list = list.filter((b) => b.vehicleId === filter.vehicleId);
    }
    if (filter?.customerEmail) {
      list = list.filter(
        (b) =>
          b.customerEmail.toLowerCase() === filter.customerEmail!.toLowerCase()
      );
    }
    return [...list].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getBookingByRef(ref: string): Booking | undefined {
    return this.bookings.find(
      (b) => b.bookingRef.toUpperCase() === ref.trim().toUpperCase()
    );
  }

  createBooking(
    bookingData: Omit<
      Booking,
      "id" | "bookingRef" | "status" | "paymentStatus" | "createdAt" | "updatedAt"
    >
  ): { success: boolean; booking?: Booking; error?: string } {
    // 1. Validate vehicle exists and is active
    const vehicle = this.getVehicleById(bookingData.vehicleId);
    if (!vehicle || !vehicle.isActive) {
      return { success: false, error: "The requested vehicle is currently not available for rent." };
    }

    // 2. Double-booking check
    const isAvailable = this.isVehicleAvailable(
      bookingData.vehicleId,
      bookingData.startDate,
      bookingData.endDate
    );

    if (!isAvailable) {
      return {
        success: false,
        error: "These dates are already reserved or undergoing maintenance for this car. Please pick different dates.",
      };
    }

    // 3. Generate unique BiharDrive reference: BD-YYYY-RANDOM4
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingRef = `BD-${year}-${randomSuffix}`;

    const newBooking: Booking = {
      ...bookingData,
      id: `book-${Date.now()}`,
      bookingRef,
      status: "PENDING_APPROVAL",
      paymentStatus: "UNPAID",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.bookings.unshift(newBooking);
    return { success: true, booking: newBooking };
  }

  updateBookingStatus(
    id: string,
    status: Booking["status"],
    adminNote?: string
  ): Booking | null {
    const booking = this.bookings.find((b) => b.id === id);
    if (!booking) return null;
    booking.status = status;
    if (adminNote) {
      booking.adminNotes = booking.adminNotes
        ? `${booking.adminNotes}\n${adminNote}`
        : adminNote;
    }
    booking.updatedAt = new Date().toISOString();
    return booking;
  }

  updatePaymentStatus(
    id: string,
    paymentStatus: Booking["paymentStatus"],
    paymentNote?: string
  ): Booking | null {
    const booking = this.bookings.find((b) => b.id === id);
    if (!booking) return null;
    booking.paymentStatus = paymentStatus;
    if (paymentNote) {
      booking.paymentNotes = paymentNote;
    }
    booking.updatedAt = new Date().toISOString();
    return booking;
  }

  // --- INQUIRIES ---
  getInquiries(): CustomerInquiry[] {
    return [...this.inquiries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  addInquiry(
    inquiryData: Omit<CustomerInquiry, "id" | "status" | "createdAt">
  ): CustomerInquiry {
    const newInquiry: CustomerInquiry = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      status: "NEW",
      createdAt: new Date().toISOString(),
    };
    this.inquiries.unshift(newInquiry);
    return newInquiry;
  }

  updateInquiryStatus(id: string, status: CustomerInquiry["status"]): boolean {
    const inq = this.inquiries.find((i) => i.id === id);
    if (!inq) return false;
    inq.status = status;
    return true;
  }
}

// Global singleton instance
const globalForStore = globalThis as unknown as { biharDriveStore: DataStore };
export const store = globalForStore.biharDriveStore || new DataStore();
if (process.env.NODE_ENV !== "production") globalForStore.biharDriveStore = store;
