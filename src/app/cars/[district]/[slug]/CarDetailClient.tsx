"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Vehicle, AvailabilityBlock } from "@/types";
import { calculatePricingBreakdown, formatINR } from "@/lib/pricing";
import {
  Users,
  Fuel,
  Gauge,
  Briefcase,
  MapPin,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Phone,
  MessageCircle,
} from "lucide-react";

export function CarDetailClient({
  vehicle,
  availabilityBlocks,
}: {
  vehicle: Vehicle;
  availabilityBlocks: AvailabilityBlock[];
}) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Booking Dates - initialized for prerender stability, updated on mount
  const [startDate, setStartDate] = useState("2026-11-10");
  const [endDate, setEndDate] = useState("2026-11-12");

  useEffect(() => {
    const tm = new Date();
    tm.setDate(tm.getDate() + 1);
    const da = new Date();
    da.setDate(da.getDate() + 3);
    setStartDate(tm.toISOString().split("T")[0]);
    setEndDate(da.toISOString().split("T")[0]);
  }, []);

  const [pickupTime, setPickupTime] = useState("09:00 AM");
  const [rentalMode, setRentalMode] = useState<"SELF_DRIVE" | "CHAUFFEUR_DRIVEN">(
    vehicle.rentalMode === "CHAUFFEUR_DRIVEN" ? "CHAUFFEUR_DRIVEN" : "SELF_DRIVE"
  );

  // Customer Form Details
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [drivingLicenseNo, setDrivingLicenseNo] = useState("");
  const [pickupLocation, setPickupLocation] = useState(vehicle.pickupAddress);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<any | null>(null);
  const [whatsAppUrl, setWhatsAppUrl] = useState<string | null>(null);

  // Pricing Calculation
  const pricing = calculatePricingBreakdown(vehicle, startDate, endDate, rentalMode);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!startDate || !endDate) {
      setErrorMsg("Please select pickup and return dates.");
      return;
    }

    if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
      setErrorMsg("Return date cannot be earlier than pickup date.");
      return;
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg("Please provide your Name and WhatsApp phone number.");
      return;
    }

    if (rentalMode === "SELF_DRIVE" && !drivingLicenseNo.trim()) {
      setErrorMsg("Driving License number is required for self-drive verification.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          customerName: customerName.trim(),
          customerEmail: `${customerPhone.replace(/[^0-9]/g, "")}@whatsapp.bihardrive.com`,
          customerPhone: customerPhone.trim(),
          customerCity: vehicle.districtId,
          drivingLicenseNo: rentalMode === "SELF_DRIVE" ? drivingLicenseNo.trim() : undefined,
          startDate,
          endDate,
          pickupTime,
          returnTime: "08:00 PM",
          rentalModeSelected: rentalMode,
          pickupLocation: pickupLocation || vehicle.pickupAddress,
        }),
      });

      const data = await res.json();
      const bookingRef = data.booking?.bookingRef || `BD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      // Construct formatted WhatsApp message
      const modeLabel = rentalMode === "SELF_DRIVE" ? "Self-Drive" : "With Chauffeur";
      const message = `🚗 *New Car Booking Request - BiharDrive*
• *Car:* ${vehicle.make} ${vehicle.model} (${vehicle.variant})
• *Booking Ref:* ${bookingRef}
• *Rental Dates:* ${startDate} to ${endDate} (${pricing.totalDays} Days)
• *Mode:* ${modeLabel}
• *Pickup Location:* ${pickupLocation}
• *Customer Name:* ${customerName.trim()}
• *Phone:* ${customerPhone.trim()}
${drivingLicenseNo ? `• *Driving License:* ${drivingLicenseNo.trim()}` : ""}
• *Estimated Total:* ${formatINR(pricing.totalAmount)} (includes ${formatINR(pricing.securityDeposit)} refundable deposit)

Hello BiharDrive team, I want to book this car. Please confirm availability.`;

      const targetWhatsApp = `https://wa.me/919354035140?text=${encodeURIComponent(message)}`;
      setWhatsAppUrl(targetWhatsApp);
      setBookingResult(data.booking || { bookingRef });

      // Automatically open WhatsApp in a new tab
      window.open(targetWhatsApp, "_blank");
    } catch {
      setErrorMsg("Network error. Please try again or message directly on WhatsApp: +91 93540 35140");
    } finally {
      setSubmitting(false);
    }
  };

  const images = vehicle.images.length > 0 ? vehicle.images : [
    {
      id: "img-fallback",
      vehicleId: vehicle.id,
      url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
      isCover: true,
      sortOrder: 1,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-[#EEF0EB]">
      {/* Left Column: Gallery, Specs, Details */}
      <div className="lg:col-span-7 xl:col-span-8 space-y-6">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-[#2B352E] bg-[#121613]">
            <img
              src={images[activeImageIdx]?.url || images[0].url}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative w-24 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIdx === idx ? "border-[#387F66]" : "border-[#2B352E] opacity-60"
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Vehicle Header & Specs */}
        <div className="bg-[#181E19] rounded-xl border border-[#2B352E] p-6 space-y-6 shadow-xs">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider bg-[#2D6A54] text-white rounded">
                {vehicle.category.replace(/_/g, " ")}
              </span>
              <span className="text-xs text-[#8E9991] bg-[#101411] px-2.5 py-0.5 rounded border border-[#2B352E]">
                Model Year {vehicle.year}
              </span>
              <span className="text-xs text-[#387F66] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Commercial Yellow-Plate Verified
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#EEF0EB]">
              {vehicle.make} {vehicle.model}
            </h1>
            <p className="text-sm text-[#8E9991] font-medium mt-0.5">
              {vehicle.variant} • Stationed in {vehicle.locality}, {vehicle.districtId.toUpperCase()}
            </p>
          </div>

          {/* Quick Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-[#2B352E] text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-[#101411] border border-[#2B352E] flex items-center justify-center text-[#387F66]">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[#8E9991] block text-[10px] uppercase">Seating</span>
                <span className="font-semibold text-[#EEF0EB]">{vehicle.seats} Seats</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-[#101411] border border-[#2B352E] flex items-center justify-center text-[#387F66]">
                <Gauge className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[#8E9991] block text-[10px] uppercase">Gearbox</span>
                <span className="font-semibold text-[#EEF0EB] capitalize">
                  {vehicle.transmission.toLowerCase()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-[#101411] border border-[#2B352E] flex items-center justify-center text-[#387F66]">
                <Fuel className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[#8E9991] block text-[10px] uppercase">Fuel</span>
                <span className="font-semibold text-[#EEF0EB] capitalize">
                  {vehicle.fuelType.toLowerCase()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-[#101411] border border-[#2B352E] flex items-center justify-center text-[#387F66]">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[#8E9991] block text-[10px] uppercase">Luggage</span>
                <span className="font-semibold text-[#EEF0EB]">{vehicle.luggageCapacity} Bags</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h3 className="font-serif text-base font-bold text-[#EEF0EB]">
              Vehicle Overview
            </h3>
            <p className="text-xs sm:text-sm text-[#8E9991] leading-relaxed">
              {vehicle.description}
            </p>
          </div>

          {/* Amenities */}
          <div className="space-y-2.5 pt-1">
            <h3 className="font-serif text-sm font-bold text-[#EEF0EB]">
              In-Car Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#EEF0EB]">
              {vehicle.features.map((feat) => (
                <div key={feat} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#387F66] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pickup Point */}
          <div className="p-3.5 rounded-lg bg-[#101411] border border-[#2B352E] space-y-1 text-xs">
            <span className="font-semibold text-[#EEF0EB] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#387F66]" />
              Pickup Hub in {vehicle.locality}
            </span>
            <p className="text-[#8E9991]">{vehicle.pickupAddress}</p>
          </div>
        </div>
      </div>

      {/* Right Column: Booking Card */}
      <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
        <div className="bg-[#181E19] rounded-xl border border-[#2B352E] p-6 shadow-sm space-y-5">
          {/* Daily Price */}
          <div className="flex items-baseline justify-between pb-4 border-b border-[#2B352E]">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold font-serif text-[#EEF0EB]">
                  {formatINR(vehicle.dailyPrice)}
                </span>
                <span className="text-xs text-[#8E9991]">/ day</span>
              </div>
              <p className="text-[11px] text-[#8E9991] mt-0.5">
                Includes {vehicle.includedKmPerDay} km/day allowance
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-[#162E24] text-[#387F66] font-bold border border-[#2D6A54]/30">
              WhatsApp Booking
            </span>
          </div>

          {/* After Submission Card */}
          {bookingResult && whatsAppUrl ? (
            <div className="space-y-4 py-2">
              <div className="p-4 rounded-lg bg-[#162E24] border border-[#2D6A54] text-[#EEF0EB] space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-sm text-[#387F66]">
                  <CheckCircle2 className="w-5 h-5 text-[#387F66]" />
                  Booking Details Ready
                </div>
                <p className="text-xs text-[#8E9991] leading-relaxed">
                  Reference:{" "}
                  <strong className="font-mono text-sm block mt-0.5 text-[#EEF0EB]">
                    {bookingResult.bookingRef}
                  </strong>
                </p>
                <p className="text-xs text-[#8E9991]">
                  We opened WhatsApp directly to <strong className="text-[#EEF0EB]">+91 93540 35140</strong> with your pre-filled car reservation.
                </p>
              </div>

              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-md bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                <span>Open WhatsApp Chat (+91 93540 35140)</span>
              </a>

              <Link
                href={`/my-bookings?ref=${bookingResult.bookingRef}`}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-[#387F66] hover:underline"
              >
                <span>View Saved Booking Reference</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 rounded-md bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Mode Toggle */}
              {vehicle.rentalMode === "BOTH" && (
                <div className="space-y-1.5">
                  <label className="font-semibold uppercase tracking-wider text-[#8E9991] block text-[11px]">
                    Drive Option
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRentalMode("SELF_DRIVE")}
                      className={`py-2 rounded-md border font-semibold text-xs transition-colors ${
                        rentalMode === "SELF_DRIVE"
                          ? "bg-[#2D6A54] text-white border-[#2D6A54]"
                          : "bg-[#101411] text-[#EEF0EB] border-[#2B352E]"
                      }`}
                    >
                      Self-Drive
                    </button>
                    <button
                      type="button"
                      onClick={() => setRentalMode("CHAUFFEUR_DRIVEN")}
                      className={`py-2 rounded-md border font-semibold text-xs transition-colors ${
                        rentalMode === "CHAUFFEUR_DRIVEN"
                          ? "bg-[#2D6A54] text-white border-[#2D6A54]"
                          : "bg-[#101411] text-[#EEF0EB] border-[#2B352E]"
                      }`}
                    >
                      With Driver (+₹{vehicle.driverChargePerDay}/d)
                    </button>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="font-semibold uppercase tracking-wider text-[#8E9991] block text-[11px]">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-9 px-2 text-xs bg-[#101411] border border-[#2B352E] rounded-md text-[#EEF0EB]"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold uppercase tracking-wider text-[#8E9991] block text-[11px]">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-9 px-2 text-xs bg-[#101411] border border-[#2B352E] rounded-md text-[#EEF0EB]"
                    required
                  />
                </div>
              </div>

              {/* Customer Inputs */}
              <div className="space-y-2.5 pt-2 border-t border-[#2B352E]">
                <div className="space-y-1">
                  <label className="font-semibold text-[#EEF0EB] block">Your Full Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Alok Kumar"
                    className="w-full h-9 px-2.5 bg-[#101411] border border-[#2B352E] rounded-md text-[#EEF0EB]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#EEF0EB] block">WhatsApp Number</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 98350 12345"
                    className="w-full h-9 px-2.5 bg-[#101411] border border-[#2B352E] rounded-md text-[#EEF0EB]"
                    required
                  />
                </div>

                {rentalMode === "SELF_DRIVE" && (
                  <div className="space-y-1">
                    <label className="font-semibold text-[#EEF0EB] block">
                      Indian Driving License Number
                    </label>
                    <input
                      type="text"
                      value={drivingLicenseNo}
                      onChange={(e) => setDrivingLicenseNo(e.target.value)}
                      placeholder="e.g. BR-0120200012345"
                      className="w-full h-9 px-2.5 bg-[#101411] border border-[#2B352E] rounded-md uppercase text-[#EEF0EB]"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Pricing Breakdown */}
              <div className="p-3.5 rounded-lg bg-[#101411] border border-[#2B352E] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#8E9991]">
                  <span>Rate ({formatINR(pricing.baseDailyRate)} × {pricing.totalDays} days)</span>
                  <span className="font-medium text-[#EEF0EB]">{formatINR(pricing.baseAmount)}</span>
                </div>

                {rentalMode === "CHAUFFEUR_DRIVEN" && (
                  <div className="flex justify-between text-[#8E9991]">
                    <span>Driver ({formatINR(vehicle.driverChargePerDay)} × {pricing.totalDays} days)</span>
                    <span className="font-medium text-[#EEF0EB]">{formatINR(pricing.driverCharges)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#8E9991]">
                  <span>GST (5%)</span>
                  <span className="font-medium text-[#EEF0EB]">{formatINR(pricing.taxesAmount)}</span>
                </div>

                <div className="flex justify-between text-[#8E9991]">
                  <span>Refundable Security Deposit</span>
                  <span className="font-medium text-[#EEF0EB]">{formatINR(pricing.securityDeposit)}</span>
                </div>

                <div className="pt-2 border-t border-[#2B352E] flex justify-between text-sm font-bold text-[#EEF0EB]">
                  <span>Total Amount</span>
                  <span className="text-[#387F66]">{formatINR(pricing.totalAmount)}</span>
                </div>
              </div>

              {/* Submit to WhatsApp Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-md bg-[#2D6A54] hover:bg-[#387F66] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <MessageCircle className="w-4 h-4" />
                <span>
                  {submitting ? "Preparing WhatsApp..." : "Send Booking to WhatsApp (9354035140)"}
                </span>
              </button>

              <p className="text-[10px] text-center text-[#8E9991] leading-relaxed">
                Direct WhatsApp routing to <strong className="text-[#EEF0EB]">+91 93540 35140</strong>. No account or password required.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
