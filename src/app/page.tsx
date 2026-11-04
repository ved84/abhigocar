"use client";

import Link from "next/link";
import { store } from "@/lib/store";
import { BIHAR_DISTRICTS } from "@/data/districts";
import { CategorySelector } from "@/components/CategorySelector";
import { VehicleCard } from "@/components/VehicleCard";
import { HindiRulesSection } from "@/components/HindiRulesSection";
import { HeroEnquiryBox } from "@/components/HeroEnquiryBox";
import {
  ShieldCheck,
  Calendar,
  CheckCircle2,
  FileCheck,
  ArrowRight,
  Plane,
  MessageCircle,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  const featuredCars = store.getVehicles({ onlyActive: true }).slice(0, 6);
  const keyDistricts = BIHAR_DISTRICTS.filter((d) => d.isPopular);

  return (
    <div className="space-y-0 bg-[#0E1216] text-[#F1F4F7] relative overflow-hidden">
      {/* 1. Premium Glassmorphic Hero Section */}
      <section className="relative pt-12 pb-20 sm:pb-28 bg-[#0E1216] text-white border-b border-white/[0.08] overflow-hidden">
        {/* Ambient Automotive Glow Effect */}
        <div className="ambient-glow-red" />
        <div className="absolute top-1/4 -right-40 w-96 h-96 bg-[#C63832]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Copy with Staggered Framer Motion */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="lg:col-span-7 space-y-6"
            >
              {/* Top Glass Pill */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-[#F1F4F7] text-xs font-semibold tracking-wide"
              >
                <span className="w-2 h-2 rounded-full bg-[#E03E36] animate-pulse" />
                <span>BiharDrive • Direct WhatsApp Booking Across All 38 Districts</span>
              </motion.div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
                Bihar&apos;s Premier Car Fleet. <br />
                <span className="bg-gradient-to-r from-[#FF6B64] via-[#E03E36] to-[#C63832] bg-clip-text text-transparent">
                  Direct on WhatsApp.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#8F9CA8] max-w-xl leading-relaxed">
                Rent verified self-drive hatchbacks, Honda City executive sedans, Mahindra Scorpio-N 4x4s, and Toyota Innova Crystas delivered to Patna Airport, Gaya, Muzaffarpur, Darbhanga, and all Bihar transit hubs.
              </p>

              {/* Verified Features Row with Frosted Glass */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#F1F4F7] pt-1">
                <div className="flex items-center gap-2.5 glass-panel p-3.5 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-[#E03E36] shrink-0" />
                  <span className="font-medium">250 km/day generous allowance</span>
                </div>
                <div className="flex items-center gap-2.5 glass-panel p-3.5 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-[#E03E36] shrink-0" />
                  <span className="font-medium">Commercial RTO Yellow-Plate Fleet</span>
                </div>
                <div className="flex items-center gap-2.5 glass-panel p-3.5 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-[#E03E36] shrink-0" />
                  <span className="font-medium">Instant deposit refund upon return</span>
                </div>
                <div className="flex items-center gap-2.5 glass-panel p-3.5 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-[#E03E36] shrink-0" />
                  <span className="font-medium">Direct WhatsApp dispatch: +91 85389 18819</span>
                </div>
              </div>

              {/* Direct WhatsApp Callouts */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <motion.a
                  whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(198, 56, 50, 0.45)" }}
                  whileTap={{ scale: 0.97 }}
                  href="https://wa.me/918538918819"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#C63832] via-[#D83832] to-[#B02E28] text-white text-xs font-bold transition-all shadow-xl shadow-red-950/40 border border-red-400/30"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Direct WhatsApp Booking: +91 85389 18819</span>
                </motion.a>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/cars"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl glass-panel hover:bg-white/[0.08] text-white text-xs font-bold transition-all border border-white/10"
                  >
                    <span>Browse All Cars</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Interactive Hero Enquiry Box */}
            <div className="lg:col-span-5 relative">
              <HeroEnquiryBox />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Fleet Categories */}
      <CategorySelector />

      {/* 3. Featured Fleet Section */}
      <section className="py-20 border-b border-white/[0.08] bg-[#0E1216] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B64] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#E03E36]" />
                Verified Fleet
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white mt-1">
                Featured Vehicles Ready for Handover
              </h2>
              <p className="text-xs text-[#8F9CA8] mt-1">
                Clean commercial yellow-plate cars stationed across key districts of Bihar.
              </p>
            </div>
            <Link
              href="/cars"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6B64] hover:text-white transition-colors group"
            >
              <span>View all available fleet</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.map((car) => (
              <VehicleCard key={car.id} vehicle={car} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. District Coverage Section */}
      <section className="py-20 border-b border-white/[0.08] bg-[#0E1216] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B64] flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-[#E03E36]" />
                Statewide Network
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white mt-1">
                Browse Cars by District & Transit Hubs
              </h2>
              <p className="text-sm text-[#8F9CA8] mt-1 max-w-xl">
                Direct vehicle pickup at Jay Prakash Narayan Airport (PAT), Darbhanga Airport (DHR), Gaya Airport (GAY), and district headquarters across Bihar.
              </p>
            </div>
            <Link
              href="/districts"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6B64] hover:text-white transition-colors group"
            >
              <span>See all 38 districts</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {keyDistricts.map((d) => (
              <motion.div
                key={d.slug}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={`/cars/${d.slug}`}
                  className="glass-card p-6 rounded-2xl flex flex-col justify-between h-full group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-display text-lg font-bold text-white group-hover:text-[#FF6B64] transition-colors">
                        {d.name}
                      </h3>
                      <span className="text-[10px] text-[#A6B2BC] font-semibold px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10">
                        {d.slug === "patna" ? "Airport + Rly" : "Active Hub"}
                      </span>
                    </div>
                    <p className="text-xs text-[#8F9CA8] line-clamp-2 leading-relaxed mb-4">
                      {d.description}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-[#E03E36] font-bold">
                    <span>Explore Cars in {d.name}</span>
                    <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. AbhigoCar Hindi Documents & Rules Section */}
      <HindiRulesSection />

      {/* 6. How Booking Works with Glass Cards */}
      <section id="how-it-works" className="py-20 border-b border-white/[0.08] bg-[#0E1216] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B64] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#E03E36]" />
              Simple 3-Step Booking
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white mt-1">
              How Renting on BiharDrive Works
            </h2>
            <p className="text-sm text-[#8F9CA8] mt-1">
              Select your vehicle, fill basic trip dates, and get instantly routed to our WhatsApp desk.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ y: -6 }}
              className="glass-card p-7 rounded-2xl space-y-3 relative overflow-hidden"
            >
              <span className="font-display text-4xl font-extrabold bg-gradient-to-r from-[#FF6B64] to-[#C63832] bg-clip-text text-transparent block">
                01
              </span>
              <h3 className="font-display text-lg font-bold text-white">
                Select Vehicle & District
              </h3>
              <p className="text-xs text-[#8F9CA8] leading-relaxed">
                Choose from hatchbacks, executive sedans, 4x4 SUVs, or wedding motorcades across Patna, Gaya, Darbhanga, or your district.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -6 }}
              className="glass-card p-7 rounded-2xl space-y-3 relative overflow-hidden"
            >
              <span className="font-display text-4xl font-extrabold bg-gradient-to-r from-[#FF6B64] to-[#C63832] bg-clip-text text-transparent block">
                02
              </span>
              <h3 className="font-display text-lg font-bold text-white">
                Self-Drive or Chauffeur
              </h3>
              <p className="text-xs text-[#8F9CA8] leading-relaxed">
                Pick self-drive (requires driving license) or request an experienced uniform driver familiar with Bihar highway routes.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -6 }}
              className="glass-card p-7 rounded-2xl space-y-3 relative overflow-hidden"
            >
              <span className="font-display text-4xl font-extrabold bg-gradient-to-r from-[#FF6B64] to-[#C63832] bg-clip-text text-transparent block">
                03
              </span>
              <h3 className="font-display text-lg font-bold text-white">
                WhatsApp Confirmation
              </h3>
              <p className="text-xs text-[#8F9CA8] leading-relaxed">
                Booking details route immediately to our team at <strong>+91 85389 18819</strong> on WhatsApp to finalize pickup point and timing.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. Trust & Operations Standards with Frosted Glass Panels */}
      <section className="py-20 bg-[#0E1216] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B64]">
                Operational Standards
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                Built for Reliability on Bihar Roads
              </h2>
              <p className="text-sm text-[#8F9CA8] leading-relaxed">
                Genuine RTO commercial registration, transparent 250 km/day allowances, fast deposit returns, and direct WhatsApp support at <strong className="text-white">+91 85389 18819</strong>.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl space-y-2">
                <div className="flex items-center gap-2.5 text-sm font-bold text-white">
                  <ShieldCheck className="w-5 h-5 text-[#E03E36]" />
                  <span>250 KM Included Daily</span>
                </div>
                <p className="text-xs text-[#8F9CA8] leading-relaxed">
                  Generous 250 km/day travel allowance with disclosed extra-km rates. No hidden garage fees.
                </p>
              </motion.div>

              <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl space-y-2">
                <div className="flex items-center gap-2.5 text-sm font-bold text-white">
                  <Plane className="w-5 h-5 text-[#E03E36]" />
                  <span>Airport Handover</span>
                </div>
                <p className="text-xs text-[#8F9CA8] leading-relaxed">
                  Prompt handover at Patna Airport (PAT) and Darbhanga Airport terminal parking.
                </p>
              </motion.div>

              <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl space-y-2">
                <div className="flex items-center gap-2.5 text-sm font-bold text-white">
                  <FileCheck className="w-5 h-5 text-[#E03E36]" />
                  <span>Prompt Deposit Return</span>
                </div>
                <p className="text-xs text-[#8F9CA8] leading-relaxed">
                  Refundable security deposits returned promptly upon vehicle return inspection.
                </p>
              </motion.div>

              <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl space-y-2">
                <div className="flex items-center gap-2.5 text-sm font-bold text-white">
                  <Calendar className="w-5 h-5 text-[#E03E36]" />
                  <span>No Login Needed</span>
                </div>
                <p className="text-xs text-[#8F9CA8] leading-relaxed">
                  Rent without account creation hassles. Everything coordinates directly via WhatsApp and phone.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
