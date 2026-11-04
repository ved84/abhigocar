import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AbhigoCar | Premium Car Rentals in Bihar - Direct WhatsApp Booking",
  description:
    "Rent verified self-drive hatchbacks, executive sedans, 4x4 SUVs, and family MUVs across Patna, Gaya, Muzaffarpur, Darbhanga, and all 38 districts of Bihar. Instant WhatsApp booking: +91 85389 18819.",
  keywords: [
    "AbhigoCar",
    "Bihar car rental",
    "self drive cars Patna",
    "car rental Gaya",
    "car hire Muzaffarpur",
    "wedding luxury car Bihar",
    "car hire Darbhanga",
  ],
  authors: [{ name: "AbhigoCar Team" }],
  openGraph: {
    title: "AbhigoCar - Premium Car Rentals in Bihar",
    description: "Explore verified cars across Patna, Gaya, Muzaffarpur, Bhagalpur, and all 38 districts with instant WhatsApp booking.",
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
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} ${jakartaSans.variable}`}>
      <body suppressHydrationWarning className="min-h-screen flex flex-col bg-[#0E1216] text-[#F1F4F7] selection:bg-[#C63832] selection:text-white">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
