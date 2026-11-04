"use client";

import { useState, useEffect } from "react";
import { MessageCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { Vehicle } from "@/types";

const FALLBACK_POPULAR_FLEET = [
  { name: "Maruti Suzuki Swift (Hatchback)", slug: "maruti-swift-zxi-patna", district: "patna" },
  { name: "Honda City ZX (Executive Sedan)", slug: "honda-city-zx-muzaffarpur", district: "muzaffarpur" },
  { name: "Mahindra Scorpio-N 4x4 (SUV)", slug: "mahindra-scorpio-n-z8l-darbhanga", district: "darbhanga" },
  { name: "Toyota Innova Crysta (7-Seater MUV)", slug: "toyota-innova-crysta-zx-patna", district: "patna" },
  { name: "Hyundai Creta SX(O) (Compact SUV)", slug: "hyundai-creta-sxo-patna", district: "patna" },
  { name: "Maruti Suzuki Brezza ZXi (Compact SUV)", slug: "maruti-brezza-zxi-muzaffarpur", district: "muzaffarpur" },
  { name: "Mahindra Thar 4x4 (Off-Roader)", slug: "mahindra-thar-lx-4x4-gaya", district: "gaya" },
  { name: "Maruti Suzuki Baleno Alpha (Hatchback)", slug: "maruti-baleno-alpha-gaya", district: "gaya" },
  { name: "Maruti Suzuki Ertiga (7-Seater MUV)", slug: "maruti-ertiga-zxi-patna", district: "patna" },
  { name: "Toyota Fortuner Legender (VIP SUV)", slug: "toyota-fortuner-legender-purnia", district: "purnia" },
  { name: "Tata Nexon EV (Electric SUV)", slug: "tata-nexon-ev-empowered-bhagalpur", district: "bhagalpur" },
  { name: "Audi A6 Luxury (Wedding / VIP)", slug: "audi-a6-matrix-patna-wedding", district: "patna" },
  { name: "Maruti Suzuki Dzire (Executive Sedan)", slug: "maruti-dzire-zxi-patna-airport", district: "patna" },
];

interface HeroEnquiryBoxProps {
  vehicles?: Vehicle[];
}

export function HeroEnquiryBox({ vehicles }: HeroEnquiryBoxProps) {
  const [fleetOptions, setFleetOptions] = useState<{ name: string; slug: string; district: string }[]>(() => {
    if (vehicles && vehicles.length > 0) {
      return vehicles.map((v) => ({
        name: `${v.make} ${v.model} ${v.variant ? `(${v.variant})` : ""}`,
        slug: v.slug,
        district: v.districtId,
      }));
    }
    return FALLBACK_POPULAR_FLEET;
  });

  const [selectedCar, setSelectedCar] = useState(fleetOptions[0]?.name || FALLBACK_POPULAR_FLEET[0].name);
  const [district, setDistrict] = useState("Patna (Airport / Railway Station / City)");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [travelDates, setTravelDates] = useState("");

  useEffect(() => {
    if (vehicles && vehicles.length > 0) {
      const mapped = vehicles
        .filter((v) => v.isActive)
        .map((v) => ({
          name: `${v.make} ${v.model} ${v.variant ? `(${v.variant})` : ""}`,
          slug: v.slug,
          district: v.districtId,
        }));
      if (mapped.length > 0) {
        setFleetOptions(mapped);
        setSelectedCar((prev) => (mapped.some((m) => m.name === prev) ? prev : mapped[0].name));
      }
    } else {
      fetch("/api/vehicles")
        .then((res) => res.json())
        .then((data) => {
          if (data?.vehicles && data.vehicles.length > 0) {
            const mapped: { name: string; slug: string; district: string }[] = data.vehicles.map((v: Vehicle) => ({
              name: `${v.make} ${v.model} ${v.variant ? `(${v.variant})` : ""}`,
              slug: v.slug,
              district: v.districtId,
            }));
            setFleetOptions(mapped);
            setSelectedCar((prev) => (mapped.some((m) => m.name === prev) ? prev : mapped[0].name));
          }
        })
        .catch(() => {});
    }
  }, [vehicles]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nameText = customerName.trim() || "Valued Customer";
    const phoneText = customerPhone.trim() || "Not provided";
    const datesText = travelDates.trim() || "Upcoming trip";

    const message = `🚗 *New Car Enquiry - abhigocar*
• *Car Selected:* ${selectedCar}
• *City / Pickup Hub:* ${district}
• *Travel Dates:* ${datesText}
• *Customer Name:* ${nameText}
• *WhatsApp Number:* ${phoneText}

Hello abhigocar team, I want to enquire about availability and booking for this car. Please guide me.`;

    const targetUrl = `https://wa.me/918538918819?text=${encodeURIComponent(message)}`;
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-[#161B22] rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xl space-y-4 border border-[#30363D] w-full">
      {/* Box Header */}
      <div className="pb-3 border-b border-[#30363D]">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#E03E36] block">
          Direct WhatsApp Desk
        </span>
        <h3 className="font-display text-xl sm:text-2xl font-bold text-white mt-0.5">
          Reserve Car or Check Dates
        </h3>
        <p className="text-xs text-[#9CA3AF] mt-1">
          Pick your car and city. Our team replies on WhatsApp within minutes.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        {/* Car Select */}
        <div className="space-y-1">
          <label htmlFor="hero-car-select" className="font-bold text-[#C9D1D9] block text-xs">
            1. Select Car Model ({fleetOptions.length} Cars Available)
          </label>
          <select
            id="hero-car-select"
            value={selectedCar}
            onChange={(e) => setSelectedCar(e.target.value)}
            className="w-full h-10 px-3 bg-[#0D1117] border border-[#30363D] rounded-lg text-white font-medium cursor-pointer text-xs sm:text-sm focus-visible:ring-2 focus-visible:ring-[#C63832]"
          >
            {fleetOptions.map((car) => (
              <option key={car.slug} value={car.name} className="bg-[#161B22] text-white">
                {car.name}
              </option>
            ))}
          </select>
        </div>

        {/* District / Hub */}
        <div className="space-y-1">
          <label htmlFor="hero-district-select" className="font-bold text-[#C9D1D9] block text-xs">
            2. Delivery Hub / District
          </label>
          <select
            id="hero-district-select"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full h-10 px-3 bg-[#0D1117] border border-[#30363D] rounded-lg text-white font-medium cursor-pointer text-xs sm:text-sm focus-visible:ring-2 focus-visible:ring-[#C63832]"
          >
            <option value="Patna (Airport / Railway Station / City)" className="bg-[#161B22] text-white">
              Patna (Airport / Station / Bailey Road)
            </option>
            <option value="Gaya & Bodh Gaya (Airport & Temple Zone)" className="bg-[#161B22] text-white">
              Gaya & Bodh Gaya (Airport & Station)
            </option>
            <option value="Muzaffarpur (Commercial Axis / Station)" className="bg-[#161B22] text-white">
              Muzaffarpur (Zero Mile / Junction)
            </option>
            <option value="Darbhanga (Airport / Mithila Hub)" className="bg-[#161B22] text-white">
              Darbhanga (Airport Terminal)
            </option>
            <option value="Bhagalpur (Zero Mile / Vikramshila)" className="bg-[#161B22] text-white">
              Bhagalpur (Zero Mile Hub)
            </option>
            <option value="Purnia & Katihar" className="bg-[#161B22] text-white">Purnia & Katihar Hub</option>
            <option value="Begusarai & Samastipur" className="bg-[#161B22] text-white">Begusarai & Samastipur Hub</option>
            <option value="Other District in Bihar" className="bg-[#161B22] text-white">Other District in Bihar</option>
          </select>
        </div>

        {/* Name and Phone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label htmlFor="hero-customer-name" className="font-bold text-[#C9D1D9] block text-xs">
              Your Name
            </label>
            <input
              id="hero-customer-name"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Alok Kumar"
              className="w-full h-10 px-3 clean-input rounded-lg text-white placeholder-[#6E7681] text-xs sm:text-sm"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="hero-customer-phone" className="font-bold text-[#C9D1D9] block text-xs">
              WhatsApp Number
            </label>
            <input
              id="hero-customer-phone"
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="e.g. 98350 12345"
              className="w-full h-10 px-3 clean-input rounded-lg text-white placeholder-[#6E7681] text-xs sm:text-sm"
              required
            />
          </div>
        </div>

        {/* Travel Dates */}
        <div className="space-y-1">
          <label htmlFor="hero-travel-dates" className="font-bold text-[#C9D1D9] block text-xs">
            Trip Dates / Duration
          </label>
          <input
            id="hero-travel-dates"
            type="text"
            value={travelDates}
            onChange={(e) => setTravelDates(e.target.value)}
            placeholder="e.g. 15 Nov to 18 Nov (3 days)"
            className="w-full h-10 px-3 clean-input rounded-lg text-white placeholder-[#6E7681] text-xs sm:text-sm"
          />
        </div>

        {/* Action Button */}
        <button
          type="submit"
          className="w-full py-3.5 px-4 rounded-lg bg-[#C63832] hover:bg-[#E03E36] text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer mt-3 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C63832]"
        >
          <MessageCircle className="w-4 h-4 fill-white shrink-0" />
          <span>Send Enquiry via WhatsApp (+91 85389 18819)</span>
        </button>
      </form>

      {/* Trust Line */}
      <div className="pt-2 border-t border-[#30363D] flex items-center justify-between text-xs text-[#9CA3AF]">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#E03E36] shrink-0" />
          Fast WhatsApp confirmation
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#E03E36] shrink-0" />
          Yellow-plate commercial cars
        </span>
      </div>
    </div>
  );
}
