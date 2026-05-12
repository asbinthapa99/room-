"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldOff, ShieldCheck } from "lucide-react";

export function BanButton({ userId, banned }: { userId: string; banned: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    await fetch("/api/admin/ban", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ban: !banned }),
    });
    setLoading(false);
    router.refresh();
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 ${
        banned
          ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
          : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
      }`}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : banned ? (
        <ShieldCheck className="h-3.5 w-3.5" />
      ) : (
        <ShieldOff className="h-3.5 w-3.5" />
      )}
      {banned ? "Unban" : "Ban"}
    </button>
  );
}
