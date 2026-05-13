"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, MessageSquare, Heart, PlusCircle, Settings, LayoutDashboard, List,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/listings", label: "My Listings", icon: List },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/saved", label: "Saved Rooms", icon: Heart },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

interface Props {
  isLandlord: boolean;
}

export function DashboardNav({ isLandlord }: Props) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Desktop sidebar nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                active
                  ? "bg-brand-50 text-brand-700 shadow-[inset_0_0_0_1px_rgba(225,29,72,0.12)]"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 flex-shrink-0 transition-colors",
                  active ? "text-brand-600" : "text-gray-400"
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Landlord CTA */}
      {isLandlord && (
        <div className="px-3 py-4 border-t border-gray-100">
          <Link
            href="/dashboard/listings/new"
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors shadow-sm shadow-brand-600/25"
          >
            <PlusCircle className="h-3.5 w-3.5" /> Post a Room
          </Link>
        </div>
      )}

      {/* Mobile bottom tab bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-200 flex safe-area-bottom">
        {NAV.slice(0, 4).map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-[10px] font-semibold transition-colors",
                active ? "text-brand-600" : "text-gray-400"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "text-brand-600")} />
              {label.split(" ")[0]}
            </Link>
          );
        })}
      </div>
    </>
  );
}
