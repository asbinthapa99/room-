"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Shield, Zap, Star, ChevronDown } from "lucide-react";
import { HeroSearch } from "@/components/shared/HeroSearch";

const CITY_SLIDES = [
  {
    city: "London",
    sub: "United Kingdom",
    flag: "🇬🇧",
    img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1800&q=80",
  },
  {
    city: "Toronto",
    sub: "Canada",
    flag: "🇨🇦",
    img: "https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=1800&q=80",
  },
];

const TRUST_STATS = [
  { icon: Shield, value: "100%", label: "Verified listings" },
  { icon: Zap, value: "2 cities", label: "London & Toronto" },
  { icon: Star, value: "Free", label: "No hidden fees" },
];

export function HeroCinematic() {
  const [slide, setSlide] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setSlide((s) => (s + 1) % CITY_SLIDES.length);
        setFading(false);
      }, 600);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const current = CITY_SLIDES[slide];
  const next = CITY_SLIDES[(slide + 1) % CITY_SLIDES.length];

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden">

      {/* Background images — crossfade */}
      {CITY_SLIDES.map((s, i) => (
        <Image
          key={s.city}
          src={s.img}
          alt={s.city}
          fill
          priority={i === 0}
          className="object-cover transition-opacity duration-700"
          style={{ opacity: i === slide ? (fading ? 0 : 1) : (fading && i === (slide + 1) % CITY_SLIDES.length ? 1 : 0) }}
          sizes="100vw"
        />
      ))}

      {/* Layered gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center gap-7 pt-20">

        {/* Trust badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/25 px-4 py-2 text-xs font-semibold text-white/90 uppercase tracking-widest">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          Trusted by students &amp; newcomers worldwide
        </div>

        {/* Headline */}
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight">
            Find your room in
          </h1>
          <div className="relative h-[1.2em] mt-1 overflow-hidden">
            <p
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-brand-400 transition-all duration-500"
              style={{
                opacity: fading ? 0 : 1,
                transform: fading ? "translateY(-20px)" : "translateY(0)",
              }}
            >
              {current.flag} {current.city}
            </p>
          </div>
          <p className="text-white/50 text-base md:text-lg mt-3 font-medium">
            Verified rooms. No scams. Direct landlord contact.
          </p>
        </div>

        {/* Search bar */}
        <HeroSearch />

        {/* Trust stats */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
          {TRUST_STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center">
                <Icon className="h-4 w-4 text-brand-300" />
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-sm leading-none">{value}</p>
                <p className="text-white/45 text-xs mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* City dot indicators */}
        <div className="flex gap-2 pt-1">
          {CITY_SLIDES.map((s, i) => (
            <button
              key={s.city}
              onClick={() => { setFading(true); setTimeout(() => { setSlide(i); setFading(false); }, 600); }}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === slide ? "w-6 bg-white" : "w-1.5 bg-white/35"}`}
            />
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 animate-bounce">
        <p className="text-white/40 text-xs font-medium uppercase tracking-widest">Scroll</p>
        <ChevronDown className="h-4 w-4 text-white/40" />
      </div>
    </section>
  );
}
