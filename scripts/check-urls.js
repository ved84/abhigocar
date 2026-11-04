const https = require('https');

const urls = [
  'https://upload.wikimedia.org/wikipedia/commons/4/45/Suzuki_Swift_2018.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/5/5b/2022_Maruti_Suzuki_Baleno_Alpha_%28India%29_front_view.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/9/98/Honda_City_%28fifth_generation%29_facelift.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/a/a4/Honda_City_5th_gen_face.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/7/7f/2021_Hyundai_Creta_SX%28O%29_CRDi_%28India%29_front_view.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/b/b4/2024_Mahindra_Scorpio_Z8L_front.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/2/2d/Mahindra_Thar.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/2/23/2022_Maruti_Suzuki_Ertiga_LXi.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/8/87/Toyota_Innova_Crysta_2.4_Z_front_right.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/2/25/Tata_Nexon_Blue_Dual_Tone.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/4/45/2018_Audi_A6_S_Line_40_TDi_S-A_2.0.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/5/54/Toyota_Fortuner_White.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/6/61/Maruti_Suzuki_Dzire_VXi_VVT_-_Subcompact_Car_-_Kolkata_2018-01-17_7574.JPG'
];

async function check() {
  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      console.log(res.status, url.split('/').pop().substring(0, 35));
    } catch (e) {
      console.log('FAIL', url, e.message);
    }
  }
}

check();
