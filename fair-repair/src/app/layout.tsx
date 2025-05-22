// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../app/styles/globals.css"; // Ensure Tailwind is imported

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // ... your metadata configuration ...
};

// 👇 THIS IS THE CRUCIAL PART
export default function RootLayout({ // Must be a default export and a function
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