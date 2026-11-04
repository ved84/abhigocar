"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Booking, Vehicle } from "@/types";
import { formatINR } from "@/lib/pricing";
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Clock3,
  XCircle,
  AlertCircle,
  Car,
  Phone,
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
    // Fetch default customer demo bookings if available
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
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 font-semibold text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Confirmed
          </span>
        );
      case "PENDING_APPROVAL":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-950/60 border border-amber-500/50 text-amber-300 font-semibold text-xs">
            <Clock3 className="w-3.5 h-3.5 text-amber-400" /> Awaiting Dispatch
          </span>
        );
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-950/60 border border-blue-500/50 text-blue-300 font-semibold text-xs">
            <Car className="w-3.5 h-3.5 text-blue-400" /> Trip Active
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 text-neutral-300 font-semibold text-xs">
            Completed
          </span>
        );
      case "CANCELLED":
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950/60 border border-rose-500/50 text-rose-300 font-semibold text-xs">
            <XCircle className="w-3.5 h-3.5 text-rose-400" /> {status}
          </span>
        );
    }
  };

  return (
    <div className="py-8 sm:py-12 text-[#EEF0EB]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#387F66]">
            Booking Tracking
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#EEF0EB] mt-1">
            Track Your Rental Status
          </h1>
          <p className="text-xs sm:text-sm text-[#8E9991] mt-1">
            Enter your booking reference code (e.g. BD-2026-1042) to check verification and dispatch details.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-[#181E19] p-5 rounded-xl border border-[#2B352E] shadow-xs">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchBooking(bookingRefInput);
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E9991]" />
              <input
                type="text"
                value={bookingRefInput}
                onChange={(e) => setBookingRefInput(e.target.value)}
                placeholder="Enter booking reference (e.g. BD-2026-1042)"
                className="w-full h-11 pl-9 pr-4 text-xs sm:text-sm bg-[#101411] border border-[#2B352E] rounded-md text-[#EEF0EB] uppercase font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-md bg-[#2D6A54] hover:bg-[#387F66] text-white text-xs font-bold shrink-0"
            >
              {loading ? "Searching..." : "Lookup Booking"}
            </button>
          </form>

          {errorMsg && (
            <div className="mt-3 text-xs text-rose-300 bg-rose-950/40 border border-rose-800 p-3 rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Found Booking Card */}
        {booking && (
          <div className="bg-[#181E19] rounded-xl border border-[#2B352E] p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#2B352E] gap-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#8E9991] block">
                  Booking Reference
                </span>
                <span className="font-mono text-xl font-bold text-[#EEF0EB]">
                  {booking.bookingRef}
                </span>
              </div>
              <div>{getStatusBadge(booking.status)}</div>
            </div>

            {/* Trip Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-[#101411] rounded-lg border border-[#2B352E] space-y-1">
                <span className="text-[#8E9991] block uppercase text-[10px]">Rental Duration</span>
                <div className="font-semibold text-[#EEF0EB] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#387F66]" />
                  <span>
                    {booking.startDate} &rarr; {booking.endDate}
                  </span>
                </div>
                <div className="text-[#8E9991]">{booking.totalDays} Total Days</div>
              </div>

              <div className="p-3.5 bg-[#101411] rounded-lg border border-[#2B352E] space-y-1">
                <span className="text-[#8E9991] block uppercase text-[10px]">Drive Mode</span>
                <div className="font-semibold text-[#EEF0EB] capitalize">
                  {booking.rentalModeSelected.replace(/_/g, " ").toLowerCase()}
                </div>
                <div className="text-[#8E9991]">
                  Pickup: {booking.pickupTime} • Return: {booking.returnTime}
                </div>
              </div>

              <div className="p-3.5 bg-[#101411] rounded-lg border border-[#2B352E] space-y-1">
                <span className="text-[#8E9991] block uppercase text-[10px]">Estimated Total</span>
                <div className="font-semibold text-[#387F66] text-sm">
                  {formatINR(booking.totalAmount)}
                </div>
                <div className="text-[#8E9991]">
                  Deposit: {formatINR(booking.securityDeposit)}
                </div>
              </div>
            </div>

            {/* Handover & Location */}
            <div className="p-4 bg-[#101411] rounded-lg border border-[#2B352E] space-y-1.5 text-xs">
              <span className="font-semibold text-[#EEF0EB] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#387F66]" />
                Designated Pickup Location
              </span>
              <p className="text-[#8E9991]">{booking.pickupLocation}</p>
            </div>

            {/* Customer Details */}
            <div className="border-t border-[#2B352E] pt-4 text-xs space-y-1">
              <span className="font-semibold text-[#EEF0EB] block mb-1">Renter Contact Details</span>
              <div className="text-[#8E9991]">Name: {booking.customerName}</div>
              <div className="text-[#8E9991]">Phone: {booking.customerPhone}</div>
              {booking.drivingLicenseNo && (
                <div className="text-[#8E9991]">
                  Driving License: <span className="font-mono text-[#EEF0EB]">{booking.drivingLicenseNo}</span>
                </div>
              )}
            </div>

            {/* Direct WhatsApp Follow-up Button */}
            <div className="pt-2">
              <a
                href={`https://wa.me/919354035140?text=${encodeURIComponent(`Hi BiharDrive team, checking status on my booking ref: ${booking.bookingRef}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-md bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold"
              >
                <span>Message Dispatch on WhatsApp (+91 93540 35140)</span>
              </a>
            </div>
          </div>
        )}

        {/* Sample Bookings Preview */}
        {!booking && allUserBookings.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#EEF0EB]">
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
                  className="w-full text-left bg-[#181E19] p-4 rounded-xl border border-[#2B352E] hover:border-[#387F66] transition-all flex items-center justify-between"
                >
                  <div>
                    <span className="font-mono text-xs font-bold text-[#387F66]">
                      {b.bookingRef}
                    </span>
                    <span className="text-xs text-[#8E9991] block">
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
        <div className="py-20 text-center text-xs text-[#8E9991]">
          Loading booking status...
        </div>
      }
    >
      <MyBookingsContent />
    </Suspense>
  );
}
