import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ListingCard } from "@/components/listings/ListingCard";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function SavedPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await db.user.findUnique({ where: { clerkId }, select: { id: true } });
  if (!user) redirect("/onboarding");

  const saved = await db.savedListing.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      listing: { include: { landlord: { select: { name: true, avatar: true } } } },
    },
  });

  return (
    <div className="bg-gray-50/60 min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-rose-50 border border-rose-100">
            <Heart className="h-4 w-4 text-rose-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-0.5">Dashboard</p>
            <h1 className="text-xl font-bold text-gray-900">Saved Rooms</h1>
          </div>
          <span className="ml-auto text-sm text-gray-400">
            {saved.length} room{saved.length !== 1 ? "s" : ""} saved
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {saved.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {saved.map(({ listing }) => (
              <ListingCard key={listing.id} listing={listing} isSaved />
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-20 text-center">
              <div className="h-14 w-14 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-7 w-7 text-rose-200" />
              </div>
              <p className="font-bold text-gray-700 text-lg">No saved rooms yet</p>
              <p className="text-sm text-gray-500 mt-1 mb-6">
                Click the heart on any listing to save it here.
              </p>
              <Button asChild>
                <Link href="/listings">Browse Rooms</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
