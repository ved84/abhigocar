import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Rental Agreement Terms & Policies | abhigocar",
  description: "Terms and conditions for self-drive and chauffeur vehicle rentals in Bihar.",
};

export default function TermsPage() {
  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#285746]">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </Link>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#285746]">
            Platform Policy
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#202622] mt-1">
            Rental Agreement & Operational Terms
          </h1>
          <p className="text-xs text-[#626A64] mt-1">
            Last updated: November 2026 • Governing vehicle operations across all 38 districts of Bihar.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#DFE2DB] space-y-6 text-xs text-[#626A64] leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-[#202622]">1. Driver Eligibility & KYC</h2>
            <p>
              For self-drive rentals, the primary renter must be at least 21 years of age and hold an original, valid Indian Driving License for the vehicle category for a minimum of 1 year. An Aadhaar card or Passport must be verified upon vehicle handover.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-[#202622]">2. Kilometer Allowance & Fuel Reconciliation</h2>
            <p>
              Daily rental rates include an allowance of 250 km per 24-hour cycle. Odometer readings recorded at pickup and return determine excess kilometer fees (charged between ₹11 to ₹24 per km depending on vehicle segment). The vehicle must be returned with the equivalent fuel level as provided at handover.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-[#202622]">3. Security Deposit & Damage Policy</h2>
            <p>
              A refundable security deposit is held for the duration of the rental. Deposits are processed for return within 24 hours of inspection. Minor wear and tear from normal road use is excluded; physical dents, panel damage, or interior stains are assessed against authorized service center estimates.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-base font-bold text-[#202622]">4. Speed Limits & Safety</h2>
            <p>
              All rental cars are equipped with speed monitoring devices. A maximum speed limit of 100 km/h applies on highways. Sustained overspeeding generates automated warnings and may incur a violation fee.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-[#202622]">5. Inter-State Travel</h2>
            <p>
              Vehicles may be operated outside Bihar (including Jharkhand, West Bengal, and Uttar Pradesh) provided prior notice is given to the operations desk. State passenger entry road taxes and Fastag highway tolls are borne by the renter.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
