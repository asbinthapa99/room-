"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

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
    <div className="bg-white rounded-xl p-3 flex flex-col sm:flex-row gap-3 shadow-xl">
      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="flex-1 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select city</option>
        {CITY_OPTIONS.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>
      <select
        value={roomType}
        onChange={(e) => setRoomType(e.target.value)}
        className="flex-1 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Any room type</option>
        {ROOM_TYPES.map((r) => (
          <option key={r.value} value={r.value}>{r.label}</option>
        ))}
      </select>
      <button
        onClick={handleSearch}
        className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap"
      >
        <Search className="h-4 w-4" />
        Search Rooms
      </button>
    </div>
  );
}
