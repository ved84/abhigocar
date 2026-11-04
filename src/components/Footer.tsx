import Link from "next/link";
import { Car, MapPin, Phone, Mail, ShieldCheck, Clock, FileText, Lock } from "lucide-react";
import { BIHAR_DISTRICTS } from "@/data/districts";

export function Footer() {
  const popularDistricts = BIHAR_DISTRICTS.slice(0, 10);

  return (
    <footer className="bg-[#1C221E] text-[#ECE8DF] pt-14 pb-10 border-t border-[#2D3630]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-[#2D3630]">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-[#20493A] flex items-center justify-center text-white">
                <Car className="w-5 h-5 text-[#ECE8DF]" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Bihar<span className="text-[#C99446]">Drive</span>
              </span>
            </div>
            <p className="text-xs text-[#9DA7A0] max-w-sm leading-relaxed">
              Dedicated car rental fleet across all 38 districts of Bihar. Verified hatchbacks, sedans, 4x4 SUVs, and luxury wedding motorcades available for self-drive and chauffeur hire.
            </p>
            <div className="space-y-1.5 pt-1 text-xs text-[#9DA7A0]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C99446]" />
                <span>Patna Hub: Bailey Road & Patna Airport Terminal (PAT)</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C99446]" />
                <span>Direct WhatsApp: +91 93540 35140 (Instant Dispatch)</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#C99446]">
              Fleet & Booking
            </h4>
            <ul className="space-y-2 text-xs text-[#9DA7A0]">
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
                  Wedding & Luxury VIP
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
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#C99446]">
              Major Hubs
            </h4>
            <ul className="space-y-2 text-xs text-[#9DA7A0]">
              {popularDistricts.slice(0, 5).map((d) => (
                <li key={d.slug}>
                  <Link href={`/cars/${d.slug}`} className="hover:text-white transition-colors">
                    Rent in {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Standards & Admin Link */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#C99446]">
              Operations
            </h4>
            <ul className="space-y-2 text-xs text-[#9DA7A0]">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#20493A]" />
                <span>250 km/day Included</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#20493A]" />
                <span>Fast WhatsApp Dispatch</span>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Rental
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1 text-[11px] text-[#C99446] hover:underline"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin Fleet Console</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-[#717A74]">
          <p>© 2026 BiharDrive. Direct Booking & Fleet Logistics for Bihar.</p>
          <p>Direct WhatsApp Bookings: +91 93540 35140</p>
        </div>
      </div>
    </footer>
  );
}
