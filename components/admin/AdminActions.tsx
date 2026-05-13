"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminActions({ listingId, reportId }: { listingId: string; reportId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const act = async (action: string) => {
    setLoading(action);
    await fetch(`/api/admin/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, reportId }),
    });
    setLoading(null);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      {!reportId && (
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => act("approve")}
          disabled={!!loading}
        >
          {loading === "approve" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
          Approve
        </Button>
      )}
      <Button
        size="sm"
        variant="outline"
        className="border-red-200 text-red-700 hover:bg-red-50"
        onClick={() => act("remove")}
        disabled={!!loading}
      >
        {loading === "remove" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
        Remove
      </Button>
    </div>
  );
}
