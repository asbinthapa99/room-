import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ListingForm } from "@/components/listings/ListingForm";
import { PlusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default async function NewListingPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await db.user.findUnique({ where: { clerkId }, select: { role: true } });
  if (!user) redirect("/onboarding");
  if (user.role === "RENTER") redirect("/dashboard");

  return (
    <div className="bg-gray-50/60 min-h-screen">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-5 flex items-center gap-3">
          <div className="p-2 bg-brand-50 rounded-xl border border-brand-100">
            <PlusCircle className="h-5 w-5 text-brand-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-0.5">Dashboard</p>
            <h1 className="text-xl font-bold text-gray-900">Post a Room</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-gray-500 mb-6">Fill in the details to list your room for free. It goes live after admin approval.</p>
        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-6">
            <ListingForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
