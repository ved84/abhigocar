"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Menu, X, Phone, ArrowRight } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "Explore Cars", href: "/cars" },
    { label: "Districts & Hubs", href: "/districts" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Track Booking", href: "/my-bookings" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#101411]/95 backdrop-blur-md border-b border-[#2B352E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-[#2D6A54] flex items-center justify-center text-white transition-transform group-hover:scale-105 shadow-xs">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#EEF0EB]">
                  Bihar<span className="text-[#387F66]">Drive</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#1E2620] text-[#D4A359] border border-[#2B352E]">
                  Bihar
                </span>
              </div>
              <p className="text-[11px] text-[#8E9991] hidden sm:block">
                Regional Car Rentals Across All 38 Districts
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-[#387F66] font-bold"
                    : "text-[#EEF0EB] hover:text-[#387F66]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Direct WhatsApp Call / Book Action */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://wa.me/919354035140"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-md border border-[#2B352E] bg-[#181E19] text-[#EEF0EB] hover:border-[#387F66] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#387F66]" />
              <span>+91 93540 35140</span>
            </a>

            <Link
              href="/cars"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md bg-[#2D6A54] text-white hover:bg-[#387F66] transition-all shadow-xs"
            >
              <span>Book a Car</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-[#EEF0EB] hover:bg-[#181E19] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#2B352E] bg-[#101411] px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-[#EEF0EB] hover:text-[#387F66]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-[#2B352E] flex flex-col gap-2">
            <a
              href="https://wa.me/919354035140"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-2 text-xs font-semibold rounded-md border border-[#2B352E] bg-[#181E19] text-[#EEF0EB]"
            >
              WhatsApp Support: +91 93540 35140
            </a>
            <Link
              href="/cars"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-xs font-semibold bg-[#2D6A54] text-white rounded-md"
            >
              Browse Available Cars
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
