"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function DeleteAccountButton() {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!confirming) {
    return (
      <button onClick={() => setConfirming(true)} className="btn-primary bg-red-600 hover:bg-red-700 focus-visible:outline-red-600 text-xs px-4 py-2">
        Delete Account
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500">Are you sure?</span>
      <button onClick={() => setConfirming(false)} className="btn-secondary text-xs px-3 py-1.5">Cancel</button>
      <button
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          await fetch("/api/account", { method: "DELETE" });
          router.push("/");
        }}
        className="btn-primary bg-red-600 hover:bg-red-700 focus-visible:outline-red-600 text-xs px-3 py-1.5 gap-1"
      >
        {loading && <Loader2 className="h-3 w-3 animate-spin" />}
        Yes, delete
      </button>
    </div>
  );
}
