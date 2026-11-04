# BiharDrive (बिहार ड्राइव)
> Production-oriented car rental marketplace for all 38 districts of Bihar, India.

BiharDrive connects travelers with verified rental vehicles across Patna, Gaya, Darbhanga, Muzaffarpur, Bhagalpur, and all Bihar districts. Bookings are instantly routed to WhatsApp dispatch at **+91 93540 35140** with zero login/signup required for customers.

---

## Architecture & Features

1. **Zero Customer Friction (No Login or Sign-up)**
   - Customers discover cars by district, category, price, and dates.
   - Transparent daily pricing with 250 km/day included and refundable security deposits.
   - Upon submitting a booking request, the customer is routed directly to WhatsApp (**+91 93540 35140**) with a pre-filled, formatted booking summary.

2. **Protected Admin Console (`/admin`)**
   - Protected by a single configurable **Admin Master Password** (set in `.env`).
   - Admin can add, edit, archive, activate, or delete car listings.
   - Manage multiple car photos, daily rates, deposits, and private RTO registration plates.
   - View booking calendar and block vehicle maintenance dates to prevent double-booking.
   - Manage incoming booking requests and mark payment statuses.

3. **Firebase Cloud Firestore Ready (Prisma Removed)**
   - Configured with official Firebase SDK (`firebase`).
   - Comes with a modular data service (`src/lib/firebaseDb.ts`) that serves vehicles and bookings.
   - When you are ready to connect your Firebase project, simply paste your keys into `.env`.

4. **All 38 Bihar Districts & Transit Hubs**
   - Covers all 38 districts with canonical names and regional aliases (Gaya Ji, Motihari, Bettiah, Sasaram, Chhapra).
   - Dedicated transit hubs at **Patna Airport (PAT)**, **Darbhanga Airport (DHR)**, **Gaya Airport (GAY)**, and key railway junctions.

5. **Bespoke Warm Automotive Design System**
   - Warm stone ivory background (`#ECE8DF`) with subtle surfaces (`#FAF8F3`), rich forest green actions (`#20493A`), and crisp structured borders (`#D2CDC1`).
   - Anti-AI-slop compliance: no purple gradients, no floating blobs, no fake customer reviews, no generic templates.

---

## Getting Started

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment Variables
Edit [.env](file:///C:/car%20rentel/.env):
```env
NEXT_PUBLIC_APP_NAME="BiharDrive"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_SUPPORT_PHONE="+91 93540 35140"
NEXT_PUBLIC_WHATSAPP_NUMBER="919354035140"

# Admin Master Password (access /admin)
ADMIN_PASSWORD="bihardrive2026"

# Firebase Cloud Firestore Configuration (paste when ready)
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
```

### 3. Run Development Server
```bash
pnpm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Admin Access
- Navigate to: [http://localhost:3000/admin](http://localhost:3000/admin)
- Password: `bihardrive2026` (or whatever password you set in `ADMIN_PASSWORD`)

### 5. Run Test Suite
```bash
pnpm test
```

---

## Fleet Categories Supported
- **Hatchback:** Maruti Swift, Baleno
- **Sedan:** Maruti Dzire, Honda City
- **Compact SUV:** Hyundai Creta
- **SUV & 4x4:** Mahindra Scorpio-N, Mahindra Thar
- **MUV / 7-Seater:** Maruti Ertiga, Toyota Innova Crysta
- **Premium SUV:** Toyota Fortuner Legender
- **Electric (EV):** Tata Nexon EV Empowered Long Range
- **Wedding / VIP:** Audi A6 Luxury Chauffeur

---

## License
Proprietary • BiharDrive Technologies, Patna, Bihar.
