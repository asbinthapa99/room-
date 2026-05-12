"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Home, Search, MessageSquare, Heart, PlusCircle, MenuIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { isClerkConfigured } from "@/lib/clerk-config";
import { MetalButton } from "@/components/ui/liquid-glass-button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button-1";

export function Navbar() {
  const pathname = usePathname();

  const features = [
    {
      title: "Browse Rooms",
      description: "Search verified listings in your city",
      href: "/listings",
    },
    {
      title: "Dashboard",
      description: "Manage your bookings and listings",
      href: "/dashboard",
    },
    {
      title: "Messages",
      description: "Chat with landlords directly",
      href: "/dashboard/messages",
      auth: true,
    },
    {
      title: "Saved Rooms",
      description: "View your saved listings",
      href: "/dashboard/saved",
      auth: true,
    },
    {
      title: "Post a Room",
      description: "List your room for free",
      href: "/dashboard/listings/new",
      auth: true,
    },
    {
      title: "Settings",
      description: "Manage your account",
      href: "/dashboard/settings",
      auth: true,
    },
  ];

  const mobileLinks = [
    { label: "Browse Rooms", href: "/listings" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Messages", href: "/dashboard/messages", auth: true },
    { label: "Saved", href: "/dashboard/saved", auth: true },
    { label: "Settings", href: "/dashboard/settings", auth: true },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-nav">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-600 shadow-sm">
              <Home className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight text-gray-900">NestMate</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] grid-cols-2 p-3">
                    {features.map((feature) => {
                      if (feature.auth && !isClerkConfigured) return null;
                      const showAuth = feature.auth ? <SignedIn key={feature.href}><NavigationLink feature={feature} /></SignedIn> : <NavigationLink key={feature.href} feature={feature} />;
                      return showAuth;
                    })}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/listings"
                  className={navigationMenuTriggerStyle()}
                >
                  Browse Rooms
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/dashboard"
                  className={navigationMenuTriggerStyle()}
                >
                  Dashboard
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {isClerkConfigured ? (
              <>
                <SignedIn>
                  <Link href="/dashboard/listings/new" className="hidden lg:inline-flex">
                    <MetalButton variant="primary" className="h-9 px-4 text-sm rounded-xl">
                      <PlusCircle className="h-4 w-4" /> Post a Room
                    </MetalButton>
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
                <SignedOut>
                  <Link href="/sign-in" className="hidden lg:inline-flex btn-secondary text-sm px-4 py-2">
                    Sign in
                  </Link>
                  <Link href="/sign-up" className="hidden lg:inline-flex btn-primary text-sm px-4 py-2">
                    Get started
                  </Link>
                </SignedOut>
              </>
            ) : (
              <>
                <Link href="/sign-in" className="hidden lg:inline-flex btn-secondary text-sm px-4 py-2">
                  Sign in
                </Link>
                <Link href="/sign-up" className="hidden lg:inline-flex btn-primary text-sm px-4 py-2">
                  Get started
                </Link>
              </>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" size="icon">
                  <MenuIcon className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="max-h-screen overflow-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link href="/" className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-600 shadow-sm">
                        <Home className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-lg font-semibold tracking-tight">NestMate</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col p-4">
                  <Accordion type="single" collapsible className="mt-4 mb-2">
                    <AccordionItem value="explore" className="border-none">
                      <AccordionTrigger className="text-base hover:no-underline">
                        Explore
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col gap-2">
                          {mobileLinks.map((link) => {
                            if (link.auth && !isClerkConfigured) return null;
                            const el = (
                              <Link
                                key={link.href}
                                href={link.href}
                                className="rounded-md p-3 transition-colors hover:bg-gray-100"
                              >
                                <p className="font-semibold text-gray-900">{link.label}</p>
                              </Link>
                            );
                            return link.auth ? <SignedIn key={link.href}>{el}</SignedIn> : el;
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <div className="flex flex-col gap-3 mt-4">
                    <SignedIn>
                      <Link href="/dashboard/listings/new" className="font-medium text-gray-900">
                        Post a Room
                      </Link>
                    </SignedIn>
                  </div>
                  <div className="mt-6 flex flex-col gap-3">
                    {isClerkConfigured ? (
                      <>
                        <SignedOut>
                          <Link href="/sign-in" className="w-full">
                            <Button variant="outline" className="w-full">Sign in</Button>
                          </Link>
                          <Link href="/sign-up" className="w-full">
                            <Button className="w-full">Get started</Button>
                          </Link>
                        </SignedOut>
                      </>
                    ) : (
                      <>
                        <Link href="/sign-in" className="w-full">
                          <Button variant="outline" className="w-full">Sign in</Button>
                        </Link>
                        <Link href="/sign-up" className="w-full">
                          <Button className="w-full">Get started</Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavigationLink({ feature }: { feature: { title: string; description: string; href: string; auth?: boolean } }) {
  return (
    <NavigationMenuLink
      href={feature.href}
      className="rounded-md p-3 transition-colors hover:bg-gray-100 block"
    >
      <p className="mb-1 font-semibold text-gray-900">{feature.title}</p>
      <p className="text-sm text-gray-500">{feature.description}</p>
    </NavigationMenuLink>
  );
}
