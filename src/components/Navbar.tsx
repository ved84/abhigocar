"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "Explore Cars", href: "/cars" },
    { label: "Districts & Hubs", href: "/districts" },
    { label: "नियम एवं शर्तें (Rules)", href: "/#rules" },
    { label: "Track Booking", href: "/my-bookings" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0D1117]/90 backdrop-blur-md border-b border-[#30363D] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Identity */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-[#C63832] rounded-lg p-1"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/[0.05] p-1.5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
              <img
                src="/logo.png"
                alt="abhicargo logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl font-extrabold tracking-tight text-white">
                  abhi<span className="text-[#E03E36]">cargo</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#21262D] text-[#C9D1D9] border border-[#30363D]">
                  Car Rental
                </span>
              </div>
              <p className="text-[11px] text-[#9CA3AF] hidden sm:block">
                Self-Drive & Chauffeur Car Rentals Across Bihar
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#161B22] p-1.5 rounded-xl border border-[#30363D]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[#C63832] ${
                    isActive
                      ? "text-white bg-[#C63832]"
                      : "text-[#9CA3AF] hover:text-white hover:bg-[#21262D]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Direct WhatsApp Call & Primary Action */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://wa.me/918538918819"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg bg-[#161B22] text-[#F0F6FC] border border-[#30363D] hover:border-[#C63832] transition-colors focus-visible:ring-2 focus-visible:ring-[#C63832]"
              aria-label="Direct WhatsApp helpline +91 85389 18819"
            >
              <Phone className="w-3.5 h-3.5 text-[#E03E36]" />
              <span>+91 85389 18819</span>
            </a>

            <Link
              href="/cars"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-lg bg-[#C63832] hover:bg-[#E03E36] text-white transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-[#C63832]"
            >
              <span>Browse Cars</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-lg text-white bg-[#161B22] border border-[#30363D] hover:bg-[#21262D] transition-colors focus-visible:ring-2 focus-visible:ring-[#C63832]"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Animated Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden border-t border-[#30363D] bg-[#0D1117] px-4 pt-4 pb-6 space-y-4"
          >
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    pathname === link.href
                      ? "text-white bg-[#C63832]"
                      : "text-[#9CA3AF] hover:text-white hover:bg-[#161B22]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-[#30363D] flex flex-col gap-2">
              <a
                href="https://wa.me/918538918819"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-2.5 text-xs font-bold rounded-lg border border-[#30363D] bg-[#161B22] text-white"
              >
                WhatsApp Desk: +91 85389 18819
              </a>
              <Link
                href="/cars"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-xs font-bold bg-[#C63832] hover:bg-[#E03E36] text-white rounded-lg"
              >
                Browse All Cars
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
