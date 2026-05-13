import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { Home } from "lucide-react";
import Link from "next/link";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { clerkId },
    select: { name: true, email: true, avatar: true, role: true },
  });
  if (!user) redirect("/onboarding");

  const isLandlord = user.role !== "RENTER";
  const initial = (user.name ?? user.email ?? "U")[0].toUpperCase();

  return (
    <div className="flex min-h-screen bg-gray-50/60">

      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-60 flex-col border-r border-gray-200 bg-white fixed top-16 bottom-0 overflow-y-auto z-30">

        {/* User card */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar} alt="" className="h-10 w-10 rounded-full object-cover flex-shrink-0 ring-2 ring-gray-100" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-brand-600/20">
                <span className="text-sm font-bold text-white">{initial}</span>
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{user.name ?? "User"}</p>
              <span className="inline-flex items-center gap-1 mt-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-brand-50 text-brand-700 border border-brand-100">
                {isLandlord ? "Landlord" : "Renter"}
              </span>
            </div>
          </div>
        </div>

        <DashboardNav isLandlord={isLandlord} />

        {/* Admin link — only for admins */}
        {user.role === "ADMIN" && (
          <div className="px-3 pb-4 border-t border-gray-100 pt-3">
            <Link
              href="/admin"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-brand-700 hover:bg-brand-50 transition-all"
            >
              <Home className="h-3.5 w-3.5" />
              Admin Panel
            </Link>
          </div>
        )}
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 md:ml-60 min-w-0 pb-16 md:pb-0">
        {children}
      </div>
    </div>
  );
}
