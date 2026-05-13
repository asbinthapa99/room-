import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Home, MessageSquare, Heart, PlusCircle, ArrowRight, Eye, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default async function DashboardPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { clerkId },
    include: { listings: { orderBy: { createdAt: "desc" }, take: 5 } },
  });
  if (!user) redirect("/onboarding");

  const [savedCount, unreadCount] = await Promise.all([
    db.savedListing.count({ where: { userId: user.id } }),
    db.message.count({ where: { receiverId: user.id, read: false } }),
  ]);

  const activeListings = user.listings.filter((l) => !l.rented && l.approved).length;

  const stats = [
    { label: "Active Listings", value: activeListings, icon: Home, bg: "bg-brand-50", fg: "text-brand-600" },
    { label: "Saved Rooms", value: savedCount, icon: Heart, bg: "bg-rose-50", fg: "text-rose-500" },
    { label: "Unread Messages", value: unreadCount, icon: MessageSquare, bg: "bg-violet-50", fg: "text-violet-600" },
  ];

  const quickActions = [
    { href: "/listings", label: "Browse Rooms", icon: Eye, desc: "Find your next home" },
    { href: "/dashboard/listings", label: "My Listings", icon: Home, desc: "Manage your rooms" },
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquare, desc: "View conversations", badge: unreadCount || undefined },
    { href: "/dashboard/saved", label: "Saved Rooms", icon: Heart, desc: "Your bookmarks", badge: savedCount || undefined },
  ];

  return (
    <div className="bg-gray-50/60 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-1">Dashboard</p>
            <h1 className="text-3xl font-black text-gray-900 leading-tight">
              Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}
            </h1>
            <p className="text-sm text-gray-500 mt-1">Here's what's happening with your account.</p>
          </div>
          {user.role === "LANDLORD" && (
            <Button asChild size="lg">
              <Link href="/dashboard/listings/new">
                <PlusCircle className="h-4 w-4" /> Post a Room
              </Link>
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, bg, fg }) => (
            <Card key={label} className="border-0 shadow-card">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-3.5 rounded-2xl ${bg}`}>
                  <Icon className={`h-5 w-5 ${fg}`} />
                </div>
                <div>
                  <p className="text-3xl font-black text-gray-900 leading-none">{value}</p>
                  <p className="text-sm text-gray-500 mt-1">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {quickActions.map(({ href, label, icon: Icon, desc, badge }) => (
            <Link key={href} href={href}>
              <Card className="border-0 shadow-card hover:shadow-card-hover cursor-pointer group h-full">
                <CardContent className="p-5 flex items-center gap-3.5">
                  <div className="p-2.5 bg-brand-50 rounded-xl group-hover:bg-brand-100 transition-colors shrink-0">
                    <Icon className="h-4 w-4 text-brand-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-gray-900 truncate">{label}</p>
                      {badge ? (
                        <span className="h-5 min-w-5 px-1.5 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center">
                          {badge}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent listings */}
        {user.listings.length > 0 && (
          <Card className="border-0 shadow-card">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Recent Listings</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/listings">
                    View all <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Separator className="mt-4" />
              <div className="divide-y divide-gray-100">
                {user.listings.map((l) => (
                  <div key={l.id} className="flex items-center gap-4 px-6 py-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">{l.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{l.city}, {l.country}</p>
                    </div>
                    <div className="text-right shrink-0 hidden sm:block">
                      <p className="font-bold text-sm text-gray-900">
                        {formatPrice(l.price, l.currency)}
                        <span className="text-xs text-gray-400 font-normal">/mo</span>
                      </p>
                    </div>
                    <Badge
                      variant={l.rented ? "default" : l.approved ? "green" : "amber"}
                      className="shrink-0"
                    >
                      {l.rented ? (
                        <><CheckCircle2 className="h-3 w-3" /> Rented</>
                      ) : l.approved ? (
                        <><CheckCircle2 className="h-3 w-3" /> Live</>
                      ) : (
                        <><Clock className="h-3 w-3" /> Pending</>
                      )}
                    </Badge>
                    <Button variant="outline" size="sm" asChild className="shrink-0">
                      <Link href={`/listings/${l.id}`}>View</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
