"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { MessageSquare } from "lucide-react";

export function ContactButton({ listingId, landlordId }: { listingId: string; landlordId: string }) {
  const { isSignedIn } = useUser();
  const router = useRouter();

  return (
    <button
      onClick={() => {
        if (!isSignedIn) { router.push("/sign-in"); return; }
        router.push(`/dashboard/messages?listingId=${listingId}&landlordId=${landlordId}`);
      }}
      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold py-3.5 px-4 rounded-xl transition-all text-sm shadow-sm"
    >
      <MessageSquare className="h-4 w-4" />
      Contact Landlord
    </button>
  );
}
