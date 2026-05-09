import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";
import { PlusCircle, Edit, Eye, Home } from "lucide-react";

export default async function MyListingsPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await db.user.findUnique({ where: { clerkId }, select: { id: true } });
  if (!user) redirect("/onboarding");

  const listings = await db.listing.findMany({
    where: { landlordId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
            <p className="text-sm text-gray-500">{listings.length} listing{listings.length !== 1 ? "s" : ""}</p>
          </div>
          <Link href="/dashboard/listings/new" className="btn-primary gap-2">
            <PlusCircle className="h-4 w-4" /> Post a Room
          </Link>
        </div>

        {listings.length > 0 ? (
          <div className="space-y-4">
            {listings.map((l) => (
              <div key={l.id} className="glass-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{l.title}</h3>
                    <span className={`badge text-xs ${l.rented ? "bg-gray-100 text-gray-600" : l.approved ? "badge-green" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                      {l.rented ? "Rented" : l.approved ? "Live" : "Pending review"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{l.city}, {l.country} · {formatPrice(l.price, l.currency)}/month</p>
                  <p className="text-xs text-gray-400 mt-1">Posted {formatDate(l.createdAt)} · Available from {formatDate(l.availableDate)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/listings/${l.id}`} className="btn-secondary text-xs px-3 py-1.5 gap-1">
                    <Eye className="h-3.5 w-3.5" /> View
                  </Link>
                  <Link href={`/dashboard/listings/${l.id}/edit`} className="btn-primary text-xs px-3 py-1.5 gap-1">
                    <Edit className="h-3.5 w-3.5" /> Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass-card">
            <Home className="h-10 w-10 text-gray-200 mx-auto mb-3" />
            <p className="font-semibold text-gray-700">No listings yet</p>
            <p className="text-sm text-gray-500 mt-1">Post your first room and start receiving enquiries.</p>
            <Link href="/dashboard/listings/new" className="btn-primary inline-flex mt-4 gap-2">
              <PlusCircle className="h-4 w-4" /> Post a Room
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
