"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Heart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function SaveButton({ listingId, initialSaved }: { listingId: string; initialSaved: boolean }) {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (!isSignedIn) { router.push("/sign-in"); return; }
    setLoading(true);
    const res = await fetch("/api/saved", {
      method: saved ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId }),
    });
    if (res.ok) setSaved(!saved);
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 active:scale-95 text-gray-900 font-semibold py-3.5 px-4 rounded-xl border border-gray-200 transition-all text-sm"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
      ) : (
        <Heart className={cn("h-4 w-4 transition-colors", saved ? "fill-red-500 text-red-500" : "text-gray-500")} />
      )}
      {saved ? "Saved to Favorites" : "Save to Favorites"}
    </button>
  );
}
