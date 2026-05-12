import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { db } from "@/lib/db";
import { ListingForm } from "@/components/listings/ListingForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditListingPage({ params }: PageProps) {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await db.user.findUnique({ where: { clerkId }, select: { id: true } });
  if (!user) redirect("/onboarding");

  const { id } = await params;
  const listing = await db.listing.findUnique({ where: { id } });

  if (!listing || listing.landlordId !== user.id) notFound();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/dashboard/listings" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6">
          <ChevronLeft className="h-4 w-4" /> My Listings
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Listing</h1>
          <p className="text-sm text-gray-500 mt-1">Update your room details. Changes go live after re-approval.</p>
        </div>

        <div className="glass-card p-6">
          <ListingForm
            initialData={{
              id: listing.id,
              title: listing.title,
              description: listing.description,
              price: listing.price,
              currency: listing.currency as "GBP" | "CAD",
              city: listing.city,
              country: listing.country,
              address: listing.address ?? undefined,
              roomType: listing.roomType as "PRIVATE" | "SHARED",
              billsIncluded: listing.billsIncluded,
              availableDate: listing.availableDate.toISOString().split("T")[0],
              genderPref: listing.genderPref as "MALE" | "FEMALE" | "ANY",
              images: listing.images,
            }}
          />
        </div>
      </div>
    </div>
  );
}
