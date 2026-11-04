"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Booking } from "@/types";
import { formatINR } from "@/lib/pricing";
import {
  Search,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock3,
  XCircle,
  AlertCircle,
  Car,
} from "lucide-react";

function MyBookingsContent() {
  const searchParams = useSearchParams();
  const queryRef = searchParams.get("ref") || "";

  const [bookingRefInput, setBookingRefInput] = useState(queryRef);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [allUserBookings, setAllUserBookings] = useState<Booking[]>([]);

  const fetchBooking = async (ref: string) => {
    if (!ref.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(ref.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "No booking record found for this reference.");
        setBooking(null);
      } else {
        setBooking(data.booking);
      }
    } catch {
      setErrorMsg("Failed to query booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryRef) {
      fetchBooking(queryRef);
    }
    fetch("/api/bookings?email=alok.sinha@example.com")
      .then((res) => res.json())
      .then((data) => {
        if (data?.bookings) setAllUserBookings(data.bookings);
      })
      .catch(() => {});
  }, [queryRef]);

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 font-bold text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Confirmed
          </span>
        );
      case "PENDING_APPROVAL":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-950/60 border border-amber-500/50 text-amber-300 font-bold text-xs">
            <Clock3 className="w-3.5 h-3.5 text-amber-400" /> Awaiting Dispatch
          </span>
        );
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-950/60 border border-blue-500/50 text-blue-300 font-bold text-xs">
            <Car className="w-3.5 h-3.5 text-blue-400" /> Trip Active
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 text-neutral-300 font-bold text-xs">
            Completed
          </span>
        );
      case "CANCELLED":
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950/60 border border-rose-500/50 text-rose-300 font-bold text-xs">
            <XCircle className="w-3.5 h-3.5 text-rose-400" /> {status}
          </span>
        );
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-[#0E1216] text-[#F1F4F7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B64] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E03E36]" />
            Booking Tracking
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white mt-1">
            Track Your Rental Status
          </h1>
          <p className="text-xs sm:text-sm text-[#8F9CA8] mt-1">
            Enter your booking reference code (e.g. BD-2026-1042) to check verification and dispatch details.
          </p>
        </div>

        {/* Search Bar with Glass Panel */}
        <div className="glass-panel p-6 rounded-2xl shadow-xl border border-white/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchBooking(bookingRefInput);
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-grow">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F9CA8]" />
              <input
                type="text"
                value={bookingRefInput}
                onChange={(e) => setBookingRefInput(e.target.value)}
                placeholder="Enter booking reference (e.g. BD-2026-1042)"
                className="w-full h-11 pl-10 pr-4 text-xs sm:text-sm glass-input rounded-xl uppercase font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C63832] to-[#B02E28] hover:from-[#E03E36] hover:to-[#C63832] text-white text-xs font-bold shrink-0 transition-all shadow-md shadow-red-950/40 border border-red-400/20 cursor-pointer"
            >
              {loading ? "Searching..." : "Lookup Booking"}
            </button>
          </form>

          {errorMsg && (
            <div className="mt-3 text-xs text-rose-300 bg-rose-950/40 border border-rose-800 p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Found Booking Card */}
        {booking && (
          <div className="glass-panel rounded-2xl p-6 sm:p-7 shadow-xl space-y-6 border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.08] gap-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#8F9CA8] block">
                  Booking Reference
                </span>
                <span className="font-mono text-xl font-bold text-white">
                  {booking.bookingRef}
                </span>
              </div>
              <div>{getStatusBadge(booking.status)}</div>
            </div>

            {/* Trip Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 glass-card rounded-xl space-y-1">
                <span className="text-[#8F9CA8] block uppercase text-[10px] font-bold">Rental Duration</span>
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#E03E36]" />
                  <span>
                    {booking.startDate} &rarr; {booking.endDate}
                  </span>
                </div>
                <div className="text-[#8F9CA8]">{booking.totalDays} Total Days</div>
              </div>

              <div className="p-4 glass-card rounded-xl space-y-1">
                <span className="text-[#8F9CA8] block uppercase text-[10px] font-bold">Drive Mode</span>
                <div className="font-bold text-white capitalize">
                  {booking.rentalModeSelected.replace(/_/g, " ").toLowerCase()}
                </div>
                <div className="text-[#8F9CA8]">
                  Pickup: {booking.pickupTime} • Return: {booking.returnTime}
                </div>
              </div>

              <div className="p-4 glass-card rounded-xl space-y-1">
                <span className="text-[#8F9CA8] block uppercase text-[10px] font-bold">Estimated Total</span>
                <div className="font-bold text-[#FF6B64] text-sm">
                  {formatINR(booking.totalAmount)}
                </div>
                <div className="text-[#8F9CA8]">
                  Deposit: {formatINR(booking.securityDeposit)}
                </div>
              </div>
            </div>

            {/* Handover & Location */}
            <div className="p-4 glass-card rounded-xl space-y-1.5 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#E03E36]" />
                Designated Pickup Location
              </span>
              <p className="text-[#8F9CA8]">{booking.pickupLocation}</p>
            </div>

            {/* Customer Details */}
            <div className="border-t border-white/[0.08] pt-4 text-xs space-y-1">
              <span className="font-bold text-white block mb-1">Renter Contact Details</span>
              <div className="text-[#8F9CA8]">Name: <span className="font-semibold text-white">{booking.customerName}</span></div>
              <div className="text-[#8F9CA8]">Phone: <span className="font-semibold text-white">{booking.customerPhone}</span></div>
              {booking.drivingLicenseNo && (
                <div className="text-[#8F9CA8]">
                  Driving License: <span className="font-mono text-white">{booking.drivingLicenseNo}</span>
                </div>
              )}
            </div>

            {/* Direct WhatsApp Follow-up Button */}
            <div className="pt-2">
              <a
                href={`https://wa.me/918538918819?text=${encodeURIComponent(`Hi abhigocar team, checking status on my booking ref: ${booking.bookingRef}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold transition-colors shadow-md"
              >
                <span>Message Dispatch on WhatsApp (+91 85389 18819)</span>
              </a>
            </div>
          </div>
        )}

        {/* Sample Bookings Preview */}
        {!booking && allUserBookings.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold text-white">
              Recent Reservations
            </h3>
            <div className="space-y-3">
              {allUserBookings.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setBookingRefInput(b.bookingRef);
                    setBooking(b);
                  }}
                  className="w-full text-left glass-card p-4 rounded-xl hover:border-[#C63832]/60 transition-all flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <span className="font-mono text-xs font-bold text-[#FF6B64]">
                      {b.bookingRef}
                    </span>
                    <span className="text-xs text-[#8F9CA8] block mt-0.5">
                      {b.customerName} • {b.startDate} to {b.endDate}
                    </span>
                  </div>
                  <div>{getStatusBadge(b.status)}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-xs text-[#8F9CA8]">
          Loading booking status...
        </div>
      }
    >
      <MyBookingsContent />
    </Suspense>
  );
}
