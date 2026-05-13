"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Home, Search, Loader2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ROLES = [
  {
    value: "RENTER" as const,
    icon: Search,
    label: "I'm looking for a room",
    desc: "Browse verified listings and contact landlords directly. No fees, no middlemen.",
    badge: "Most common",
  },
  {
    value: "LANDLORD" as const,
    icon: Home,
    label: "I have a room to rent",
    desc: "Post your listing for free and connect with thousands of verified renters.",
    badge: "Free to list",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [role, setRole] = useState<"RENTER" | "LANDLORD" | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelect = async (selected: "RENTER" | "LANDLORD") => {
    if (loading) return;
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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 shadow-lg shadow-brand-600/30 mb-5">
            <Home className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome to RoomRent</h1>
          <p className="text-gray-500">Tell us how you'll be using RoomRent so we can personalise your experience.</p>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {ROLES.map(({ value, icon: Icon, label, desc, badge }) => {
            const isSelected = role === value;
            return (
              <button
                key={value}
                onClick={() => handleSelect(value)}
                disabled={loading}
                className={`text-left w-full transition-all duration-150 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  isSelected ? "ring-2 ring-brand-600" : ""
                }`}
              >
                <Card className={`border-2 transition-all duration-150 ${
                  isSelected
                    ? "border-brand-600 shadow-lg shadow-brand-600/10"
                    : "border-gray-100 hover:border-brand-200 hover:shadow-card-hover"
                }`}>
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className={`p-3.5 rounded-2xl shrink-0 transition-colors ${
                      isSelected ? "bg-brand-600" : "bg-brand-50"
                    }`}>
                      {loading && isSelected
                        ? <Loader2 className="h-6 w-6 text-white animate-spin" />
                        : <Icon className={`h-6 w-6 ${isSelected ? "text-white" : "text-brand-600"}`} />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-gray-900">{label}</p>
                        <Badge variant="brand" className="text-[10px] px-2">{badge}</Badge>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                    </div>
                    <ArrowRight className={`h-5 w-5 shrink-0 mt-0.5 transition-colors ${
                      isSelected ? "text-brand-600" : "text-gray-300"
                    }`} />
                  </CardContent>
                </Card>
              </button>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-400">
          You can change your role anytime from account settings.
        </p>
      </div>
    </div>
  );
}
