"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

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
        <button onClick={() => act("approve")} disabled={!!loading}
          className="flex items-center gap-1 btn-primary bg-green-600 hover:bg-green-700 focus-visible:outline-green-600 text-xs px-3 py-1.5">
          {loading === "approve" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
          Approve
        </button>
      )}
      <button onClick={() => act("remove")} disabled={!!loading}
        className="flex items-center gap-1 btn-primary bg-red-600 hover:bg-red-700 focus-visible:outline-red-600 text-xs px-3 py-1.5">
        {loading === "remove" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
        Remove
      </button>
    </div>
  );
}
