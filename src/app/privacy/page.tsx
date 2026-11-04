import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy & Data Security | BiharDrive",
  description: "How BiharDrive handles customer verification and identity records.",
};

export default function PrivacyPage() {
  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#285746]">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </Link>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#285746]">
            Legal
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#202622] mt-1">
            Privacy Policy & Data Handling
          </h1>
          <p className="text-xs text-[#626A64] mt-1">
            Compliant with the Digital Personal Data Protection Act, 2023 (DPDP).
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#DFE2DB] space-y-6 text-xs text-[#626A64] leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-[#202622]">1. Information Collected</h2>
            <p>
              We collect full name, phone number, email address, driving license identifier, and address proof for vehicle verification and legal compliance under Motor Vehicles Act, 1988.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-[#202622]">2. Telematics & GPS Location Data</h2>
            <p>
              Vehicle position, odometer readings, and speed metrics are recorded in real-time solely to ensure passenger safety, route compliance, and emergency breakdown response. This data is retained strictly for the rental duration and required statutory audit periods.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-[#202622]">3. Third-Party Sharing</h2>
            <p>
              We never sell your contact information to commercial advertising networks. Data is shared exclusively with insurance adjusters in event of accident claims or law enforcement authorities upon statutory warrant.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
