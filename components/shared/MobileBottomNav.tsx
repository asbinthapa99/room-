"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, Search, MessageSquare, Heart, User } from "lucide-react"
import { LimelightNav } from "@/components/ui/limelight-nav"
import { isClerkConfigured } from "@/lib/clerk-config"
import { useUser } from "@clerk/nextjs"

type NavEntry = {
  id: string
  label: string
  icon: React.ReactElement
  href: string
  authRequired?: boolean
  guestHref?: string
}

const NAV_ENTRIES: NavEntry[] = [
  { id: "home",     label: "Home",     icon: <Home />,          href: "/" },
  { id: "browse",   label: "Browse",   icon: <Search />,        href: "/listings" },
  { id: "messages", label: "Messages", icon: <MessageSquare />, href: "/dashboard/messages", authRequired: true, guestHref: "/sign-in" },
  { id: "saved",    label: "Saved",    icon: <Heart />,         href: "/dashboard/saved",    authRequired: true, guestHref: "/sign-in" },
  { id: "account",  label: "Account",  icon: <User />,          href: "/dashboard",          authRequired: true, guestHref: "/sign-in" },
]

function NavContent() {
  const pathname = usePathname()
  const router = useRouter()
  const { isSignedIn } = useUser()

  const activeIndex = NAV_ENTRIES.findIndex(({ href }) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  })

  const items = NAV_ENTRIES.map((entry) => ({
    id: entry.id,
    label: entry.label,
    icon: entry.icon,
    onClick: () => {
      const dest = entry.authRequired && !isSignedIn
        ? (entry.guestHref ?? "/sign-in")
        : entry.href
      router.push(dest)
    },
  }))

  return (
    <LimelightNav
      items={items}
      activeIndex={activeIndex === -1 ? 0 : activeIndex}
      className="w-full max-w-sm rounded-2xl"
    />
  )
}

function GuestNavContent() {
  const pathname = usePathname()
  const router = useRouter()

  const GUEST_ENTRIES = NAV_ENTRIES.map((e) => ({
    ...e,
    href: e.authRequired ? (e.guestHref ?? "/sign-in") : e.href,
  }))

  const activeIndex = GUEST_ENTRIES.findIndex(({ href }) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  })

  const items = GUEST_ENTRIES.map((entry) => ({
    id: entry.id,
    label: entry.label,
    icon: entry.icon,
    onClick: () => router.push(entry.href),
  }))

  return (
    <LimelightNav
      items={items}
      activeIndex={activeIndex === -1 ? 0 : activeIndex}
      className="w-full max-w-sm rounded-2xl"
    />
  )
}

export function MobileBottomNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-4 pt-2"
      style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
    >
      {isClerkConfigured ? <NavContent /> : <GuestNavContent />}
    </div>
  )
}
