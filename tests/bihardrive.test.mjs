import test from "node:test";
import assert from "node:assert/strict";

// 1. Pricing Calculations Test
function calculatePricingBreakdown(dailyPrice, days, isChauffeur, driverDailyRate, deposit) {
  const baseAmount = dailyPrice * days;
  const driverCharges = isChauffeur ? driverDailyRate * days : 0;
  const taxableRentalSubtotal = baseAmount + driverCharges;
  const taxesAmount = Math.round(taxableRentalSubtotal * 0.05); // 5% GST
  const totalAmount = baseAmount + driverCharges + deposit + taxesAmount;

  return {
    baseAmount,
    driverCharges,
    taxesAmount,
    totalAmount,
  };
}

test("Pricing Calculation: Self-Drive 3 Days", () => {
  const result = calculatePricingBreakdown(2000, 3, false, 600, 4000);
  assert.equal(result.baseAmount, 6000);
  assert.equal(result.driverCharges, 0);
  assert.equal(result.taxesAmount, 300); // 5% of 6000
  assert.equal(result.totalAmount, 10300); // 6000 + 4000 deposit + 300 tax
});

test("Pricing Calculation: Chauffeur-Driven 2 Days", () => {
  const result = calculatePricingBreakdown(3000, 2, true, 800, 5000);
  assert.equal(result.baseAmount, 6000);
  assert.equal(result.driverCharges, 1600);
  assert.equal(result.taxesAmount, 380); // 5% of 7600 = 380
  assert.equal(result.totalAmount, 12980); // 6000 + 1600 + 5000 + 380
});

// 2. Booking Date Conflict Detection Test
function hasDateConflict(existingBookings, reqStartStr, reqEndStr) {
  const reqStart = new Date(reqStartStr).getTime();
  const reqEnd = new Date(reqEndStr).getTime();

  return existingBookings.some((b) => {
    if (b.status === "CANCELLED" || b.status === "REJECTED") return false;
    const bStart = new Date(b.startDate).getTime();
    const bEnd = new Date(b.endDate).getTime();
    // Overlap: reqStart <= bEnd && reqEnd >= bStart
    return reqStart <= bEnd && reqEnd >= bStart;
  });
}

test("Booking Conflict Prevention: Overlapping Dates Rejected", () => {
  const existing = [
    { startDate: "2026-11-10", endDate: "2026-11-14", status: "CONFIRMED" },
  ];

  // Exactly overlapping
  assert.equal(hasDateConflict(existing, "2026-11-12", "2026-11-16"), true);
  // Enclosing
  assert.equal(hasDateConflict(existing, "2026-11-09", "2026-11-15"), true);
  // Same start
  assert.equal(hasDateConflict(existing, "2026-11-10", "2026-11-12"), true);
});

test("Booking Conflict Prevention: Non-Overlapping Dates Accepted", () => {
  const existing = [
    { startDate: "2026-11-10", endDate: "2026-11-14", status: "CONFIRMED" },
  ];

  // Completely before
  assert.equal(hasDateConflict(existing, "2026-11-01", "2026-11-08"), false);
  // Completely after
  assert.equal(hasDateConflict(existing, "2026-11-16", "2026-11-20"), false);
});

test("Booking Conflict Prevention: Cancelled Bookings Do Not Block Dates", () => {
  const existing = [
    { startDate: "2026-11-10", endDate: "2026-11-14", status: "CANCELLED" },
  ];

  assert.equal(hasDateConflict(existing, "2026-11-11", "2026-11-13"), false);
});

// 3. District Canonical & Aliases Lookup Test
const DISTRICTS = [
  { name: "Gaya", slug: "gaya", aliases: ["Gaya Ji", "Bodh Gaya"] },
  { name: "East Champaran", slug: "east-champaran", aliases: ["Motihari"] },
  { name: "West Champaran", slug: "west-champaran", aliases: ["Bettiah"] },
  { name: "Rohtas", slug: "rohtas", aliases: ["Sasaram"] },
  { name: "Saran", slug: "saran", aliases: ["Chhapra"] },
];

function findDistrict(query) {
  const clean = query.trim().toLowerCase();
  return DISTRICTS.find((d) => {
    if (d.slug === clean) return true;
    if (d.name.toLowerCase() === clean) return true;
    return d.aliases.some((a) => a.toLowerCase().includes(clean) || clean.includes(a.toLowerCase()));
  });
}

test("District Aliases Resolution", () => {
  assert.equal(findDistrict("Gaya Ji")?.name, "Gaya");
  assert.equal(findDistrict("Motihari")?.name, "East Champaran");
  assert.equal(findDistrict("Bettiah")?.name, "West Champaran");
  assert.equal(findDistrict("Sasaram")?.name, "Rohtas");
  assert.equal(findDistrict("Chhapra")?.name, "Saran");
});
