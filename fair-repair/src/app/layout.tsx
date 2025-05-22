import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Fair Repair",
    template: "%s | Fair Repair",
  },
  description: "Your guide to sustainable and repairable consumer electronics in the Benelux.",
  keywords: ["repair", "electronics", "sustainable", "smartphone", "laptop", "diy", "Benelux"],
  // Basis OpenGraph tags (kan uitgebreid worden)
  openGraph: {
    title: "Fair Repair",
    description: "Your guide to sustainable and repairable consumer electronics in the Benelux.",
    type: "website",
    locale: "nl_BE", // Pas aan indien nodig
    // url: "https://www.jouwwebsite.nl", // Voeg je domein toe
    // siteName: "Fair Repair",
    // images: [ // Voeg een default afbeelding toe
    //   {
    //     url: "https://www.jouwwebsite.nl/og-image.jpg",
    //     width: 1200,
    //     height: 630,
    //     alt: "Fair Repair Logo",
    //   },
    // ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        {children}
      </body>
    </html>
  );
}