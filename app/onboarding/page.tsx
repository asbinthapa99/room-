"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Home, Search, Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [role, setRole] = useState<"RENTER" | "LANDLORD" | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelect = async (selected: "RENTER" | "LANDLORD") => {
    setRole(selected);
    setLoading(true);
    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: selected }),
    });
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur border border-white/20 mb-4">
            <Home className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to NestMate</h1>
          <p className="text-blue-100 text-sm">How will you be using NestMate?</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {[
            { value: "RENTER" as const, icon: Search, label: "I am looking for a room", desc: "Browse and contact landlords" },
            { value: "LANDLORD" as const, icon: Home, label: "I have a room to rent", desc: "Post listings and find tenants" },
          ].map(({ value, icon: Icon, label, desc }) => (
            <button
              key={value}
              onClick={() => handleSelect(value)}
              disabled={loading}
              className="glass-card p-6 flex items-center gap-4 hover:shadow-lg transition-all active:scale-98 text-left w-full disabled:opacity-60"
            >
              <div className="p-3 bg-blue-50 rounded-xl flex-shrink-0">
                <Icon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{label}</p>
                <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
              </div>
              {loading && role === value && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
