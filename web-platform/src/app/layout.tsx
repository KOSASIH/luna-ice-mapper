import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Luna Ice Mapper | 6U CubeSat Lunar South Pole Mapping Platform",
  description: "Indonesia-led & NASA CSLI partnered 6U CubeSat mission mapping water-ice deposits and hydrogen concentrations in Lunar South Pole Permanently Shadowed Regions (PSRs).",
  keywords: ["Luna Ice Mapper", "6U CubeSat", "BRIN", "NASA CSLI", "Lunar Water Ice", "Permanently Shadowed Regions", "Neutron Spectrometer", "InGaAs Camera", "Artemis Program", "ISRU"],
  authors: [{ name: "Luna Ice Mapper Science & Engineering Team" }],
  openGraph: {
    title: "Luna Ice Mapper Web Platform",
    description: "Mapping Lunar South Polar Water Ice for Science & Human Exploration",
    type: "website",
    siteName: "Luna Ice Mapper",
  },
};

export const viewport: Viewport = {
  themeColor: "#030712",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="bg-space bg-stars text-slate-100 min-h-screen flex flex-col antialiased selection:bg-sky-500/30 selection:text-sky-300">
        <div className="fixed inset-0 bg-radial-gradient pointer-events-none z-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-950/20 via-transparent to-transparent" />
        <Navbar />
        <main className="flex-1 z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
