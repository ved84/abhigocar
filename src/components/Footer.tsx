import Link from "next/link";
import { Car, MapPin, Phone, ShieldCheck, Clock, Lock } from "lucide-react";
import { BIHAR_DISTRICTS } from "@/data/districts";

export function Footer() {
  const popularDistricts = BIHAR_DISTRICTS.slice(0, 8);

  return (
    <footer className="bg-[#161B22] text-[#F0F6FC] pt-14 pb-10 border-t border-[#30363D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-[#30363D]">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] p-1.5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                <img
                  src="/logo.png"
                  alt="abhigocar logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-display text-2xl font-extrabold tracking-tight text-white">
                abhi<span className="text-[#E03E36]">cargo</span>
              </span>
            </div>
            <p className="text-xs text-[#9CA3AF] max-w-sm leading-relaxed">
              Commercial yellow-plate self-drive and chauffeur cars stationed across all 38 districts in Bihar. Direct booking via WhatsApp with clear pricing and fast handover.
            </p>
            <div className="space-y-2 pt-1 text-xs text-[#9CA3AF]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E03E36] shrink-0" />
                <span>Patna Hub: Bailey Road & Patna Airport Terminal (PAT)</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E03E36] shrink-0" />
                <span>Direct WhatsApp Desk: +91 85389 18819</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#E03E36]">
              Cars & Booking
            </h4>
            <ul className="space-y-2 text-xs text-[#9CA3AF]">
              <li>
                <Link href="/cars" className="hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-[#C63832] rounded">
                  All Available Cars
                </Link>
              </li>
              <li>
                <Link href="/districts" className="hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-[#C63832] rounded">
                  All 38 Districts & Hubs
                </Link>
              </li>
              <li>
                <Link href="/cars?category=WEDDING_EVENT" className="hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-[#C63832] rounded">
                  Wedding & VIP Motorcades
                </Link>
              </li>
              <li>
                <Link href="/my-bookings" className="hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-[#C63832] rounded">
                  Track Booking by Reference
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Districts */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#E03E36]">
              Major Transit Hubs
            </h4>
            <ul className="space-y-2 text-xs text-[#9CA3AF]">
              {popularDistricts.slice(0, 5).map((d) => (
                <li key={d.slug}>
                  <Link href={`/cars/${d.slug}`} className="hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-[#C63832] rounded">
                    Cars in {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rules & Transparency */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#E03E36]">
              Rules & Operations
            </h4>
            <ul className="space-y-2 text-xs text-[#9CA3AF]">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E03E36] shrink-0" />
                <span>250 km/day standard included</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#E03E36] shrink-0" />
                <span>Direct WhatsApp confirmation</span>
              </li>
              <li>
                <Link href="/#rules" className="hover:text-white transition-colors text-[#F0F6FC] font-semibold underline underline-offset-4 focus-visible:ring-1 focus-visible:ring-[#C63832] rounded">
                  नियम एवं आवश्यक दस्तावेज़
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-[#C63832] rounded">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-[#C63832] rounded">
                  Privacy Policy
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-[11px] text-[#8B949E] hover:text-[#E03E36] transition-colors focus-visible:ring-1 focus-visible:ring-[#C63832] rounded"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin Console</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#8B949E]">
          <p>© 2026 abhigocar. All Rights Reserved.</p>
          <p>WhatsApp Desk: +91 85389 18819</p>
        </div>
      </div>
    </footer>
  );
}
