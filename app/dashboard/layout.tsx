import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DashboardNav } from "@/components/dashboard/DashboardNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { clerkId },
    select: { name: true, email: true, avatar: true, role: true },
  });
  if (!user) redirect("/onboarding");

  const isLandlord = user.role !== "RENTER";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-gray-200 bg-white fixed top-16 bottom-0 overflow-y-auto z-30">
        {/* User info */}
        <div className="px-4 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar} alt="" className="h-9 w-9 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-white">
                  {(user.name ?? user.email ?? "U")[0].toUpperCase()}
                </span>
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.name ?? "User"}</p>
              <p className="text-xs text-gray-500">{isLandlord ? "Landlord" : "Renter"}</p>
            </div>
          </div>
        </div>

        <DashboardNav isLandlord={isLandlord} />
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-60 min-w-0 pb-16 md:pb-0">
        {children}
      </div>
    </div>
  );
}
