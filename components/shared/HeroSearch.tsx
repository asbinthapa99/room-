"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Home } from "lucide-react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

const CITY_OPTIONS = [
  { value: "london", label: "London, UK", country: "UK" },
  { value: "toronto", label: "Toronto, Canada", country: "Canada" },
];

const ROOM_TYPES = [
  { value: "PRIVATE", label: "Private Room" },
  { value: "SHARED", label: "Shared Room" },
];

export function HeroSearch() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [roomType, setRoomType] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city) {
      params.set("city", city);
      const cityOption = CITY_OPTIONS.find((c) => c.value === city);
      if (cityOption) params.set("country", cityOption.country);
    }
    if (roomType) params.set("roomType", roomType);
    router.push(`/listings?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="glass-panel p-2 flex flex-col sm:flex-row gap-2 shadow-float">
        {/* City */}
        <div className="flex items-center gap-2.5 flex-1 bg-white/60 rounded-xl px-4 py-3 border border-white/80">
          <MapPin className="h-4 w-4 text-brand-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider leading-none mb-1">City</p>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-gray-900 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="">Any city</option>
              {CITY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px bg-gray-200 my-2" />

        {/* Room type */}
        <div className="flex items-center gap-2.5 flex-1 bg-white/60 rounded-xl px-4 py-3 border border-white/80">
          <Home className="h-4 w-4 text-brand-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider leading-none mb-1">Room type</p>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-gray-900 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="">Any type</option>
              {ROOM_TYPES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search button — liquid glass over hero photo */}
        <LiquidButton
          onClick={handleSearch}
          size="lg"
          className="text-white font-semibold shrink-0 rounded-xl"
        >
          <Search className="h-4 w-4" />
          Search
        </LiquidButton>
      </div>
    </div>
  );
}
