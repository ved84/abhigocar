const fs = require('fs');
const content = fs.readFileSync('src/data/mockVehicles.ts', 'utf8');

// Simple regex to parse vehicles
const vehicleBlocks = content.split(/id:\s*"/g).slice(1);
const vehicles = vehicleBlocks.map(block => {
  const idMatch = block.match(/^([^"]+)/);
  const slugMatch = block.match(/slug:\s*"([^"]+)"/);
  const districtMatch = block.match(/districtId:\s*"([^"]+)"/);
  const makeMatch = block.match(/make:\s*"([^"]+)"/);
  const modelMatch = block.match(/model:\s*"([^"]+)"/);
  const activeMatch = block.match(/isActive:\s*(true|false)/);
  const featuredMatch = block.match(/isFeatured:\s*(true|false)/);
  const imgMatch = block.match(/url:\s*"([^"]+)"/);

  return {
    id: idMatch ? idMatch[1] : null,
    slug: slugMatch ? slugMatch[1] : null,
    districtId: districtMatch ? districtMatch[1] : null,
    name: `${makeMatch ? makeMatch[1] : ''} ${modelMatch ? modelMatch[1] : ''}`,
    isActive: activeMatch ? activeMatch[1] : null,
    isFeatured: featuredMatch ? featuredMatch[1] : null,
    image: imgMatch ? imgMatch[1] : null
  };
});

console.log(JSON.stringify(vehicles, null, 2));

