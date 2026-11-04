import Link from "next/link";
import { Car, MapPin, Phone, ShieldCheck, Clock, Lock } from "lucide-react";
import { BIHAR_DISTRICTS } from "@/data/districts";

export function Footer() {
  const popularDistricts = BIHAR_DISTRICTS.slice(0, 8);

  return (
    <footer className="bg-[#14191D] text-[#E2E5E8] pt-14 pb-10 border-t border-[#242D33]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-[#242D33]">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-[#C63832] flex items-center justify-center text-white shadow-sm">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-2xl font-extrabold tracking-tight text-white">
                Bihar<span className="text-[#C63832]">Drive</span>
              </span>
            </div>
            <p className="text-xs text-[#707980] max-w-sm leading-relaxed">
              Bihar&apos;s verified automotive rental fleet across all 38 districts. Self-drive hatchbacks, executive sedans, 4x4 SUVs, and family MUVs with direct WhatsApp booking.
            </p>
            <div className="space-y-1.5 pt-1 text-xs text-[#707980]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C63832]" />
                <span>Patna Hub: Bailey Road & Patna Airport Terminal (PAT)</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C63832]" />
                <span>Direct WhatsApp: +91 85389 18819 (Instant Dispatch)</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#C63832]">
              Fleet & Booking
            </h4>
            <ul className="space-y-2 text-xs text-[#707980]">
              <li>
                <Link href="/cars" className="hover:text-white transition-colors">
                  All Available Cars
                </Link>
              </li>
              <li>
                <Link href="/districts" className="hover:text-white transition-colors">
                  All 38 Districts & Hubs
                </Link>
              </li>
              <li>
                <Link href="/cars?category=WEDDING_EVENT" className="hover:text-white transition-colors">
                  Wedding & VIP Fleet
                </Link>
              </li>
              <li>
                <Link href="/my-bookings" className="hover:text-white transition-colors">
                  Track Booking by Ref
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Districts */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#C63832]">
              Major Transit Hubs
            </h4>
            <ul className="space-y-2 text-xs text-[#707980]">
              {popularDistricts.slice(0, 5).map((d) => (
                <li key={d.slug}>
                  <Link href={`/cars/${d.slug}`} className="hover:text-white transition-colors">
                    Rent in {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Standards & Rules */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#C63832]">
              Rules & Security
            </h4>
            <ul className="space-y-2 text-xs text-[#707980]">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C63832]" />
                <span>250 km/day Included</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#C63832]" />
                <span>Fast WhatsApp Dispatch</span>
              </li>
              <li>
                <Link href="/#rules" className="hover:text-white transition-colors text-[#C63832] font-semibold">
                  नियम एवं आवश्यक दस्तावेज़
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Rental
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1 text-[11px] text-[#707980] hover:text-[#C63832] transition-colors"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin Fleet Console</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-[#707980]">
          <p>© 2026 BiharDrive • AbhigoCar. All Rights Reserved.</p>
          <p>Direct WhatsApp Bookings: +91 85389 18819</p>
        </div>
      </div>
    </footer>
  );
}
