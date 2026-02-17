import type { Metadata } from "next";
import { Inter, Montserrat, Poppins, Roboto, Bebas_Neue } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CaptionCraft - Auto Captions for Your Reels",
  description: "Generate beautiful captions for your Instagram reels, TikToks, and YouTube Shorts. Choose from multiple styles and fonts.",
  keywords: ["captions", "subtitles", "video", "instagram", "reels", "tiktok", "shorts"],
  authors: [{ name: "CaptionCraft" }],
  openGraph: {
    title: "CaptionCraft - Auto Captions for Your Reels",
    description: "Generate beautiful captions for your videos",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`
          ${inter.variable} 
          ${montserrat.variable} 
          ${poppins.variable} 
          ${roboto.variable} 
          ${bebasNeue.variable} 
          font-sans antialiased
          bg-gray-950 text-white min-h-screen
        `}
      >
        {children}
      </body>
    </html>
  );
}
