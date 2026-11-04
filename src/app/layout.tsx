import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Newsreader } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "BiharDrive | Authentic Car Rentals Across All 38 Bihar Districts",
  description:
    "Production vehicle rental marketplace for Bihar, India. Rent verified Hatchbacks, Sedans, SUVs, and Luxury vehicles for Self-Drive or Chauffeur services.",
  keywords: [
    "Bihar car rental",
    "self drive cars Patna",
    "car rental Gaya",
    "car hire Muzaffarpur",
    "wedding luxury car Bihar",
    "car hire Darbhanga",
  ],
  authors: [{ name: "BiharDrive Team" }],
  openGraph: {
    title: "BiharDrive - Your Next Drive Starts in Bihar",
    description: "Explore verified cars across Patna, Gaya, Muzaffarpur, Bhagalpur, and all 38 districts.",
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
    <html lang="en" className={`${jakartaSans.variable} ${newsreader.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#101411] text-[#EEF0EB]">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
