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

export const metadata = {
  metadataBase: new URL("https://ucard.credit"),
  title: "UCard",
  description: "The premium Mastercard designed for your digital wealth.",
  icons: {
    icon: "/favicon.ico?v=2",
    shortcut: "/favicon.ico?v=2",
    apple: "/favicon.ico?v=2",
  },
  openGraph: {
    title: "UCard",
    description: "The premium Mastercard designed for your digital wealth.",
    url: "https://ucard.credit",
    siteName: "UCard",
    images: [
      {
        url: "/meta-og.jpg",
        width: 1200,
        height: 630,
        alt: "UCard",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UCard",
    description: "The premium Mastercard designed for your digital wealth.",
    images: ["/meta-og.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
