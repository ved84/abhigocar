import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "abhicargo | Self-Drive & Chauffeur Car Rentals in Bihar",
  description:
    "Verified self-drive hatchbacks, executive sedans, 4x4 SUVs, and family MUVs across Patna, Gaya, Muzaffarpur, Darbhanga, and all 38 districts of Bihar. Direct WhatsApp booking: +91 85389 18819.",
  keywords: [
    "abhicargo",
    "Bihar car rental",
    "self drive cars Patna",
    "car rental Gaya",
    "car hire Muzaffarpur",
    "wedding luxury car Bihar",
    "car hire Darbhanga",
  ],
  authors: [{ name: "abhicargo Team" }],
  openGraph: {
    title: "abhicargo - Verified Cars Across Bihar",
    description: "Explore verified cars across Patna, Gaya, Muzaffarpur, Bhagalpur, and all 38 districts with direct WhatsApp dispatch.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen flex flex-col bg-[#0D1117] text-[#F0F6FC] selection:bg-[#C63832] selection:text-white">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
