import Link from "next/link";
import { store } from "@/lib/store";
import { BIHAR_DISTRICTS } from "@/data/districts";
import { SearchPanel } from "@/components/SearchPanel";
import { CategorySelector } from "@/components/CategorySelector";
import { VehicleCard } from "@/components/VehicleCard";
import {
  ShieldCheck,
  Calendar,
  CheckCircle2,
  FileCheck,
  MapPin,
  ArrowRight,
  Plane,
  MessageCircle,
} from "lucide-react";

export default function HomePage() {
  // Only active cars visible to public
  const featuredCars = store.getVehicles({ onlyActive: true }).slice(0, 6);
  const keyDistricts = BIHAR_DISTRICTS.filter((d) => d.isPopular);

  return (
    <div className="space-y-0 text-[#EEF0EB]">
      {/* Editorial Hero Section */}
      <section className="relative pt-8 pb-14 sm:pb-20 border-b border-[#2B352E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#162E24] text-[#387F66] text-xs font-semibold tracking-wide border border-[#2D6A54]/30">
                <span>Serving All 38 Districts of Bihar</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#EEF0EB] leading-[1.12]">
                Your next drive <br />
                <span className="italic font-normal text-[#387F66]">starts in Bihar.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#8E9991] max-w-xl leading-relaxed">
                Rent verified self-drive hatchbacks, rugged 4x4 SUVs, and executive chauffeur sedans delivered across Patna Airport, Bodh Gaya, Mithila, and district hubs. Direct WhatsApp booking.
              </p>

              {/* Verified Features Row */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#EEF0EB] font-medium pt-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#387F66]" />
                  <span>No security deposit forfeiture traps</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#387F66]" />
                  <span>Transparent 250 km/day allowance</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#387F66]" />
                  <span>Clean commercial RTO registration</span>
                </div>
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="pt-2 flex items-center gap-3">
                <a
                  href="https://wa.me/919354035140"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold transition-all shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Instant WhatsApp Booking: +91 93540 35140</span>
                </a>
              </div>
            </div>

            {/* Right Editorial Vehicle Imagery */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-[#2B352E] shadow-lg bg-[#181E19]">
                <img
                  src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"
                  alt="BiharDrive Fleet Car in Bihar"
                  className="w-full h-80 sm:h-96 object-cover object-center"
                />
                <div className="p-4 bg-[#181E19] border-t border-[#2B352E] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#EEF0EB] block font-serif text-sm">
                      Mahindra Scorpio-N 4x4
                    </span>
                    <span className="text-[#8E9991]">
                      Available at Patna Airport & Darbhanga Hubs
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-[#101411] border border-[#2B352E] font-bold text-[#387F66]">
                    ₹4,200/day
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Search Panel */}
          <div className="mt-10 lg:mt-12">
            <SearchPanel />
          </div>
        </div>
      </section>

      {/* Fleet Categories */}
      <CategorySelector />

      {/* Featured Fleet Section */}
      <section className="py-16 border-b border-[#2B352E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#387F66]">
                Available Cars
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#EEF0EB] mt-1">
                Featured cars ready for rental
              </h2>
            </div>
            <Link
              href="/cars"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#387F66] hover:underline transition-colors"
            >
              <span>View all available fleet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.map((car) => (
              <VehicleCard key={car.id} vehicle={car} />
            ))}
          </div>
        </div>
      </section>

      {/* District Coverage Section */}
      <section className="py-16 border-b border-[#2B352E] bg-[#141A15]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#387F66]">
                Statewide Network
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#EEF0EB] mt-1">
                Browse cars by district & transit hubs
              </h2>
              <p className="text-sm text-[#8E9991] mt-1 max-w-xl">
                Direct vehicle pickup at Jay Prakash Narayan Airport (PAT), Darbhanga Airport (DHR), Gaya Airport (GAY), and district headquarters across Bihar.
              </p>
            </div>
            <Link
              href="/districts"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#387F66] hover:underline"
            >
              <span>See all 38 districts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {keyDistricts.map((d) => (
              <Link
                key={d.slug}
                href={`/cars/${d.slug}`}
                className="group bg-[#181E19] p-5 rounded-xl border border-[#2B352E] hover:border-[#387F66] transition-all flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-serif text-lg font-bold text-[#EEF0EB] group-hover:text-[#387F66] transition-colors">
                      {d.name}
                    </h3>
                    <span className="text-[11px] text-[#8E9991] font-medium">
                      {d.slug === "patna" ? "Airport + Rly" : "Active Hub"}
                    </span>
                  </div>
                  <p className="text-xs text-[#8E9991] line-clamp-2 leading-relaxed mb-3">
                    {d.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#2B352E] flex items-center justify-between text-xs text-[#387F66] font-semibold">
                  <span>Explore Cars in {d.name}</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How Booking Works */}
      <section id="how-it-works" className="py-16 border-b border-[#2B352E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#387F66]">
              Simple Booking
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#EEF0EB] mt-1">
              How renting on BiharDrive works
            </h2>
            <p className="text-sm text-[#8E9991] mt-1">
              Select your vehicle, fill basic trip dates, and get instantly routed to our WhatsApp desk.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-[#181E19] p-6 rounded-xl border border-[#2B352E] space-y-3 shadow-xs">
              <span className="font-serif text-3xl font-bold text-[#387F66]/30 block">
                01
              </span>
              <h3 className="font-serif text-base font-bold text-[#EEF0EB]">
                Select Vehicle & Dates
              </h3>
              <p className="text-xs text-[#8E9991] leading-relaxed">
                Choose from hatchbacks, sedans, 4x4 SUVs, or wedding motorcades across Patna, Gaya, Darbhanga, or your district.
              </p>
            </div>

            <div className="bg-[#181E19] p-6 rounded-xl border border-[#2B352E] space-y-3 shadow-xs">
              <span className="font-serif text-3xl font-bold text-[#387F66]/30 block">
                02
              </span>
              <h3 className="font-serif text-base font-bold text-[#EEF0EB]">
                Self-Drive or Chauffeur
              </h3>
              <p className="text-xs text-[#8E9991] leading-relaxed">
                Pick self-drive (requires driving license) or request an experienced uniform driver familiar with Bihar highway routes.
              </p>
            </div>

            <div className="bg-[#181E19] p-6 rounded-xl border border-[#2B352E] space-y-3 shadow-xs">
              <span className="font-serif text-3xl font-bold text-[#387F66]/30 block">
                03
              </span>
              <h3 className="font-serif text-base font-bold text-[#EEF0EB]">
                WhatsApp Confirmation
              </h3>
              <p className="text-xs text-[#8E9991] leading-relaxed">
                Booking details route immediately to our team at <strong>+91 93540 35140</strong> on WhatsApp to finalize pickup point and timing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Operations Standards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#387F66]">
                Operational Standards
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#EEF0EB]">
                Built for reliability on Bihar roads
              </h2>
              <p className="text-sm text-[#8E9991] leading-relaxed">
                Clear pricing, genuine RTO registration, transparent kilometer allowances, and dedicated WhatsApp support on <strong className="text-[#EEF0EB]">+91 93540 35140</strong>.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#181E19] p-5 rounded-xl border border-[#2B352E] space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-[#EEF0EB]">
                  <ShieldCheck className="w-4 h-4 text-[#387F66]" />
                  <span>250 KM Included Daily</span>
                </div>
                <p className="text-xs text-[#8E9991] leading-relaxed">
                  Generous 250 km/day travel allowance with disclosed extra-km rates. No hidden garage fees.
                </p>
              </div>

              <div className="bg-[#181E19] p-5 rounded-xl border border-[#2B352E] space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-[#EEF0EB]">
                  <Plane className="w-4 h-4 text-[#387F66]" />
                  <span>Airport Handover</span>
                </div>
                <p className="text-xs text-[#8E9991]">
                  Prompt handover at Patna Airport (PAT) and Darbhanga Airport terminal parking.
                </p>
              </div>

              <div className="bg-[#181E19] p-5 rounded-xl border border-[#2B352E] space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-[#EEF0EB]">
                  <FileCheck className="w-4 h-4 text-[#387F66]" />
                  <span>Prompt Deposit Return</span>
                </div>
                <p className="text-xs text-[#8E9991] leading-relaxed">
                  Refundable security deposits returned within 24 hours of vehicle return inspection.
                </p>
              </div>

              <div className="bg-[#181E19] p-5 rounded-xl border border-[#2B352E] space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-[#EEF0EB]">
                  <Calendar className="w-4 h-4 text-[#387F66]" />
                  <span>No Login Needed</span>
                </div>
                <p className="text-xs text-[#8E9991] leading-relaxed">
                  Rent without account creation hassles. Everything coordinates directly via WhatsApp and phone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
