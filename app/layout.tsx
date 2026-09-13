import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";

const inter = Inter({ variable: "--font-sans", subsets: ["latin"] });
const merriweather = Merriweather({ variable: "--font-serif", subsets: ["latin"], weight: ["700", "900"] });

export const metadata: Metadata = {
  title: "UNIZIK MailGuard",
  description: "Machine-learning spam email detection for the UNIZIK community.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${merriweather.variable}`}><AuthProvider>{children}</AuthProvider></body>
    </html>
  );
}
