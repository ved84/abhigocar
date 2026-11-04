"use client";

import { useState } from "react";
import { MessageCircle, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const POPULAR_FLEET = [
  { name: "Honda City ZX (Sedan)", slug: "honda-city-zx-muzaffarpur", district: "muzaffarpur" },
  { name: "Mahindra Scorpio-N 4x4 (SUV)", slug: "mahindra-scorpio-n-z8l-darbhanga", district: "darbhanga" },
  { name: "Toyota Innova Crysta (7-Seater)", slug: "toyota-innova-crysta-zx-patna", district: "patna" },
  { name: "Mahindra Thar 4x4 (Off-Roader)", slug: "mahindra-thar-lx-4x4-gaya", district: "gaya" },
  { name: "Hyundai Creta SX(O) (SUV)", slug: "hyundai-creta-sxo-patna", district: "patna" },
  { name: "Maruti Suzuki Swift (Hatchback)", slug: "maruti-swift-zxi-patna", district: "patna" },
  { name: "Maruti Suzuki Baleno Alpha (Hatchback)", slug: "maruti-baleno-alpha-gaya", district: "gaya" },
  { name: "Maruti Suzuki Ertiga (7-Seater MUV)", slug: "maruti-ertiga-zxi-patna", district: "patna" },
  { name: "Toyota Fortuner Legender (VIP SUV)", slug: "toyota-fortuner-legender-purnia", district: "purnia" },
  { name: "Tata Nexon EV (Electric SUV)", slug: "tata-nexon-ev-empowered-bhagalpur", district: "bhagalpur" },
  { name: "Audi A6 Luxury (Wedding / VIP)", slug: "audi-a6-matrix-patna-wedding", district: "patna" },
];

export function HeroEnquiryBox() {
  const [selectedCar, setSelectedCar] = useState(POPULAR_FLEET[0].name);
  const [district, setDistrict] = useState("Patna (Airport / Station)");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [travelDates, setTravelDates] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nameText = customerName.trim() || "Valued Customer";
    const phoneText = customerPhone.trim() || "Not provided";
    const datesText = travelDates.trim() || "Upcoming trip";

    const message = `🚗 *New Car Enquiry - BiharDrive*
• *Car Selected:* ${selectedCar}
• *City / Pickup Hub:* ${district}
• *Travel Dates:* ${datesText}
• *Customer Name:* ${nameText}
• *WhatsApp Number:* ${phoneText}

Hello BiharDrive team, I want to enquire about availability and booking for this car. Please guide me.`;

    const targetUrl = `https://wa.me/918538918819?text=${encodeURIComponent(message)}`;
    window.open(targetUrl, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      className="glass-panel rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5 relative overflow-hidden border border-white/10"
    >
      {/* Subtle top light refraction */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#C63832]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Box Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] relative">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E03E36] animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B64]">
              Instant WhatsApp Dispatch
            </span>
          </div>
          <h3 className="font-display text-2xl font-bold text-white mt-1">
            Book or Enquire in 30 Seconds
          </h3>
        </div>
        <span className="px-2.5 py-1 rounded-full glass-pill text-[11px] text-[#A6B2BC] font-semibold hidden sm:inline flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#FF6B64]" />
          No DL Needed
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs relative">
        {/* Car Select */}
        <div className="space-y-1.5">
          <label className="font-bold text-[#A6B2BC] block text-[11px] uppercase tracking-wider">
            1. Select Car Model
          </label>
          <select
            value={selectedCar}
            onChange={(e) => setSelectedCar(e.target.value)}
            className="w-full h-11 px-3 glass-input rounded-xl text-white font-medium cursor-pointer"
          >
            {POPULAR_FLEET.map((car) => (
              <option key={car.name} value={car.name} className="bg-[#141A20] text-white">
                {car.name}
              </option>
            ))}
          </select>
        </div>

        {/* District / Hub */}
        <div className="space-y-1.5">
          <label className="font-bold text-[#A6B2BC] block text-[11px] uppercase tracking-wider">
            2. District / Delivery Hub
          </label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full h-11 px-3 glass-input rounded-xl text-white font-medium cursor-pointer"
          >
            <option value="Patna (Airport / Railway Station / City)" className="bg-[#141A20] text-white">
              Patna (Airport / Station / City)
            </option>
            <option value="Gaya & Bodh Gaya (Airport & Temple Zone)" className="bg-[#141A20] text-white">
              Gaya & Bodh Gaya (Airport & Temple Hub)
            </option>
            <option value="Muzaffarpur (Commercial Axis / Station)" className="bg-[#141A20] text-white">
              Muzaffarpur (Commercial Axis)
            </option>
            <option value="Darbhanga (Airport / Mithila Hub)" className="bg-[#141A20] text-white">
              Darbhanga (Airport Terminal)
            </option>
            <option value="Bhagalpur (Zero Mile / Vikramshila)" className="bg-[#141A20] text-white">
              Bhagalpur (Zero Mile Hub)
            </option>
            <option value="Purnia & Katihar" className="bg-[#141A20] text-white">Purnia & Katihar</option>
            <option value="Begusarai & Samastipur" className="bg-[#141A20] text-white">Begusarai & Samastipur</option>
            <option value="Other District in Bihar" className="bg-[#141A20] text-white">Other District in Bihar</option>
          </select>
        </div>

        {/* Name and Phone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="font-bold text-[#A6B2BC] block text-[11px] uppercase tracking-wider">
              Your Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Alok Kumar"
              className="w-full h-11 px-3 glass-input rounded-xl text-white placeholder-[#5A6672]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-[#A6B2BC] block text-[11px] uppercase tracking-wider">
              WhatsApp Number
            </label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="e.g. 98350 12345"
              className="w-full h-11 px-3 glass-input rounded-xl text-white placeholder-[#5A6672]"
              required
            />
          </div>
        </div>

        {/* Travel Dates */}
        <div className="space-y-1.5">
          <label className="font-bold text-[#A6B2BC] block text-[11px] uppercase tracking-wider">
            Tentative Travel Dates / Duration
          </label>
          <input
            type="text"
            value={travelDates}
            onChange={(e) => setTravelDates(e.target.value)}
            placeholder="e.g. Tomorrow for 3 days or 15 Nov to 18 Nov"
            className="w-full h-11 px-3 glass-input rounded-xl text-white placeholder-[#5A6672]"
          />
        </div>

        {/* Animated WhatsApp Direct Action Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(198, 56, 50, 0.45)" }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-[#C63832] via-[#D83832] to-[#B02E28] text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer mt-3 border border-red-400/30 transition-all"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>Send Enquiry via WhatsApp (+91 85389 18819)</span>
        </motion.button>
      </form>

      {/* Trust Line */}
      <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-[#8F9CA8]">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#E03E36]" />
          Instant WhatsApp response
        </span>
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#E03E36]" />
          All 38 Bihar Districts
        </span>
      </div>
    </motion.div>
  );
}
