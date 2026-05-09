import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ListingForm } from "@/components/listings/ListingForm";
import { PlusCircle } from "lucide-react";

export default async function NewListingPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await db.user.findUnique({ where: { clerkId }, select: { role: true } });
  if (!user) redirect("/onboarding");
  if (user.role === "RENTER") redirect("/dashboard");

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-blue-50 rounded-xl"><PlusCircle className="h-5 w-5 text-blue-600" /></div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Post a Room</h1>
            <p className="text-sm text-gray-500">Fill in the details to list your room</p>
          </div>
        </div>
        <div className="glass-card p-6">
          <ListingForm />
        </div>
      </div>
    </div>
  );
}
