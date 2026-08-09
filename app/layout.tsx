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
  title: "Lumenary Desk | Privates Desktop-E-Mail-Programm",
  description:
    "Kaufen Sie Lumenary Desk, ein eigenständiges Desktop-E-Mail-Programm für mehrere Postfächer, Kalender, Kontakte, Aufgaben und Offline-Suche.",
  openGraph: {
    title: "Lumenary Desk",
    description: "E-Mail, Kalender und Kontakte ruhig organisiert.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumenary Desk",
    description: "E-Mail, Kalender und Kontakte ruhig organisiert.",
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
