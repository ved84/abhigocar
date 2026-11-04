const fs = require('fs');
const path = require('path');
const https = require('https');

const targetDir = path.join(__dirname, '..', 'public', 'cars');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Map each car to authentic, reliable direct image sources
const cars = [
  {
    name: 'honda-city',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Honda_City_%28fifth_generation%29_facelift.jpg/1280px-Honda_City_%28fifth_generation%29_facelift.jpg'
  },
  {
    name: 'honda-city-interior',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Honda_City_5th_gen_face.jpg/1280px-Honda_City_5th_gen_face.jpg'
  },
  {
    name: 'maruti-swift',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Suzuki_Swift_2018.jpg/1280px-Suzuki_Swift_2018.jpg'
  },
  {
    name: 'maruti-baleno',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/2022_Maruti_Suzuki_Baleno_Alpha_%28India%29_front_view.jpg/1280px-2022_Maruti_Suzuki_Baleno_Alpha_%28India%29_front_view.jpg'
  },
  {
    name: 'hyundai-creta',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/2021_Hyundai_Creta_SX%28O%29_CRDi_%28India%29_front_view.jpg/1280px-2021_Hyundai_Creta_SX%28O%29_CRDi_%28India%29_front_view.jpg'
  },
  {
    name: 'mahindra-scorpio',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/2024_Mahindra_Scorpio_Z8L_front.jpg/1280px-2024_Mahindra_Scorpio_Z8L_front.jpg'
  },
  {
    name: 'mahindra-thar',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Mahindra_Thar.jpg/1280px-Mahindra_Thar.jpg'
  },
  {
    name: 'maruti-ertiga',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/2022_Maruti_Suzuki_Ertiga_LXi.jpg/1280px-2022_Maruti_Suzuki_Ertiga_LXi.jpg'
  },
  {
    name: 'toyota-innova-crysta',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Toyota_Innova_Crysta_2.4_Z_front_right.jpg/1280px-Toyota_Innova_Crysta_2.4_Z_front_right.jpg'
  },
  {
    name: 'tata-nexon',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Tata_Nexon_Blue_Dual_Tone.jpg/1280px-Tata_Nexon_Blue_Dual_Tone.jpg'
  },
  {
    name: 'audi-a6',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/2018_Audi_A6_S_Line_40_TDi_S-A_2.0.jpg/1280px-2018_Audi_A6_S_Line_40_TDi_S-A_2.0.jpg'
  },
  {
    name: 'toyota-fortuner',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Toyota_Fortuner_White.jpg/1280px-Toyota_Fortuner_White.jpg'
  },
  {
    name: 'maruti-dzire',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Maruti_Suzuki_Swift_Dzire_%28cropped%29.jpg/1280px-Maruti_Suzuki_Swift_Dzire_%28cropped%29.jpg'
  }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const req = https.get(
      url,
      {
        headers: {
          'User-Agent': 'BiharDriveFleetManager/1.0 (contact: info@bihardrive.com; https://bihardrive.com) Mozilla/5.0',
          'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8'
        }
      },
      (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          // Handle redirect
          return download(response.headers.location, dest).then(resolve).catch(reject);
        }
        if (response.statusCode !== 200) {
          file.close();
          fs.unlink(dest, () => {});
          return reject(new Error(`Status ${response.statusCode}`));
        }
        response.pipe(file);
        file.on('finish', () => {
          file.close(() => resolve(dest));
        });
      }
    );
    req.on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  for (const car of cars) {
    const dest = path.join(targetDir, `${car.name}.jpg`);
    console.log(`Downloading ${car.name}...`);
    try {
      await download(car.url, dest);
      const size = fs.statSync(dest).size;
      console.log(`✓ ${car.name}: ${(size / 1024).toFixed(1)} KB`);
    } catch (e) {
      console.error(`✗ ${car.name} failed:`, e.message);
    }
    // Polite 1.5s delay between requests to avoid rate limit
    await new Promise((r) => setTimeout(r, 1500));
  }
}

run();
