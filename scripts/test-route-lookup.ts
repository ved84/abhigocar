import { store } from "../src/lib/store";
import { BIHAR_DISTRICTS, findDistrict } from "../src/data/districts";

const activeVehicles = store.getVehicles({ onlyActive: true });
console.log(`Total active vehicles: ${activeVehicles.length}`);

for (const v of activeVehicles) {
  const bySlug = store.getVehicleBySlug(v.slug);
  const byId = store.getVehicleById(v.id);
  const district = findDistrict(v.districtId);
  const expectedUrl = `/cars/${v.districtId}/${v.slug}`;
  console.log(`Checking [${v.id}] ${v.make} ${v.model} (${v.districtId}):`);
  console.log(`  URL: ${expectedUrl}`);
  console.log(`  bySlug match: ${bySlug ? "OK" : "FAILED"}`);
  console.log(`  byId match: ${byId ? "OK" : "FAILED"}`);
  console.log(`  district valid: ${district ? "OK (" + district.name + ")" : "FAILED"}`);
}

