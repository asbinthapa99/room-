"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeleteAccountButton() {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!confirming) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="border-red-200 text-red-700 hover:bg-red-50"
        onClick={() => setConfirming(true)}
      >
        Delete Account
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-gray-500">Are you sure? This cannot be undone.</span>
      <Button variant="outline" size="sm" onClick={() => setConfirming(false)}>Cancel</Button>
      <Button
        size="sm"
        className="bg-red-600 hover:bg-red-700 text-white"
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          await fetch("/api/account", { method: "DELETE" });
          router.push("/");
        }}
      >
        {loading && <Loader2 className="h-3 w-3 animate-spin" />}
        Yes, delete
      </Button>
    </div>
  );
}
