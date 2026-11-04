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

export function HindiRulesSection() {
  return (
    <section id="rules" className="py-14 sm:py-16 lg:py-20 bg-[#0D1117] text-white border-b border-[#30363D] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Section Heading */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E03E36] block">
            पारदर्शी नियम एवं सुरक्षा शर्तें (Rental Guidelines)
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-1">
            बुकिंग के लिए ज़रूरी दस्तावेज़ एवं नियम
          </h2>
          <p className="text-xs sm:text-sm text-[#9CA3AF] mt-2">
            गाड़ी हैंडओवर से पूर्व कृपया निम्नलिखित शर्तों को ध्यानपूर्वक पढ़ें ताकि आपकी यात्रा निर्बाध रहे।
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: Required Documents */}
          <div className="lg:col-span-5 bg-[#161B22] rounded-2xl p-6 sm:p-7 border border-[#30363D] space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-[#30363D]">
              <div className="w-10 h-10 rounded-xl bg-[#21262D] border border-[#30363D] flex items-center justify-center text-[#E03E36]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold text-white">
                  आवश्यक दस्तावेज़ (Required KYC)
                </h3>
                <span className="text-xs text-[#9CA3AF]">कार हैंडओवर के समय अनिवार्य</span>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              {/* DL */}
              <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1">
                <div className="flex items-center gap-2 font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#E03E36] shrink-0" />
                  <span>ओरिजिनल ड्राइविंग लाइसेंस (DL)</span>
                </div>
                <p className="text-[#9CA3AF] pl-6 text-xs">
                  ड्राइवर की उम्र 21 वर्ष से अधिक होनी चाहिए।
                </p>
              </div>

              {/* Aadhaar */}
              <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1">
                <div className="flex items-center gap-2 font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#E03E36] shrink-0" />
                  <span>आधार कार्ड</span>
                </div>
                <p className="text-[#9CA3AF] pl-6 text-xs">
                  वैध लोकल एड्रेस प्रूफ के साथ सत्यापन।
                </p>
              </div>

              {/* Security Deposit */}
              <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1">
                <div className="flex items-center gap-2 font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#E03E36] shrink-0" />
                  <span>रिफंडेबल सिक्योरिटी डिपॉजिट</span>
                </div>
                <p className="text-[#9CA3AF] pl-6 text-xs">
                  गाड़ी वापस करते ही निरीक्षण के पश्चात तुरंत रिफंड।
                </p>
              </div>
            </div>

            {/* Note Callout */}
            <div className="p-4 rounded-xl bg-[#21262D] border-l-4 border-l-[#C63832] border border-[#30363D] text-xs space-y-1 text-white">
              <span className="font-bold text-[#E03E36] block">
                महत्वपूर्ण निर्देश (Important Notice):
              </span>
              <p className="text-[#9CA3AF] leading-relaxed">
                गाड़ी केवल वही व्यक्ति चला सकता है जिसके नाम पर बुकिंग और लाइसेंस सत्यापित है। किसी अनाधिकृत व्यक्ति को गाड़ी सौंपना प्रतिबंधित है।
              </p>
            </div>
          </div>

          {/* Right Column: Important Terms & Penalties */}
          <div className="lg:col-span-7 bg-[#161B22] rounded-2xl p-6 sm:p-7 border border-[#30363D] space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-[#30363D]">
              <div className="w-10 h-10 rounded-xl bg-[#21262D] border border-[#30363D] flex items-center justify-center text-[#E03E36]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold text-white">
                  देर से वापसी एवं नुकसान संबंधी नियम
                </h3>
                <span className="text-xs text-[#9CA3AF]">सुरक्षित संचालन हेतु स्पष्ट नियम</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Late Return Policy */}
              <div className="sm:col-span-2 p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-white">
                  <Clock className="w-4 h-4 text-[#E03E36]" />
                  <span>Late Return Policy (देर से वापसी नियम)</span>
                </div>
                <p className="text-[#9CA3AF]">
                  गाड़ी तय समय पर वापस करनी होगी ताकि अगली बुकिंग में देरी न हो।
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
                  <div className="p-3 rounded-lg bg-[#161B22] border border-[#30363D]">
                    <span className="text-[#E03E36] font-bold block">3 घंटे से अधिक देरी:</span>
                    <span className="text-[#9CA3AF]">आधे दिन (Half Day) का किराया लागू</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#161B22] border border-[#30363D]">
                    <span className="text-[#E03E36] font-bold block">12 घंटे से अधिक देरी:</span>
                    <span className="text-[#9CA3AF]">पूरे दिन (Full Day) का अतिरिक्त किराया</span>
                  </div>
                </div>
              </div>

              {/* Over Speeding */}
              <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 font-bold text-sm text-white mb-1">
                    <Gauge className="w-4 h-4 text-[#E03E36]" />
                    <span>Over Speeding Fine</span>
                  </div>
                  <p className="text-[#9CA3AF] leading-relaxed">
                    सुरक्षित गति सीमा (Speed Limit) <strong className="text-white">110 km/h</strong> निर्धारित है।
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-[#161B22] border border-[#30363D] text-white text-xs mt-2">
                  110 से ऊपर चलाने पर टेलीमैटिक्स द्वारा <strong className="text-[#E03E36]">₹2000/- का जुर्माना</strong> देय होगा।
                </div>
              </div>

              {/* Body Damage / Dent */}
              <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 font-bold text-sm text-white mb-1">
                    <ShieldAlert className="w-4 h-4 text-[#E03E36]" />
                    <span>Body Damage & Dents</span>
                  </div>
                  <p className="text-[#9CA3AF] leading-relaxed">
                    यात्रा के दौरान गाड़ी में किसी भी प्रकार का स्क्रैच, डेंट या बॉडी डैमेज।
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-[#161B22] border border-[#30363D] text-white text-xs mt-2">
                  उसका वास्तविक खर्च <strong className="text-[#E03E36]">(Authorized Repair Cost)</strong> देय होगा।
                </div>
              </div>

              {/* Clutch & Tyre Damage */}
              <div className="sm:col-span-2 p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-white">
                  <Wrench className="w-4 h-4 text-[#E03E36]" />
                  <span>Clutch & Tyre Damage (क्लच और टायर नुकसान)</span>
                </div>
                <p className="text-[#9CA3AF] leading-relaxed">
                  लापरवाही से क्लच प्लेट जलने या टायर कटने/क्षतिग्रस्त होने की स्थिति में वास्तविक मरम्मत खर्च देय होगा।
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
