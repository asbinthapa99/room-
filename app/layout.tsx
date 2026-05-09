import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: "RoomRent — Trusted Rooms for Students & Newcomers",
  description:
    "Find trusted rooms in London and Toronto. Verified listings for students and newcomers moving abroad.",
  keywords: ["room rental", "student housing", "London rooms", "Toronto rooms", "international students"],
  openGraph: {
    title: "RoomRent",
    description: "Find trusted rooms in London and Toronto.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
