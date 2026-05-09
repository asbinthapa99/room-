import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Home, MessageSquare, Heart, PlusCircle, TrendingUp, Eye } from "lucide-react";

export default async function DashboardPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { clerkId },
    include: {
      listings: { where: { approved: true }, orderBy: { createdAt: "desc" }, take: 3 },
      savedListings: { take: 1 },
      receivedMessages: { where: { read: false }, take: 1 },
    },
  });
  if (!user) redirect("/onboarding");

  const stats = [
    { label: "Active Listings", value: user.listings.filter((l) => !l.rented).length, icon: Home, color: "bg-blue-50 text-blue-600" },
    { label: "Saved Rooms", value: user.savedListings.length, icon: Heart, color: "bg-pink-50 text-pink-600" },
    { label: "Unread Messages", value: user.receivedMessages.length, icon: MessageSquare, color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Welcome back, {user.name ?? "there"}</p>
          </div>
          {user.role === "LANDLORD" && (
            <Link href="/dashboard/listings/new" className="btn-primary gap-2">
              <PlusCircle className="h-4 w-4" /> Post a Room
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="glass-card p-5 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${color}`}><Icon className="h-5 w-5" /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { href: "/listings", label: "Browse Rooms", icon: Eye, desc: "Find your next home" },
            { href: "/dashboard/listings", label: "My Listings", icon: Home, desc: "Manage your rooms" },
            { href: "/dashboard/messages", label: "Messages", icon: MessageSquare, desc: "View conversations" },
            { href: "/dashboard/saved", label: "Saved Rooms", icon: Heart, desc: "Your bookmarks" },
          ].map(({ href, label, icon: Icon, desc }) => (
            <Link key={href} href={href} className="glass-card p-4 hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                  <Icon className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent listings */}
        {user.listings.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Your Recent Listings</h2>
              <Link href="/dashboard/listings" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all</Link>
            </div>
            <div className="space-y-3">
              {user.listings.map((l) => (
                <div key={l.id} className="glass-card p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{l.title}</p>
                    <p className="text-sm text-gray-500">{l.city}, {l.country}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-900">{formatPrice(l.price, l.currency)}<span className="text-xs text-gray-500 font-normal">/mo</span></p>
                    <span className={`text-xs font-medium ${l.approved ? "text-green-600" : "text-amber-600"}`}>
                      {l.rented ? "Rented" : l.approved ? "Live" : "Pending review"}
                    </span>
                  </div>
                  <Link href={`/listings/${l.id}`} className="btn-secondary text-xs px-3 py-1.5 flex-shrink-0">
                    <TrendingUp className="h-3.5 w-3.5 mr-1" /> View
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
