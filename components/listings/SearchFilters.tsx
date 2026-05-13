"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Search, X, ChevronDown, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { CITIES, COUNTRIES, ROOM_TYPES } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchRef = useRef<HTMLInputElement>(null);

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [country, setCountry] = useState(searchParams.get("country") ?? "");
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [roomType, setRoomType] = useState(searchParams.get("roomType") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [availableFrom, setAvailableFrom] = useState(searchParams.get("availableFrom") ?? "");
  const [billsIncluded, setBillsIncluded] = useState(searchParams.get("billsIncluded") === "true");
  const [sort, setSort] = useState(searchParams.get("sort") ?? "");
  const [showMore, setShowMore] = useState(false);

  // derive currency symbol from active city
  const currencySymbol = city === "toronto" ? "CA$" : "£";

  useEffect(() => {
    setQ(searchParams.get("q") ?? "");
    setCountry(searchParams.get("country") ?? "");
    setCity(searchParams.get("city") ?? "");
    setRoomType(searchParams.get("roomType") ?? "");
    setMaxPrice(searchParams.get("maxPrice") ?? "");
    setAvailableFrom(searchParams.get("availableFrom") ?? "");
    setBillsIncluded(searchParams.get("billsIncluded") === "true");
    setSort(searchParams.get("sort") ?? "");
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

  const activeCount = [country, city, roomType, maxPrice, availableFrom, billsIncluded ? "1" : "", sort].filter(Boolean).length;

  const clearAll = () => {
    setCountry(""); setCity(""); setRoomType(""); setMaxPrice(""); setAvailableFrom(""); setBillsIncluded(false); setQ(""); setSort("");
    router.push("/listings");
  };

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-3 overflow-x-auto pb-0.5 scrollbar-hide">

          {/* Search input */}
          <div className="relative shrink-0 flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search rooms…"
              value={q}
              onChange={(e) => { setQ(e.target.value); push({ q: e.target.value }); }}
              className="w-full rounded-full border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-colors"
            />
            {q && (
              <button onClick={() => { setQ(""); push({ q: "" }); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-700">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Vertical divider */}
          <div className="h-8 w-px bg-gray-200 shrink-0" />

          {/* City pill */}
          <div className="relative shrink-0">
            <select
              value={city}
              onChange={(e) => { setCity(e.target.value); push({ city: e.target.value }); }}
              className={cn(
                "appearance-none rounded-full border px-4 pr-8 py-2.5 text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all",
                city ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
              )}
            >
              <option value="">Any city</option>
              {CITIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <ChevronDown className={cn("absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none", city ? "text-white/70" : "text-gray-400")} />
          </div>

          {/* Room type pill */}
          <div className="relative shrink-0">
            <select
              value={roomType}
              onChange={(e) => { setRoomType(e.target.value); push({ roomType: e.target.value }); }}
              className={cn(
                "appearance-none rounded-full border px-4 pr-8 py-2.5 text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all",
                roomType ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
              )}
            >
              <option value="">Any type</option>
              {ROOM_TYPES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
            <ChevronDown className={cn("absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none", roomType ? "text-white/70" : "text-gray-400")} />
          </div>

          {/* Bills included toggle */}
          <button
            onClick={() => { setBillsIncluded(!billsIncluded); push({ billsIncluded: !billsIncluded ? "true" : "" }); }}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition-all whitespace-nowrap",
              billsIncluded ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
            )}
          >
            Bills included
          </button>

          {/* Sort */}
          <div className="relative shrink-0">
            <ArrowUpDown className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none", sort ? "text-white/70" : "text-gray-400")} />
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); push({ sort: e.target.value }); }}
              className={cn(
                "appearance-none rounded-full border pl-8 pr-8 py-2.5 text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all",
                sort ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
              )}
            >
              <option value="">Newest first</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
            </select>
            <ChevronDown className={cn("absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none", sort ? "text-white/70" : "text-gray-400")} />
          </div>

          {/* More filters toggle */}
          <button
            onClick={() => setShowMore(!showMore)}
            className={cn(
              "shrink-0 flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-medium transition-all whitespace-nowrap",
              showMore ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
            )}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters {activeCount > 0 && <span className={cn("h-4 w-4 rounded-full text-[10px] font-bold flex items-center justify-center", showMore ? "bg-white text-gray-900" : "bg-gray-900 text-white")}>{activeCount}</span>}
          </button>

          {/* Clear all */}
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="shrink-0 text-sm font-medium text-gray-500 hover:text-gray-900 underline underline-offset-2 whitespace-nowrap transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Expanded filters */}
        {showMore && (
          <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-gray-100 animate-fade-in">
            {/* Country */}
            <div className="relative">
              <select
                value={country}
                onChange={(e) => { setCountry(e.target.value); push({ country: e.target.value }); }}
                className={cn(
                  "appearance-none rounded-full border px-4 pr-8 py-2.5 text-sm font-medium cursor-pointer focus:outline-none transition-all",
                  country ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                )}
              >
                <option value="">Any country</option>
                {COUNTRIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <ChevronDown className={cn("absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none", country ? "text-white/70" : "text-gray-400")} />
            </div>

            {/* Max budget */}
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none font-medium">{currencySymbol}</span>
              <input
                type="number"
                placeholder="Max budget"
                value={maxPrice}
                onChange={(e) => { setMaxPrice(e.target.value); push({ maxPrice: e.target.value }); }}
                min={0}
                className={cn(
                  "rounded-full border pl-7 pr-4 py-2.5 text-sm font-medium w-36 focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all",
                  maxPrice ? "border-gray-900 bg-gray-900 text-white placeholder-white/50" : "border-gray-200 bg-white text-gray-700 placeholder-gray-400 hover:border-gray-400"
                )}
              />
            </div>

            {/* Move-in date */}
            <input
              type="date"
              value={availableFrom}
              onChange={(e) => { setAvailableFrom(e.target.value); push({ availableFrom: e.target.value }); }}
              className={cn(
                "rounded-full border px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all",
                availableFrom ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}
