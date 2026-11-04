"use client";

import { useState } from "react";
import Link from "next/link";
import { Vehicle, AvailabilityBlock } from "@/types";
import {
  Users,
  Fuel,
  Gauge,
  Briefcase,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  MessageCircle,
  Check,
} from "lucide-react";

export function CarDetailClient({
  vehicle,
}: {
  vehicle: Vehicle;
  availabilityBlocks?: AvailabilityBlock[];
}) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rentalMode, setRentalMode] = useState<"SELF_DRIVE" | "CHAUFFEUR_DRIVEN">(
    vehicle.rentalMode === "CHAUFFEUR_DRIVEN" ? "CHAUFFEUR_DRIVEN" : "SELF_DRIVE"
  );
  const [pickupLocation, setPickupLocation] = useState(vehicle.pickupAddress);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<any | null>(null);
  const [whatsAppUrl, setWhatsAppUrl] = useState<string | null>(null);

  const coverImage = vehicle.images.find((img) => img.isCover) || vehicle.images[0];
  const imageUrl = coverImage?.url || "/cars/maruti-swift.jpg";

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!startDate || !endDate) {
      setErrorMsg("Please select your travel pickup and return dates.");
      return;
    }

    if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
      setErrorMsg("Return date cannot be earlier than pickup date.");
      return;
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg("Please provide your Full Name and WhatsApp phone number.");
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
          customerEmail: `${customerPhone.replace(/[^0-9]/g, "")}@whatsapp.abhicargo.com`,
          customerPhone: customerPhone.trim(),
          customerCity: vehicle.districtId,
          startDate,
          endDate,
          pickupTime: "09:00 AM",
          returnTime: "08:00 PM",
          rentalModeSelected: rentalMode,
          pickupLocation: pickupLocation || vehicle.pickupAddress,
        }),
      });

      const data = await res.json();
      const bookingRef = data.booking?.bookingRef || `AC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const totalDays = startDate && endDate
        ? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)))
        : 1;

      const modeLabel = rentalMode === "SELF_DRIVE" ? "Self-Drive" : "With Chauffeur";

      const message = `🚗 *New Car Enquiry - abhicargo*
• *Car:* ${vehicle.make} ${vehicle.model} (${vehicle.variant})
• *Enquiry Ref:* ${bookingRef}
• *Rental Dates:* ${startDate} to ${endDate} (${totalDays} Day${totalDays > 1 ? "s" : ""})
• *Drive Mode:* ${modeLabel}
• *Pickup Hub:* ${pickupLocation}
• *Customer Name:* ${customerName.trim()}
• *WhatsApp Number:* ${customerPhone.trim()}

Hello abhicargo team, I want to enquire about availability for this car. Please share the details on WhatsApp.`;

      const targetWhatsApp = `https://wa.me/918538918819?text=${encodeURIComponent(message)}`;
      setWhatsAppUrl(targetWhatsApp);
      setBookingResult(data.booking || { bookingRef });

      window.open(targetWhatsApp, "_blank");
    } catch {
      const modeLabel = rentalMode === "SELF_DRIVE" ? "Self-Drive" : "With Chauffeur";
      const message = `🚗 *New Car Enquiry - abhicargo*
• *Car:* ${vehicle.make} ${vehicle.model} (${vehicle.variant})
• *Rental Dates:* ${startDate} to ${endDate}
• *Drive Mode:* ${modeLabel}
• *Customer Name:* ${customerName.trim()}
• *WhatsApp Number:* ${customerPhone.trim()}

Hello abhicargo team, I want to enquire about this car.`;
      const targetWhatsApp = `https://wa.me/918538918819?text=${encodeURIComponent(message)}`;
      setWhatsAppUrl(targetWhatsApp);
      setBookingResult({ bookingRef: `AC-${Math.floor(1000 + Math.random() * 9000)}` });
      window.open(targetWhatsApp, "_blank");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-[#F1F4F7]">
      {/* Left Column: Automotive Photography & Specs */}
      <div className="lg:col-span-7 xl:col-span-7 space-y-6">
        {/* Bold Automotive Photography Frame */}
        <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          <div className="relative aspect-[16/10] w-full bg-[#0D1115] overflow-hidden">
            <img
              src={imageUrl}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white rounded-full border border-white/10">
                {vehicle.category.replace(/_/g, " ")}
              </span>
              <span className="px-3 py-1 text-xs font-bold bg-[#C63832] text-white rounded-full border border-red-400/30">
                Model Year {vehicle.year}
              </span>
            </div>
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10">
              <MapPin className="w-3.5 h-3.5 text-[#E03E36]" />
              <span className="capitalize">{vehicle.locality}, {vehicle.districtId}</span>
            </div>
          </div>
        </div>

        {/* Vehicle Header & Specs Card */}
        <div className="glass-panel rounded-2xl p-6 sm:p-7 space-y-6 shadow-xl border border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-[#FF6B64] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#E03E36]" />
                Commercial Yellow-Plate Verified Car
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              {vehicle.make} {vehicle.model}
            </h1>
            <p className="text-sm text-[#8F9CA8] font-medium mt-1">
              {vehicle.variant} • Stationed in {vehicle.locality}, {vehicle.districtId.toUpperCase()}
            </p>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-white/[0.08] text-xs">
            <div className="flex items-center gap-2.5 p-3 rounded-xl glass-card">
              <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#E03E36]">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[#8F9CA8] block text-[10px] uppercase font-bold">Capacity</span>
                <span className="font-bold text-white">{vehicle.seats} Seats</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl glass-card">
              <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#E03E36]">
                <Gauge className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[#8F9CA8] block text-[10px] uppercase font-bold">Gearbox</span>
                <span className="font-bold text-white capitalize">
                  {vehicle.transmission.toLowerCase()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl glass-card">
              <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#E03E36]">
                <Fuel className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[#8F9CA8] block text-[10px] uppercase font-bold">Fuel</span>
                <span className="font-bold text-white capitalize">
                  {vehicle.fuelType.toLowerCase()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl glass-card">
              <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#E03E36]">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[#8F9CA8] block text-[10px] uppercase font-bold">Luggage</span>
                <span className="font-bold text-white">{vehicle.luggageCapacity} Bags</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h3 className="font-display text-base font-bold text-white">
              Vehicle Overview
            </h3>
            <p className="text-xs sm:text-sm text-[#8F9CA8] leading-relaxed">
              {vehicle.description}
            </p>
          </div>

          {/* Amenities */}
          <div className="space-y-2.5 pt-1">
            <h3 className="font-display text-sm font-bold text-white">
              Key Features & Equipment
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {vehicle.features.map((feat) => (
                <div key={feat} className="flex items-center gap-2 glass-card p-2.5 rounded-xl text-[#F1F4F7]">
                  <Check className="w-3.5 h-3.5 text-[#E03E36] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pickup Point */}
          <div className="p-4 rounded-xl glass-card space-y-1 text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#E03E36]" />
              Pickup Hub in {vehicle.locality}
            </span>
            <p className="text-[#8F9CA8]">{vehicle.pickupAddress}</p>
          </div>
        </div>

        {/* abhicargo Hindi Booking Rules Card */}
        <div className="glass-panel rounded-2xl p-6 sm:p-7 space-y-5 shadow-xl border border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill text-[#FF6B64] text-xs font-bold mb-2">
              <span>abhicargo • नियम एवं आवश्यक शर्तें</span>
            </div>
            <h3 className="font-display text-xl font-bold text-white">
              बुकिंग के लिए आवश्यक दस्तावेज़ और नियम
            </h3>
            <p className="text-xs text-[#8F9CA8] mt-0.5">
              अभि कार्गो (abhicargo) - गाड़ी लेने से पहले ध्यानपूर्वक पढ़ लें
            </p>
          </div>

          {/* Required Docs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl glass-card space-y-1">
              <span className="font-bold text-white block">1. ओरिजिनल DL</span>
              <span className="text-[#8F9CA8] text-[11px] block">(उम्र 21 वर्ष से अधिक होनी चाहिए)</span>
            </div>
            <div className="p-3.5 rounded-xl glass-card space-y-1">
              <span className="font-bold text-white block">2. आधार कार्ड</span>
              <span className="text-[#8F9CA8] text-[11px] block">(लोकल एड्रेस प्रूफ के साथ)</span>
            </div>
            <div className="p-3.5 rounded-xl glass-card space-y-1">
              <span className="font-bold text-white block">3. सिक्योरिटी डिपॉजिट</span>
              <span className="text-[#8F9CA8] text-[11px] block">(गाड़ी वापसी पर तुरंत रिफंड)</span>
            </div>
          </div>

          {/* Note */}
          <div className="p-3.5 rounded-xl bg-[#0E1216] border-l-4 border-l-[#C63832] border border-white/10 text-xs text-[#F1F4F7]">
            <strong className="text-[#FF6B64]">नोट: </strong>
            गाड़ी केवल वही व्यक्ति चला सकता है जिसके नाम पर बुकिंग और लाइसेंस है।
          </div>

          {/* Fines & Rules */}
          <div className="space-y-3 pt-2 border-t border-white/[0.08] text-xs">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#FF6B64]">
              महत्वपूर्ण शर्तें एवं जुर्माना (Late Return & Damage Rules)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl glass-card space-y-1">
                <span className="font-bold text-white block">Late Return Policy:</span>
                <p className="text-[#8F9CA8] text-[11px] leading-relaxed">
                  3 घंटे से ज्यादा लेट: <strong className="text-[#FF6B64]">आधे दिन का किराया</strong><br />
                  12 घंटे से ज्यादा लेट: <strong className="text-[#FF6B64]">पूरे दिन का किराया</strong>
                </p>
              </div>

              <div className="p-3.5 rounded-xl glass-card space-y-1">
                <span className="font-bold text-[#FF6B64] block">Over Speeding Fine:</span>
                <p className="text-[#8F9CA8] text-[11px] leading-relaxed">
                  Speed Limit 110 km/h। 110 से ऊपर चलाने पर <strong className="text-[#FF6B64]">₹2000/- जुर्माना</strong> लगेगा।
                </p>
              </div>

              <div className="p-3.5 rounded-xl glass-card space-y-1">
                <span className="font-bold text-white block">Body Damage / Dent:</span>
                <p className="text-[#8F9CA8] text-[11px] leading-relaxed">
                  स्क्रैच, डेंट या बॉडी डैमेज का पूरा रिपेयर खर्च (Repairing Cost) कस्टमर को देना होगा।
                </p>
              </div>

              <div className="p-3.5 rounded-xl glass-card space-y-1">
                <span className="font-bold text-white block">Clutch & Tyre Damage:</span>
                <p className="text-[#8F9CA8] text-[11px] leading-relaxed">
                  क्लच प्लेट जलने या टायर फटने की स्थिति में पूरा खर्च कस्टमर को वहन करना होगा।
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Direct WhatsApp Enquiry Form */}
      <div className="lg:col-span-5 xl:col-span-5 sticky top-24">
        <div className="glass-panel rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5 border border-white/10 relative overflow-hidden">
          {/* Header */}
          <div className="pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E03E36] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B64]">
                Direct WhatsApp Booking
              </span>
            </div>
            <h2 className="text-xl font-bold font-display text-white">
              Enquire for {vehicle.make} {vehicle.model}
            </h2>
            <p className="text-xs text-[#8F9CA8] mt-1">
              Connect directly with dispatch on WhatsApp: <strong className="text-white">+91 85389 18819</strong>
            </p>
          </div>

          {/* After Submission Card */}
          {bookingResult && whatsAppUrl ? (
            <div className="space-y-4 py-2">
              <div className="p-4 rounded-xl glass-card border border-white/10 text-[#F1F4F7] space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-[#FF6B64]">
                  <CheckCircle2 className="w-5 h-5 text-[#E03E36]" />
                  Enquiry Prepared Successfully
                </div>
                <p className="text-xs text-[#8F9CA8] leading-relaxed">
                  Reference:{" "}
                  <strong className="font-mono text-sm block mt-0.5 text-white">
                    {bookingResult.bookingRef}
                  </strong>
                </p>
                <p className="text-xs text-[#8F9CA8]">
                  WhatsApp was opened to <strong className="text-white">+91 85389 18819</strong> with your pre-filled inquiry.
                </p>
              </div>

              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#C63832] to-[#B02E28] hover:from-[#E03E36] hover:to-[#C63832] text-white text-xs font-bold shadow-lg transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Open WhatsApp Chat (+91 85389 18819)</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setBookingResult(null);
                  setWhatsAppUrl(null);
                }}
                className="w-full text-center py-2 text-xs text-[#8F9CA8] hover:text-white transition-colors cursor-pointer"
              >
                Edit Enquiry Details
              </button>
            </div>
          ) : (
            /* Direct Enquiry Form (NO DL NUMBER) */
            <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 rounded-md bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Mode Toggle */}
              {vehicle.rentalMode === "BOTH" && (
                <div className="space-y-1.5">
                  <label className="font-bold uppercase tracking-wider text-[#8F9CA8] block text-[11px]">
                    Drive Preference
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRentalMode("SELF_DRIVE")}
                      className={`py-2.5 rounded-xl font-bold text-xs transition-colors ${
                        rentalMode === "SELF_DRIVE"
                          ? "bg-[#C63832] text-white shadow-md border border-red-400/30"
                          : "glass-card text-[#8F9CA8] hover:text-white"
                      }`}
                    >
                      Self-Drive
                    </button>
                    <button
                      type="button"
                      onClick={() => setRentalMode("CHAUFFEUR_DRIVEN")}
                      className={`py-2.5 rounded-xl font-bold text-xs transition-colors ${
                        rentalMode === "CHAUFFEUR_DRIVEN"
                          ? "bg-[#C63832] text-white shadow-md border border-red-400/30"
                          : "glass-card text-[#8F9CA8] hover:text-white"
                      }`}
                    >
                      With Chauffeur
                    </button>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[#8F9CA8] block text-[11px]">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-11 px-3 glass-input rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[#8F9CA8] block text-[11px]">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-11 px-3 glass-input rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Customer Inputs */}
              <div className="space-y-3 pt-2 border-t border-white/[0.08]">
                <div className="space-y-1">
                  <label className="font-bold text-[#8F9CA8] block">Your Full Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rahul Kumar"
                    className="w-full h-11 px-3 glass-input rounded-xl placeholder-[#5A6672]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#8F9CA8] block">WhatsApp Number</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 98350 12345"
                    className="w-full h-11 px-3 glass-input rounded-xl placeholder-[#5A6672]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#8F9CA8] block">
                    Pickup Location / Station
                  </label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="e.g. Patna Airport / Muzaffarpur Station"
                    className="w-full h-11 px-3 glass-input rounded-xl placeholder-[#5A6672]"
                  />
                </div>
              </div>

              {/* Enquiry Summary Card */}
              <div className="p-3.5 rounded-xl glass-card space-y-2 text-xs">
                <div className="flex justify-between text-[#8F9CA8]">
                  <span>Car Selected</span>
                  <span className="font-bold text-white">{vehicle.make} {vehicle.model}</span>
                </div>

                <div className="flex justify-between text-[#8F9CA8]">
                  <span>Driving Mode</span>
                  <span className="font-medium text-white">
                    {rentalMode === "SELF_DRIVE" ? "Self-Drive" : "With Chauffeur"}
                  </span>
                </div>

                <div className="flex justify-between text-[#8F9CA8]">
                  <span>District Hub</span>
                  <span className="font-medium text-white capitalize">
                    {vehicle.locality}, {vehicle.districtId}
                  </span>
                </div>

                <div className="pt-2 border-t border-white/[0.08] flex justify-between text-xs text-[#8F9CA8]">
                  <span>Direct Dispatch</span>
                  <span className="font-bold text-[#FF6B64]">+91 85389 18819</span>
                </div>
              </div>

              {/* Submit to WhatsApp Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#C63832] via-[#D83832] to-[#B02E28] hover:from-[#E03E36] hover:to-[#C63832] text-white text-xs font-bold transition-all shadow-xl shadow-red-950/40 border border-red-400/30 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>
                  {submitting ? "Redirecting to WhatsApp..." : "Send Enquiry to WhatsApp (+91 85389 18819)"}
                </span>
              </button>

              <p className="text-[11px] text-center text-[#8F9CA8] leading-relaxed">
                Connects directly to <strong className="text-white">+91 85389 18819</strong> on WhatsApp.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
