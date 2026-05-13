import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Shield } from "lucide-react";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { clerkId },
    select: { role: true, name: true, email: true },
  });
  if (!user || user.role !== "ADMIN") redirect("/dashboard");

  const initial = (user.name ?? user.email ?? "A")[0].toUpperCase();

  return (
    <div className="flex min-h-screen">
      {/* ── Dark sidebar ── */}
      <aside className="hidden md:flex w-60 flex-col bg-gray-950 fixed top-16 bottom-0 z-30 border-r border-white/[0.06]">
        {/* Admin brand strip */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/[0.06]">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 shadow-lg shadow-brand-600/40">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">RoomRent</p>
            <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <AdminNav />

        {/* Bottom — current admin user */}
        <div className="px-3 py-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.04]">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0">
              <span className="text-[11px] font-bold text-white">{initial}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.name ?? user.email}</p>
              <p className="text-[10px] text-gray-600 mt-0.5">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile top strip (admin label) ── */}
      <div className="md:hidden fixed top-16 left-0 right-0 z-20 h-10 bg-gray-950 border-b border-white/[0.08] flex items-center px-4 gap-2">
        <Shield className="h-3.5 w-3.5 text-brand-400" />
        <span className="text-xs font-bold text-white tracking-wider uppercase">Admin Panel</span>
        <Link href="/dashboard" className="ml-auto text-[10px] text-gray-500 hover:text-gray-300">
          ← Dashboard
        </Link>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 md:ml-60 bg-gray-50 min-h-screen mt-10 md:mt-0">
        {children}
      </div>
    </div>
  );
}
