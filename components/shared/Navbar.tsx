"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Home, Search, MessageSquare, Heart, PlusCircle, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/listings", label: "Browse Rooms", icon: Search },
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquare, auth: true },
    { href: "/dashboard/saved", label: "Saved", icon: Heart, auth: true },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-nav">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
              <Home className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold text-gray-900 tracking-tight">RoomRent</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-0.5">
            {links.map(({ href, label, auth }) => {
              const active = pathname.startsWith(href);
              const el = (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-sm font-medium transition-colors",
                    active ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  {label}
                </Link>
              );
              return auth ? <SignedIn key={href}>{el}</SignedIn> : el;
            })}
          </div>

          {/* Auth */}
          <div className="flex items-center gap-2.5">
            <SignedIn>
              <Link href="/dashboard/listings/new" className="hidden md:inline-flex btn-primary gap-2 text-xs px-3 py-2">
                <PlusCircle className="h-3.5 w-3.5" /> Post a Room
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in" className="hidden md:inline-flex btn-secondary text-xs px-3 py-2">Sign In</Link>
              <Link href="/sign-up" className="hidden md:inline-flex btn-primary text-xs px-3 py-2">Get Started</Link>
            </SignedOut>
            <button className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100" onClick={() => setOpen(!open)}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl px-4 py-3 space-y-1">
          {links.map(({ href, label, icon: Icon, auth }) => {
            const el = (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100">
                <Icon className="h-4 w-4 text-gray-500" /> {label}
              </Link>
            );
            return auth ? <SignedIn key={href}>{el}</SignedIn> : el;
          })}
          <SignedIn>
            <Link href="/dashboard/listings/new" onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-blue-700 bg-blue-50">
              <PlusCircle className="h-4 w-4" /> Post a Room
            </Link>
          </SignedIn>
          <SignedOut>
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
              <Link href="/sign-in" onClick={() => setOpen(false)} className="btn-secondary w-full justify-center">Sign In</Link>
              <Link href="/sign-up" onClick={() => setOpen(false)} className="btn-primary w-full justify-center">Get Started Free</Link>
            </div>
          </SignedOut>
        </div>
      )}
    </nav>
  );
}
