import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";
import { PlusCircle, Edit, Eye, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="bg-gray-50/60 min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-0.5">Dashboard</p>
            <h1 className="text-xl font-bold text-gray-900">My Listings</h1>
          </div>
          <Button asChild>
            <Link href="/dashboard/listings/new">
              <PlusCircle className="h-4 w-4" /> Post a Room
            </Link>
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-gray-500 mb-6">
          {listings.length} listing{listings.length !== 1 ? "s" : ""} in your account
        </p>

        {listings.length > 0 ? (
          <div className="space-y-3">
            {listings.map((l) => (
              <Card key={l.id} className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="font-semibold text-gray-900 truncate">{l.title}</h3>
                      <Badge
                        variant={l.rented ? "default" : l.approved ? "green" : "amber"}
                        className="text-[10px] flex-shrink-0"
                      >
                        {l.rented ? "Rented" : l.approved ? "Live" : "Pending"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      {l.city}, {l.country} · {formatPrice(l.price, l.currency)}/month
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Posted {formatDate(l.createdAt)} · Available from {formatDate(l.availableDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/listings/${l.id}`}>
                        <Eye className="h-3.5 w-3.5" /> View
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href={`/dashboard/listings/${l.id}/edit`}>
                        <Edit className="h-3.5 w-3.5" /> Edit
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-20 text-center">
              <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Home className="h-7 w-7 text-gray-300" />
              </div>
              <p className="font-bold text-gray-700 text-lg">No listings yet</p>
              <p className="text-sm text-gray-500 mt-1 mb-6">
                Post your first room and start receiving enquiries.
              </p>
              <Button asChild>
                <Link href="/dashboard/listings/new">
                  <PlusCircle className="h-4 w-4" /> Post a Room
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
