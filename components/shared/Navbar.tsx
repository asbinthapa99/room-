"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  Home, Search, MessageSquare, Heart, PlusCircle, Settings,
  LayoutDashboard, X, Menu, ArrowRight, ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { isClerkConfigured } from "@/lib/clerk-config";
import { MetalButton } from "@/components/ui/liquid-glass-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const NAV_LINKS = [
  { label: "Browse", href: "/listings" },
  { label: "Dashboard", href: "/dashboard" },
];

const EXPLORE_ITEMS = [
  { icon: Search, label: "Browse Rooms", desc: "Search verified listings in your city", href: "/listings" },
  { icon: LayoutDashboard, label: "Dashboard", desc: "Manage bookings and listings", href: "/dashboard" },
  { icon: MessageSquare, label: "Messages", desc: "Chat with landlords directly", href: "/dashboard/messages", auth: true },
  { icon: Heart, label: "Saved Rooms", desc: "View your saved listings", href: "/dashboard/saved", auth: true },
  { icon: PlusCircle, label: "Post a Room", desc: "List your room for free", href: "/dashboard/listings/new", auth: true },
  { icon: Settings, label: "Settings", desc: "Manage your account", href: "/dashboard/settings", auth: true },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close explore dropdown on route change
  useEffect(() => { setExploreOpen(false); setMobileOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/75 backdrop-blur-2xl border-b border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.07)]"
            : "bg-white/40 backdrop-blur-xl border-b border-white/30"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 shadow-md shadow-brand-600/30 group-hover:shadow-lg group-hover:shadow-brand-600/40 transition-shadow">
                <Home className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-base font-black tracking-tight text-gray-900">
                Room<span className="text-brand-600">Rent</span>
              </span>
            </Link>

            {/* ── Desktop nav ── */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Explore dropdown */}
              <div className="relative">
                <button
                  onClick={() => setExploreOpen(!exploreOpen)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                    exploreOpen
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                  )}
                >
                  Explore
                  <svg
                    className={cn("h-3.5 w-3.5 transition-transform duration-200", exploreOpen && "rotate-180")}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown panel */}
                {exploreOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setExploreOpen(false)} />
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[520px] z-50 animate-fade-up">
                      <div className="rounded-2xl bg-white/80 backdrop-blur-2xl border border-white/60 shadow-float overflow-hidden">
                        <div className="grid grid-cols-2 gap-1 p-2">
                          {EXPLORE_ITEMS.map((item) => {
                            const el = (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setExploreOpen(false)}
                                className={cn(
                                  "flex items-start gap-3.5 rounded-xl p-3.5 transition-all group/item",
                                  isActive(item.href)
                                    ? "bg-brand-50 hover:bg-brand-100"
                                    : "hover:bg-gray-50"
                                )}
                              >
                                <div className={cn(
                                  "p-2 rounded-lg shrink-0 transition-colors",
                                  isActive(item.href)
                                    ? "bg-brand-100"
                                    : "bg-gray-100 group-hover/item:bg-brand-50"
                                )}>
                                  <item.icon className={cn(
                                    "h-4 w-4 transition-colors",
                                    isActive(item.href) ? "text-brand-600" : "text-gray-500 group-hover/item:text-brand-600"
                                  )} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={cn(
                                    "text-sm font-semibold leading-none mb-1",
                                    isActive(item.href) ? "text-brand-700" : "text-gray-900"
                                  )}>{item.label}</p>
                                  <p className="text-xs text-gray-400 leading-snug">{item.desc}</p>
                                </div>
                              </Link>
                            );
                            return item.auth
                              ? <SignedIn key={item.href}>{el}</SignedIn>
                              : el;
                          })}
                        </div>

                        <Separator />
                        <div className="px-4 py-3 flex items-center justify-between bg-gray-50/50">
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <ShieldCheck className="h-3.5 w-3.5 text-brand-500" />
                            Every listing manually verified
                          </div>
                          <Link
                            href="/listings"
                            onClick={() => setExploreOpen(false)}
                            className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                          >
                            All rooms <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                    isActive(href)
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                  )}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* ── Right actions ── */}
            <div className="flex items-center gap-2.5">
              {isClerkConfigured ? (
                <>
                  <SignedOut>
                    <Button variant="ghost" size="sm" asChild className="hidden lg:inline-flex text-gray-600">
                      <Link href="/sign-in">Sign in</Link>
                    </Button>
                    <Button size="sm" asChild className="hidden lg:inline-flex">
                      <Link href="/sign-up">Get started</Link>
                    </Button>
                  </SignedOut>
                  <SignedIn>
                    <Link href="/dashboard/listings/new" className="hidden lg:block">
                      <MetalButton variant="primary" className="h-9 px-4 text-sm rounded-xl">
                        <PlusCircle className="h-3.5 w-3.5" /> Post a Room
                      </MetalButton>
                    </Link>
                    <div className="hidden lg:block">
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </SignedIn>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild className="hidden lg:inline-flex text-gray-600">
                    <Link href="/sign-in">Sign in</Link>
                  </Button>
                  <Button size="sm" asChild className="hidden lg:inline-flex">
                    <Link href="/sign-up">Get started</Link>
                  </Button>
                </>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={cn(
                  "lg:hidden flex items-center justify-center h-9 w-9 rounded-xl border transition-all",
                  mobileOpen
                    ? "bg-gray-900 border-gray-900 text-white"
                    : "bg-white/80 border-gray-200 text-gray-700 hover:bg-gray-50"
                )}
              >
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/40 bg-white/80 backdrop-blur-2xl animate-fade-up">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 space-y-1">
              {EXPLORE_ITEMS.map((item) => {
                const el = (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                      isActive(item.href)
                        ? "bg-brand-50 text-brand-700"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4 shrink-0", isActive(item.href) ? "text-brand-600" : "text-gray-400")} />
                    {item.label}
                  </Link>
                );
                return item.auth ? <SignedIn key={item.href}>{el}</SignedIn> : el;
              })}

              <Separator className="my-3" />

              {isClerkConfigured ? (
                <>
                  <SignedOut>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/sign-in">Sign in</Link>
                    </Button>
                    <Button className="w-full mt-2" asChild>
                      <Link href="/sign-up">Get started free</Link>
                    </Button>
                  </SignedOut>
                  <SignedIn>
                    <Button className="w-full" asChild>
                      <Link href="/dashboard/listings/new">
                        <PlusCircle className="h-4 w-4" /> Post a Room
                      </Link>
                    </Button>
                  </SignedIn>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/sign-in">Sign in</Link>
                  </Button>
                  <Button className="w-full mt-2" asChild>
                    <Link href="/sign-up">Get started free</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer so page content isn't hidden under fixed nav */}
      <div className="h-16" />
    </>
  );
}
