import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";
import { Shield, Users, Home, Flag, CheckCircle, Clock, Eye, ExternalLink } from "lucide-react";
import { AdminActions } from "@/components/admin/AdminActions";
import { BanButton } from "@/components/admin/BanButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function AdminPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const me = await db.user.findUnique({ where: { clerkId }, select: { role: true } });
  if (!me || me.role !== "ADMIN") redirect("/dashboard");

  const [pendingListings, reports, totalUsers, totalListings, approvedListings] = await Promise.all([
    db.listing.findMany({
      where: { approved: false },
      include: { landlord: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    }),
    db.report.findMany({
      where: { resolved: false },
      include: {
        reporter: { select: { name: true } },
        listing: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.user.count(),
    db.listing.count(),
    db.listing.count({ where: { approved: true } }),
  ]);

  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: Users,
      bg: "bg-violet-50",
      fg: "text-violet-600",
      border: "border-violet-100",
    },
    {
      label: "Total Listings",
      value: totalListings,
      icon: Home,
      bg: "bg-brand-50",
      fg: "text-brand-600",
      border: "border-brand-100",
    },
    {
      label: "Pending Review",
      value: pendingListings.length,
      icon: Clock,
      bg: "bg-amber-50",
      fg: "text-amber-600",
      border: "border-amber-100",
      urgent: pendingListings.length > 0,
    },
    {
      label: "Open Reports",
      value: reports.length,
      icon: Flag,
      bg: "bg-red-50",
      fg: "text-red-600",
      border: "border-red-100",
      urgent: reports.length > 0,
    },
  ];

  const REASON_LABELS: Record<string, string> = {
    SCAM: "Scam",
    FAKE_LISTING: "Fake listing",
    INAPPROPRIATE: "Inappropriate",
    WRONG_INFO: "Wrong info",
    OTHER: "Other",
  };

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-50 rounded-xl border border-brand-100">
              <Shield className="h-5 w-5 text-brand-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Overview</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {approvedListings} active · {pendingListings.length} pending · {reports.length} reports
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/listings">
              <Eye className="h-3.5 w-3.5" /> View Site
            </Link>
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, bg, fg, border, urgent }) => (
            <Card key={label} className={`border ${border ?? "border-gray-100"} shadow-sm`}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${bg} border ${border ?? ""}`}>
                  <Icon className={`h-4 w-4 ${fg}`} />
                </div>
                <div>
                  <p className={`text-2xl font-black ${urgent ? fg : "text-gray-900"}`}>{value}</p>
                  <p className="text-xs text-gray-500 font-medium">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pending listings */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-amber-500" />
            <h2 className="font-bold text-gray-900">Listings Pending Approval</h2>
            {pendingListings.length > 0 && (
              <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">
                {pendingListings.length}
              </Badge>
            )}
          </div>

          {pendingListings.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-10 text-center">
                <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">All caught up!</p>
                <p className="text-xs text-gray-400 mt-1">No listings pending review.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {pendingListings.map((l) => (
                <Card key={l.id} className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="amber" className="text-[10px]">
                          Pending
                        </Badge>
                        <span className="text-[10px] text-gray-400">{formatDate(l.createdAt)}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 truncate">{l.title}</h3>
                      <p className="text-sm text-gray-500">
                        {l.city}, {l.country} · {formatPrice(l.price, l.currency)}/mo
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        by {l.landlord.name ?? l.landlord.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/listings/${l.id}`} target="_blank">
                          <ExternalLink className="h-3.5 w-3.5" /> Preview
                        </Link>
                      </Button>
                      <AdminActions listingId={l.id} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Open reports */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Flag className="h-4 w-4 text-red-500" />
            <h2 className="font-bold text-gray-900">Open Reports</h2>
            {reports.length > 0 && (
              <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">
                {reports.length}
              </Badge>
            )}
          </div>

          {reports.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-10 text-center">
                <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">No open reports</p>
                <p className="text-xs text-gray-400 mt-1">Everything looks clean.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {reports.map((r) => (
                <Card key={r.id} className="border-red-100 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100 text-[10px]">
                          {REASON_LABELS[r.reason] ?? r.reason.replace(/_/g, " ")}
                        </Badge>
                        <span className="text-[10px] text-gray-400">{formatDate(r.createdAt)}</span>
                      </div>
                      <p className="font-semibold text-gray-900 truncate">{r.listing.title}</p>
                      {r.details && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{r.details}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        Reported by {r.reporter.name ?? "user"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/listings/${r.listingId}`} target="_blank">
                          <ExternalLink className="h-3.5 w-3.5" /> View
                        </Link>
                      </Button>
                      <AdminActions listingId={r.listingId} reportId={r.id} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
