import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Edit } from "lucide-react";
import { db } from "@/lib/db";
import { ListingForm } from "@/components/listings/ListingForm";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="bg-gray-50/60 min-h-screen">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-5 flex items-center gap-3">
          <Link href="/dashboard/listings" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="p-2 bg-brand-50 rounded-xl border border-brand-100">
            <Edit className="h-4 w-4 text-brand-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-0.5">Dashboard</p>
            <h1 className="text-xl font-bold text-gray-900">Edit Listing</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-gray-500 mb-6">Update your room details. Changes go live after re-approval.</p>
        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-6">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
