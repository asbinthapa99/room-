"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { MessageSquare } from "lucide-react";
import { isClerkConfigured } from "@/lib/clerk-config";
import { MetalButton } from "@/components/ui/liquid-glass-button";

function GuestContactButton() {
  const router = useRouter();

  return (
    <MetalButton
      variant="primary"
      onClick={() => router.push("/sign-in")}
      className="w-full rounded-xl"
    >
      <MessageSquare className="h-4 w-4" />
      Contact Landlord
    </MetalButton>
  );
}

function AuthContactButton({ listingId, landlordId }: { listingId: string; landlordId: string }) {
  const { isSignedIn } = useUser();
  const router = useRouter();

  return (
    <MetalButton
      variant="primary"
      onClick={() => {
        if (!isSignedIn) { router.push("/sign-in"); return; }
        router.push(`/dashboard/messages?listingId=${listingId}&landlordId=${landlordId}`);
      }}
      className="w-full rounded-xl"
    >
      <MessageSquare className="h-4 w-4" />
      Contact Landlord
    </MetalButton>
  );
}

export function ContactButton({ listingId, landlordId }: { listingId: string; landlordId: string }) {
  return isClerkConfigured ? (
    <AuthContactButton listingId={listingId} landlordId={landlordId} />
  ) : (
    <GuestContactButton />
  );
}
