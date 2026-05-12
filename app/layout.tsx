import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { MobileBottomNav } from "@/components/shared/MobileBottomNav";
import { AlertProvider } from "@/components/providers/alert-provider";
import { isClerkConfigured } from "../lib/clerk-config";

export const metadata: Metadata = {
  title: "NestMate — Trusted Rooms for Students & Newcomers",
  description:
    "Find trusted rooms in London and Toronto. Verified listings for students and newcomers moving abroad.",
  keywords: ["room rental", "student housing", "London rooms", "Toronto rooms", "international students"],
  openGraph: {
    title: "NestMate",
    description: "Find trusted rooms in London and Toronto.",
    type: "website",
  },
};

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {/* pb-24 on mobile makes room for the bottom nav bar */}
      <main className="min-h-screen pb-24 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AlertProvider>
          {isClerkConfigured ? (
            <ClerkProvider>
              <AppShell>{children}</AppShell>
            </ClerkProvider>
          ) : (
            <AppShell>{children}</AppShell>
          )}
        </AlertProvider>
      </body>
    </html>
  );
}
