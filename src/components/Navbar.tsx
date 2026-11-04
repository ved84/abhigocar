"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Menu, X, Phone, ArrowRight } from "lucide-react";
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
    <header className="sticky top-0 z-50 bg-[#0E1216]/80 backdrop-blur-xl border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#C63832] to-[#9B1E19] flex items-center justify-center text-white shadow-lg shadow-red-950/40 border border-white/10"
            >
              <Car className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl font-extrabold tracking-tight text-white">
                  Bihar<span className="text-[#C63832]">Drive</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.06] text-[#A6B2BC] border border-white/10 backdrop-blur-xs">
                  AbhigoCar
                </span>
              </div>
              <p className="text-[11px] text-[#8F9CA8] hidden sm:block">
                Bihar&apos;s Regional Self-Drive & Chauffeur Fleet
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1.5 rounded-full border border-white/[0.08] backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                    isActive
                      ? "text-white bg-[#C63832] shadow-sm"
                      : "text-[#8F9CA8] hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Direct WhatsApp Call / Book Action */}
          <div className="hidden md:flex items-center gap-3">
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="https://wa.me/918538918819"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg bg-white/[0.04] text-[#F1F4F7] border border-white/10 hover:border-[#C63832]/60 hover:bg-white/[0.07] transition-all backdrop-blur-md"
            >
              <Phone className="w-3.5 h-3.5 text-[#C63832]" />
              <span>+91 85389 18819</span>
            </motion.a>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/cars"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-[#C63832] to-[#B02E28] hover:from-[#E03E36] hover:to-[#C63832] text-white transition-all shadow-md shadow-red-950/40 border border-red-400/20"
              >
                <span>Explore Fleet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-white bg-white/[0.05] border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-t border-white/[0.08] bg-[#0E1216]/95 backdrop-blur-2xl px-4 pt-4 pb-6 space-y-4 overflow-hidden"
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
                      : "text-[#8F9CA8] hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2">
              <a
                href="https://wa.me/918538918819"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-2.5 text-xs font-bold rounded-lg border border-white/10 bg-white/[0.04] text-white backdrop-blur-md"
              >
                WhatsApp Support: +91 85389 18819
              </a>
              <Link
                href="/cars"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-xs font-bold bg-[#C63832] text-white rounded-lg"
              >
                Explore Fleet &rarr;
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
