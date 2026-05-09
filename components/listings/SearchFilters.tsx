"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { CITIES, COUNTRIES, ROOM_TYPES } from "@/lib/utils";

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
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
              defaultValue={searchParams.get("q") ?? ""}
              onChange={(e) => updateParam("q", e.target.value)}
              className="input-field pl-9"
            />
          </div>

          {/* Country */}
          <select
            defaultValue={searchParams.get("country") ?? ""}
            onChange={(e) => updateParam("country", e.target.value)}
            className="input-field w-auto"
          >
            <option value="">All Countries</option>
            {COUNTRIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>

          {/* City */}
          <select
            defaultValue={searchParams.get("city") ?? ""}
            onChange={(e) => updateParam("city", e.target.value)}
            className="input-field w-auto"
          >
            <option value="">All Cities</option>
            {CITIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>

          {/* Room type */}
          <select
            defaultValue={searchParams.get("roomType") ?? ""}
            onChange={(e) => updateParam("roomType", e.target.value)}
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
              defaultValue={searchParams.get("maxPrice") ?? ""}
              onChange={(e) => updateParam("maxPrice", e.target.value)}
              className="input-field w-28"
              min={0}
            />
          </div>

          {/* Move-in date */}
          <input
            type="date"
            defaultValue={searchParams.get("availableFrom") ?? ""}
            onChange={(e) => updateParam("availableFrom", e.target.value)}
            className="input-field w-auto"
          />

          {/* Bills included toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked={searchParams.get("billsIncluded") === "true"}
              onChange={(e) => updateParam("billsIncluded", e.target.checked ? "true" : "")}
              className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm text-gray-700">Bills included</span>
          </label>
        </div>
      </div>
    </div>
  );
}
