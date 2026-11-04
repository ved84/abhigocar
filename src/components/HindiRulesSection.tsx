"use client";

import {
  FileText,
  AlertTriangle,
  Clock,
  Gauge,
  ShieldAlert,
  Wrench,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

export function HindiRulesSection() {
  return (
    <section id="rules" className="py-20 bg-[#0E1216] text-white border-b border-white/[0.08] scroll-mt-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-[#FF6B64] text-xs font-bold tracking-wide mb-3">
            <span className="w-2 h-2 rounded-full bg-[#E03E36]" />
            <span>AbhigoCar • नियम एवं आवश्यक शर्तें</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white">
            AbhigoCar - बुकिंग के लिए ज़रूरी डॉक्यूमेंट्स और नियम
          </h2>
          <p className="text-sm text-[#8F9CA8] mt-2">
            अभिगो कार - बुकिंग के लिए आवश्यक दस्तावेज़ और नियम (गाड़ी लेने से पहले ध्यानपूर्वक पढ़ें)
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Required Documents */}
          <motion.div
            whileHover={{ y: -4 }}
            className="lg:col-span-5 glass-panel rounded-2xl p-6 sm:p-7 shadow-xl space-y-6"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-white/[0.08]">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#E03E36]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white">
                  आवश्यक दस्तावेज़ (Required Documents)
                </h3>
                <span className="text-xs text-[#8F9CA8]">कार हैंडओवर के समय अनिवार्य</span>
              </div>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm">
              {/* DL */}
              <div className="p-4 rounded-xl glass-card space-y-1">
                <div className="flex items-center gap-2 font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#E03E36] shrink-0" />
                  <span>ओरिजिनल ड्राइविंग लाइसेंस (DL)</span>
                </div>
                <p className="text-[#8F9CA8] pl-6 text-xs">
                  (उम्र 21 वर्ष से अधिक होनी चाहिए)
                </p>
              </div>

              {/* Aadhaar */}
              <div className="p-4 rounded-xl glass-card space-y-1">
                <div className="flex items-center gap-2 font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#E03E36] shrink-0" />
                  <span>आधार कार्ड</span>
                </div>
                <p className="text-[#8F9CA8] pl-6 text-xs">
                  (लोकल एड्रेस प्रूफ के साथ)
                </p>
              </div>

              {/* Security Deposit */}
              <div className="p-4 rounded-xl glass-card space-y-1">
                <div className="flex items-center gap-2 font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#E03E36] shrink-0" />
                  <span>रिफंडेबल सिक्योरिटी डिपॉजिट</span>
                </div>
                <p className="text-[#8F9CA8] pl-6 text-xs">
                  (गाड़ी वापस करते ही तुरंत रिफंड कर दिया जाएगा)
                </p>
              </div>
            </div>

            {/* Note Callout */}
            <div className="p-4 rounded-xl bg-[#0E1216] border-l-4 border-l-[#C63832] border border-white/10 text-xs space-y-1 text-white">
              <span className="font-bold text-[#FF6B64] block">
                ⚠️ नोट (Important Note):
              </span>
              <p className="text-[#8F9CA8] leading-relaxed">
                गाड़ी केवल वही व्यक्ति चला सकता है जिसके नाम पर बुकिंग और लाइसेंस है। किसी अन्य व्यक्ति को गाड़ी सौंपना सख्त मना है।
              </p>
            </div>
          </motion.div>

          {/* Right Column: Important Terms & Penalties */}
          <motion.div
            whileHover={{ y: -4 }}
            className="lg:col-span-7 glass-panel rounded-2xl p-6 sm:p-7 shadow-xl space-y-6"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-white/[0.08]">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#E03E36]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white">
                  महत्वपूर्ण शर्तें एवं जुर्माना (Late Return & Damage Rules)
                </h3>
                <span className="text-xs text-[#8F9CA8]">देर से वापसी एवं नुकसान संबंधी नियम</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Late Return Policy */}
              <div className="sm:col-span-2 p-4 rounded-xl glass-card space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-white">
                  <Clock className="w-4 h-4 text-[#E03E36]" />
                  <span>Late Return Policy (देर से वापसी नियम)</span>
                </div>
                <p className="text-[#8F9CA8]">
                  गाड़ी तय समय पर ही वापस करनी होगी।
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
                  <div className="p-3 rounded-lg bg-[#0E1216] border border-white/10">
                    <span className="text-[#FF6B64] font-bold block">3 घंटे से ज्यादा लेट:</span>
                    <span className="text-[#8F9CA8]">आधे दिन (Half Day) का किराया लगेगा</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0E1216] border border-white/10">
                    <span className="text-[#FF6B64] font-bold block">12 घंटे से ज्यादा लेट:</span>
                    <span className="text-[#8F9CA8]">पूरे दिन (Full Day) का किराया देना होगा</span>
                  </div>
                </div>
              </div>

              {/* Over Speeding */}
              <div className="p-4 rounded-xl glass-card space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 font-bold text-sm text-white mb-1">
                    <Gauge className="w-4 h-4 text-[#E03E36]" />
                    <span>Over Speeding Fine</span>
                  </div>
                  <p className="text-[#8F9CA8] leading-relaxed">
                    गाड़ी की गति सीमा (Speed Limit) <strong className="text-white">110 km/h</strong> तय है।
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-[#0E1216] border border-white/10 text-white text-xs mt-2">
                  110 से ऊपर चलाने पर कंपनी द्वारा <strong className="text-[#FF6B64]">₹2000/- का जुर्माना (Fine)</strong> लगाया जाएगा।
                </div>
              </div>

              {/* Body Damage / Dent */}
              <div className="p-4 rounded-xl glass-card space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 font-bold text-sm text-white mb-1">
                    <ShieldAlert className="w-4 h-4 text-[#E03E36]" />
                    <span>Body Damage / Dent</span>
                  </div>
                  <p className="text-[#8F9CA8] leading-relaxed">
                    यात्रा के दौरान गाड़ी में किसी भी प्रकार का स्क्रैच, डेंट या बॉडी डैमेज होता है।
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-[#0E1216] border border-white/10 text-white text-xs mt-2">
                  उसका पूरा खर्च <strong className="text-[#FF6B64]">(Repairing Cost)</strong> कस्टमर को देना होगा।
                </div>
              </div>

              {/* Clutch & Tyre Damage */}
              <div className="sm:col-span-2 p-4 rounded-xl glass-card space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-white">
                  <Wrench className="w-4 h-4 text-[#E03E36]" />
                  <span>Clutch & Tyre Damage (क्लच और टायर नुकसान)</span>
                </div>
                <p className="text-[#8F9CA8] leading-relaxed">
                  क्लच प्लेट जलने (Clutch burn) या टायर फटने/खराब होने की स्थिति में पूरा खर्च कस्टमर को वहन करना होगा।
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
