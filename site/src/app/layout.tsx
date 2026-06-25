import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { config } from "@/site.config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: {
    template: config.titleTemplate,
    default: config.titleDefault,
  },
  description: config.description,
  icons: {
    icon: config.favicon,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
