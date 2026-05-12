"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { CITIES, COUNTRIES, ROOM_TYPES } from "@/lib/utils";

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [country, setCountry] = useState(searchParams.get("country") ?? "");
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [roomType, setRoomType] = useState(searchParams.get("roomType") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [availableFrom, setAvailableFrom] = useState(searchParams.get("availableFrom") ?? "");
  const [billsIncluded, setBillsIncluded] = useState(searchParams.get("billsIncluded") === "true");

  // Sync state when URL params change (e.g. navigating from homepage search)
  useEffect(() => {
    setQ(searchParams.get("q") ?? "");
    setCountry(searchParams.get("country") ?? "");
    setCity(searchParams.get("city") ?? "");
    setRoomType(searchParams.get("roomType") ?? "");
    setMaxPrice(searchParams.get("maxPrice") ?? "");
    setAvailableFrom(searchParams.get("availableFrom") ?? "");
    setBillsIncluded(searchParams.get("billsIncluded") === "true");
  }, [searchParams]);

  const push = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      params.delete("page");
      router.push(`/listings?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search input */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search listings..."
              value={q}
              onChange={(e) => { setQ(e.target.value); push({ q: e.target.value }); }}
              className="input-field pl-9"
            />
          </div>

          {/* Country */}
          <select
            value={country}
            onChange={(e) => { setCountry(e.target.value); push({ country: e.target.value }); }}
            className="input-field w-auto"
          >
            <option value="">All Countries</option>
            {COUNTRIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>

          {/* City */}
          <select
            value={city}
            onChange={(e) => { setCity(e.target.value); push({ city: e.target.value }); }}
            className="input-field w-auto"
          >
            <option value="">All Cities</option>
            {CITIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>

          {/* Room type */}
          <select
            value={roomType}
            onChange={(e) => { setRoomType(e.target.value); push({ roomType: e.target.value }); }}
            className="input-field w-auto"
          >
            <option value="">Any Room Type</option>
            {ROOM_TYPES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>

          {/* Max price */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-gray-400" />
            <input
              type="number"
              placeholder="Max budget"
              value={maxPrice}
              onChange={(e) => { setMaxPrice(e.target.value); push({ maxPrice: e.target.value }); }}
              className="input-field w-28"
              min={0}
            />
          </div>

          {/* Move-in date */}
          <input
            type="date"
            value={availableFrom}
            onChange={(e) => { setAvailableFrom(e.target.value); push({ availableFrom: e.target.value }); }}
            className="input-field w-auto"
          />

          {/* Bills included toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={billsIncluded}
              onChange={(e) => { setBillsIncluded(e.target.checked); push({ billsIncluded: e.target.checked ? "true" : "" }); }}
              className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm text-gray-700">Bills included</span>
          </label>
        </div>
      </div>
    </div>
  );
}
