import { Vehicle, RentalMode } from "@/types";

export interface PricingBreakdown {
  totalDays: number;
  baseDailyRate: number;
  baseAmount: number;
  driverDailyRate: number;
  driverCharges: number;
  securityDeposit: number;
  taxesAmount: number; // 5% GST
  totalAmount: number;
}

export function calculateDaysBetween(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 1;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
}

export function calculatePricingBreakdown(
  vehicle: Vehicle,
  startDate: string,
  endDate: string,
  modeSelected: RentalMode | "SELF_DRIVE" | "CHAUFFEUR_DRIVEN"
): PricingBreakdown {
  const totalDays = calculateDaysBetween(startDate, endDate);
  const baseDailyRate = vehicle.dailyPrice;
  const baseAmount = baseDailyRate * totalDays;

  const isChauffeur = modeSelected === "CHAUFFEUR_DRIVEN";
  const driverDailyRate = isChauffeur ? vehicle.driverChargePerDay : 0;
  const driverCharges = driverDailyRate * totalDays;

  const securityDeposit = vehicle.securityDeposit;

  // 5% statutory GST on passenger vehicle hire in India
  const taxableRentalSubtotal = baseAmount + driverCharges;
  const taxesAmount = Math.round(taxableRentalSubtotal * 0.05);

  const totalAmount = baseAmount + driverCharges + securityDeposit + taxesAmount;

  return {
    totalDays,
    baseDailyRate,
    baseAmount,
    driverDailyRate,
    driverCharges,
    securityDeposit,
    taxesAmount,
    totalAmount,
  };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
