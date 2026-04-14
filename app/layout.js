import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PreloadResources from "./preload-resources";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
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
    images: ["/meta.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "UCard",
    description: "The premium Mastercard designed for your digital wealth.",
    images: ["/meta.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PreloadResources />
        {children}
      </body>
    </html>
  );
}
