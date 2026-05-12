import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Home, MessageSquare, Heart, PlusCircle, Settings, LayoutDashboard } from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/listings", label: "My Listings", icon: Home },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/saved", label: "Saved Rooms", icon: Heart },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { clerkId },
    select: { name: true, email: true, avatar: true, role: true },
  });
  if (!user) redirect("/onboarding");

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-gray-200 bg-white fixed top-16 bottom-0 overflow-y-auto z-30">
        {/* User info */}
        <div className="px-4 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
            ) : (
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-white">{(user.name ?? user.email ?? "U")[0].toUpperCase()}</span>
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.name ?? "User"}</p>
              <p className="text-xs text-gray-500 truncate">{user.role === "LANDLORD" ? "Landlord" : "Renter"}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors group"
            >
              <Icon className="h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-gray-600 transition-colors" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Post a room CTA (landlord only) */}
        {user.role !== "RENTER" && (
          <div className="px-3 py-4 border-t border-gray-100">
            <Link href="/dashboard/listings/new" className="btn-primary w-full justify-center gap-2 text-xs">
              <PlusCircle className="h-3.5 w-3.5" /> Post a Room
            </Link>
          </div>
        )}
      </aside>

      {/* Main content — offset for sidebar on desktop */}
      <div className="flex-1 md:ml-60 min-w-0">
        {children}
      </div>
    </div>
  );
}
