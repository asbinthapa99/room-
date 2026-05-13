"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Home } from "lucide-react";

const CITIES = [
  { value: "london", label: "London", flag: "🇬🇧", sub: "United Kingdom" },
  { value: "toronto", label: "Toronto", flag: "🇨🇦", sub: "Canada" },
];

const ROOM_TYPES = [
  { value: "", label: "Any type" },
  { value: "PRIVATE", label: "Private" },
  { value: "SHARED", label: "Shared" },
];

export function HeroSearch() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [roomType, setRoomType] = useState("");
  const [cityOpen, setCityOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setCityOpen(false);
        setTypeOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedCity = CITIES.find((c) => c.value === city);
  const selectedType = ROOM_TYPES.find((r) => r.value === roomType);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city) {
      params.set("city", city);
      params.set("country", city === "london" ? "UK" : "Canada");
    }
    if (roomType) params.set("roomType", roomType);
    router.push(`/listings?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-2xl relative" ref={containerRef}>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-2xl shadow-float overflow-visible p-1.5 gap-1.5">

        {/* City picker */}
        <div className="relative flex-1">
          <button
            onClick={() => { setCityOpen(!cityOpen); setTypeOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
          >
            <MapPin className="h-4 w-4 text-brand-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">City</p>
              {selectedCity ? (
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {selectedCity.flag} {selectedCity.label}
                </p>
              ) : (
                <p className="text-sm text-gray-400">Any city</p>
              )}
            </div>
          </button>

          {cityOpen && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-float border border-gray-100 overflow-hidden z-50">
              <button
                onClick={() => { setCity(""); setCityOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <span className="text-lg">🌍</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Any city</p>
                  <p className="text-xs text-gray-400">All locations</p>
                </div>
              </button>
              {CITIES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => { setCity(c.value); setCityOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left ${city === c.value ? "bg-brand-50" : ""}`}
                >
                  <span className="text-lg">{c.flag}</span>
                  <div>
                    <p className={`text-sm font-semibold ${city === c.value ? "text-brand-600" : "text-gray-900"}`}>{c.label}</p>
                    <p className="text-xs text-gray-400">{c.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-10 bg-gray-200 self-center" />

        {/* Room type picker */}
        <div className="relative flex-1">
          <button
            onClick={() => { setTypeOpen(!typeOpen); setCityOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
          >
            <Home className="h-4 w-4 text-brand-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Room type</p>
              <p className={`text-sm font-semibold truncate ${selectedType?.value ? "text-gray-900" : "text-gray-400"}`}>
                {selectedType?.label ?? "Any type"}
              </p>
            </div>
          </button>

          {typeOpen && (
            <div className="absolute top-full left-0 mt-2 w-44 bg-white rounded-2xl shadow-float border border-gray-100 overflow-hidden z-50">
              {ROOM_TYPES.map((r) => (
                <button
                  key={r.value}
                  onClick={() => { setRoomType(r.value); setTypeOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left ${roomType === r.value ? "bg-brand-50" : ""}`}
                >
                  <span className={`text-sm font-semibold ${roomType === r.value ? "text-brand-600" : "text-gray-900"}`}>
                    {r.label}
                  </span>
                  {roomType === r.value && (
                    <span className="h-2 w-2 rounded-full bg-brand-500" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search button */}
        <button
          onClick={handleSearch}
          className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 active:scale-[0.97] text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all duration-150 shrink-0 shadow-lg shadow-brand-600/30"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </div>

      {/* Quick filters */}
      <div className="flex items-center gap-2 mt-3 justify-center flex-wrap">
        {[
          { label: "🇬🇧 London", city: "london", type: "" },
          { label: "🇨🇦 Toronto", city: "toronto", type: "" },
          { label: "🏠 Private rooms", city: "", type: "PRIVATE" },
          { label: "🤝 Shared rooms", city: "", type: "SHARED" },
        ].map((q) => (
          <button
            key={q.label}
            onClick={() => router.push(`/listings?${q.city ? `city=${q.city}` : ""}${q.type ? `${q.city ? "&" : ""}roomType=${q.type}` : ""}`)}
            className="text-xs font-medium text-white/70 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 transition-all"
          >
            {q.label}
          </button>
        ))}
      </div>
    </div>
  );
}
