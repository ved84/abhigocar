export type VehicleCategory =
  | "HATCHBACK"
  | "SEDAN"
  | "COMPACT_SUV"
  | "SUV"
  | "PREMIUM_SUV"
  | "MUV_MPV"
  | "LUXURY"
  | "ELECTRIC"
  | "SEVEN_SEATER"
  | "WEDDING_EVENT";

export type FuelType = "PETROL" | "DIESEL" | "CNG" | "ELECTRIC";

export type Transmission = "MANUAL" | "AUTOMATIC";

export type RentalMode = "SELF_DRIVE" | "CHAUFFEUR_DRIVEN" | "BOTH";

export type VerificationStatus = "VERIFIED" | "PENDING" | "REJECTED";

export type BookingStatus =
  | "PENDING_APPROVAL"
  | "CONFIRMED"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED";

export type PaymentStatus = "UNPAID" | "ADVANCE_PAID" | "FULLY_PAID" | "REFUNDED";

export interface District {
  id: string;
  name: string;
  slug: string;
  aliases: string[];
  popularHubs: string[];
  isPopular: boolean;
  description: string;
}

export interface VehicleImage {
  id: string;
  vehicleId: string;
  url: string;
  altText?: string;
  isCover: boolean;
  sortOrder: number;
}

export interface AvailabilityBlock {
  id: string;
  vehicleId: string;
  startDate: string; // ISO date string YYYY-MM-DD
  endDate: string;
  reason: "MAINTENANCE" | "RESERVED" | "OWNER_HOLD";
  notes?: string;
}

export interface Vehicle {
  id: string;
  slug: string;
  registrationRef: string; // Private
  make: string;
  model: string;
  variant: string;
  year: number;
  category: VehicleCategory;
  fuelType: FuelType;
  transmission: Transmission;
  seats: number;
  luggageCapacity: number;
  rentalMode: RentalMode;
  districtId: string;
  locality: string;
  pickupAddress: string;
  dailyPrice: number; // INR
  securityDeposit: number;
  includedKmPerDay: number;
  extraKmCharge: number;
  driverChargePerDay: number;
  isActive: boolean;
  isFeatured: boolean;
  verificationStatus: VerificationStatus;
  isSampleListing: boolean; // Must be true for demo vehicles to prevent misleading users
  description: string;
  termsAndConditions?: string;
  cancellationPolicy?: string;
  images: VehicleImage[];
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  bookingRef: string; // e.g. BD-2026-0814
  vehicleId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCity?: string;
  drivingLicenseNo?: string;
  idDocumentRef?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;
  pickupTime: string;
  returnTime: string;
  totalDays: number;
  rentalModeSelected: "SELF_DRIVE" | "CHAUFFEUR_DRIVEN";
  pickupLocation: string;
  baseDailyRate: number;
  baseAmount: number;
  driverCharges: number;
  securityDeposit: number;
  taxesAmount: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentNotes?: string;
  adminNotes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  district: string;
  subject: string;
  message: string;
  status: "NEW" | "CONTACTED" | "RESOLVED";
  createdAt: string;
}
