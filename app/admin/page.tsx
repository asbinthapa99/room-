import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";
import { Shield, Users, Home, Flag, CheckCircle, XCircle } from "lucide-react";
import { AdminActions } from "@/components/admin/AdminActions";

export default async function AdminPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await db.user.findUnique({ where: { clerkId }, select: { role: true } });
  if (!user || user.role !== "ADMIN") redirect("/dashboard");

  const [pendingListings, reports, totalUsers, totalListings] = await Promise.all([
    db.listing.findMany({ where: { approved: false }, include: { landlord: { select: { name: true, email: true } } }, orderBy: { createdAt: "desc" } }),
    db.report.findMany({ where: { resolved: false }, include: { reporter: { select: { name: true } }, listing: { select: { title: true } } }, orderBy: { createdAt: "desc" } }),
    db.user.count(),
    db.listing.count(),
  ]);

  const stats = [
    { label: "Total Users", value: totalUsers, icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Total Listings", value: totalListings, icon: Home, color: "bg-green-50 text-green-600" },
    { label: "Pending Review", value: pendingListings.length, icon: CheckCircle, color: "bg-amber-50 text-amber-600" },
    { label: "Open Reports", value: reports.length, icon: Flag, color: "bg-red-50 text-red-600" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-blue-50 rounded-xl"><Shield className="h-5 w-5 text-blue-600" /></div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Moderate listings, manage reports, and oversee users</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="glass-card p-4 flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${color}`}><Icon className="h-4 w-4" /></div>
              <div>
                <p className="text-xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pending listings */}
        <div className="mb-8">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-amber-500" /> Listings Pending Approval ({pendingListings.length})
          </h2>
          {pendingListings.length === 0 ? (
            <div className="glass-card p-6 text-center text-sm text-gray-500">All caught up! No listings pending review.</div>
          ) : (
            <div className="space-y-3">
              {pendingListings.map((l) => (
                <div key={l.id} className="glass-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{l.title}</h3>
                    <p className="text-sm text-gray-500">{l.city}, {l.country} · {formatPrice(l.price, l.currency)}/month</p>
                    <p className="text-xs text-gray-400">By {l.landlord.name ?? l.landlord.email} · Posted {formatDate(l.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/listings/${l.id}`} className="btn-secondary text-xs px-3 py-1.5">Preview</Link>
                    <AdminActions listingId={l.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reports */}
        <div>
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Flag className="h-4 w-4 text-red-500" /> Open Reports ({reports.length})
          </h2>
          {reports.length === 0 ? (
            <div className="glass-card p-6 text-center text-sm text-gray-500">No open reports. Great!</div>
          ) : (
            <div className="space-y-3">
              {reports.map((r) => (
                <div key={r.id} className="glass-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge text-xs bg-red-50 border-red-200 text-red-700">{r.reason.replace(/_/g, " ")}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">{r.listing.title}</p>
                    {r.details && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{r.details}</p>}
                    <p className="text-xs text-gray-400 mt-1">Reported by {r.reporter.name ?? "user"} · {formatDate(r.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link href={`/listings/${r.listingId}`} className="btn-secondary text-xs px-3 py-1.5">View Listing</Link>
                    <AdminActions listingId={r.listingId} reportId={r.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
