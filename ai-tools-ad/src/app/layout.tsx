import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/hooks/use-theme";
import { NavBar } from "@/components/layout/nav-bar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Tools - Discover the Best AI Tools",
  description: "A curated collection of the best AI tools to boost your productivity and creativity",
  openGraph: {
    title: "AI Tools - Discover the Best AI Tools",
    description: "A curated collection of the best AI tools to boost your productivity and creativity",
    url: "https://aitools-example.com",
    siteName: "AI Tools Directory",
    images: [
      {
        url: "https://aitools-example.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AI Tools Directory",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="dark">
          <NavBar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
