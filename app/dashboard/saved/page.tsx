import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ListingCard } from "@/components/listings/ListingCard";
import { Heart } from "lucide-react";
import Link from "next/link";

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
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-pink-50 rounded-xl"><Heart className="h-5 w-5 text-pink-600" /></div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Saved Rooms</h1>
            <p className="text-sm text-gray-500">{saved.length} room{saved.length !== 1 ? "s" : ""} saved</p>
          </div>
        </div>

        {saved.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {saved.map(({ listing }) => (
              <ListingCard key={listing.id} listing={listing} isSaved />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass-card">
            <Heart className="h-10 w-10 text-gray-200 mx-auto mb-3" />
            <p className="font-semibold text-gray-700">No saved rooms yet</p>
            <p className="text-sm text-gray-500 mt-1">Click the heart on any listing to save it here.</p>
            <Link href="/listings" className="btn-primary inline-flex mt-4">Browse Rooms</Link>
          </div>
        )}
      </div>
    </div>
  );
}
