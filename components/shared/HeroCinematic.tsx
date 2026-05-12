"use client";

import ScrollExpandMedia from "@/components/ui/scroll-expand-media";
import { HeroSearch } from "@/components/shared/HeroSearch";
import { Badge } from "@/components/ui/badge";
import { Star, Shield, Zap } from "lucide-react";

export function HeroCinematic() {
  return (
    <ScrollExpandMedia
      mediaType="image"
      mediaSrc="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80"
      bgImageSrc="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=80"
      title="Find Your Room"
      scrollToExpand="Scroll to explore"
    >
      {/* Revealed after full expand */}
      <div className="flex flex-col items-center text-center gap-8 py-12">
        <Badge variant="dark" className="gap-2 py-1.5 px-4">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="text-white/90">Trusted by students &amp; newcomers worldwide</span>
        </Badge>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.1] max-w-2xl">
          Find your perfect room in<br />
          <span className="text-brand-400">London or Toronto</span>
        </h1>

        <p className="text-lg text-white/70 max-w-lg leading-relaxed">
          Verified listings, no scams, no middlemen. Connect directly with landlords and find a place to call home.
        </p>

        <HeroSearch />

        {/* Trust stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-2">
          {[
            { icon: Shield, label: "Verified listings", value: "100%" },
            { icon: Zap, label: "London & Toronto", value: "2 cities" },
            { icon: Star, label: "Direct landlord contact", value: "Always" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
                <Icon className="h-4 w-4 text-brand-300" />
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-base leading-none">{value}</p>
                <p className="text-white/50 text-xs mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollExpandMedia>
  );
}
