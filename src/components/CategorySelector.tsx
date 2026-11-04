import Link from "next/link";

export function CategorySelector() {
  const categories = [
    {
      key: "HATCHBACK",
      label: "Hatchback",
      subtitle: "Swift, Baleno",
      desc: "City agility & high mileage for narrow streets and market runs.",
      count: "From ₹1,950/day",
    },
    {
      key: "SEDAN",
      label: "Sedan",
      subtitle: "Dzire, Honda City",
      desc: "Executive boot space and smooth highway suspension.",
      count: "From ₹2,100/day",
    },
    {
      key: "COMPACT_SUV",
      label: "Compact SUV",
      subtitle: "Creta, Brezza",
      desc: "High clearance for state highways and connecting roads.",
      count: "From ₹3,400/day",
    },
    {
      key: "SUV",
      label: "SUV & 4x4",
      subtitle: "Scorpio-N, Thar",
      desc: "Commanding road authority and rugged all-terrain capability.",
      count: "From ₹3,800/day",
    },
    {
      key: "MUV_MPV",
      label: "MUV / 7-Seater",
      subtitle: "Ertiga, Innova Crysta",
      desc: "Full family comfort with rear AC and ample luggage capacity.",
      count: "From ₹2,600/day",
    },
    {
      key: "ELECTRIC",
      label: "Electric (EV)",
      subtitle: "Nexon EV Long Range",
      desc: "Zero emissions, instant torque, and fast charging compatible.",
      count: "From ₹2,900/day",
    },
    {
      key: "PREMIUM_SUV",
      label: "Premium SUV",
      subtitle: "Fortuner Legender",
      desc: "Flagship presence for long highway runs and heavy corridors.",
      count: "From ₹6,500/day",
    },
    {
      key: "WEDDING_EVENT",
      label: "Wedding & VIP",
      subtitle: "Audi A6, Luxury Chauffeur",
      desc: "Uniformed chauffeur with formal etiquette and floral mounting.",
      count: "From ₹11,500/day",
    },
  ];

  return (
    <section className="py-12 border-b border-[#2B352E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#387F66]">
              Fleet Categories
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#EEF0EB] mt-1">
              Purpose-built cars for every Bihar road
            </h2>
          </div>
          <Link
            href="/cars"
            className="text-xs font-semibold text-[#387F66] hover:underline underline-offset-4"
          >
            Browse All Categories &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={`/cars?category=${cat.key}`}
              className="group bg-[#181E19] p-5 rounded-xl border border-[#2B352E] hover:border-[#387F66] transition-all flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif text-base font-bold text-[#EEF0EB] group-hover:text-[#387F66] transition-colors">
                    {cat.label}
                  </span>
                  <span className="text-[11px] font-semibold text-[#D4A359]">
                    {cat.count}
                  </span>
                </div>
                <div className="text-xs font-medium text-[#387F66] mb-1.5">
                  {cat.subtitle}
                </div>
                <p className="text-xs text-[#8E9991] leading-relaxed">
                  {cat.desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#2B352E] flex items-center justify-between text-[11px] text-[#8E9991] group-hover:text-[#EEF0EB]">
                <span>View listings</span>
                <span className="font-bold text-[#387F66]">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
