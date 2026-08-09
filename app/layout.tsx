import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lumenary Desk | Private Desktop-Produktivitätssuite",
  description:
    "Kaufen Sie Lumenary Desk, eine private Desktop-Produktivitätssuite für Mail, Passwörter, Kalender, Dateien, Notizen und Fokusarbeit.",
  openGraph: {
    title: "Lumenary Desk",
    description: "Private Arbeit, ruhig organisiert.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumenary Desk",
    description: "Private Arbeit, ruhig organisiert.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
