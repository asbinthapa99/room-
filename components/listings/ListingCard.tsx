"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Users, Zap, Heart } from "lucide-react";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    price: number;
    currency: string;
    city: string;
    country: string;
    roomType: "PRIVATE" | "SHARED";
    billsIncluded: boolean;
    availableDate: Date | string;
    genderPref: "MALE" | "FEMALE" | "ANY";
    images: string[];
    landlord: { name: string | null; avatar: string | null };
  };
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

export function ListingCard({ listing, isSaved = false, onToggleSave }: ListingCardProps) {
  const coverImage = listing.images[0] ?? "/placeholder-room.jpg";

  return (
    <div className="card group">
      {/* Image container */}
      <Link href={`/listings/${listing.id}`} className="block relative h-52 overflow-hidden bg-gray-100">
        <Image
          src={coverImage}
          alt={listing.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Save button */}
        {onToggleSave && (
          <button
            onClick={(e) => { e.preventDefault(); onToggleSave(listing.id); }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white hover:scale-110 transition-all duration-150 z-10"
            aria-label={isSaved ? "Remove from saved" : "Save listing"}
          >
            <Heart className={cn("h-4 w-4 transition-colors", isSaved ? "fill-brand-500 text-brand-500" : "text-gray-500")} />
          </button>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5 z-10">
          <span className="inline-flex items-center rounded-full bg-white/95 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-gray-800 shadow-sm">
            {listing.roomType === "PRIVATE" ? "Private" : "Shared"}
          </span>
          {listing.billsIncluded && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-600/95 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
              <Zap className="h-3 w-3" /> Bills inc.
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <Link href={`/listings/${listing.id}`} className="block p-4">
        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <MapPin className="h-3 w-3 shrink-0 text-gray-400" />
          <span>{listing.city}, {listing.country}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-3">
          {listing.title}
        </h3>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(listing.availableDate)}
          </span>
          {listing.genderPref !== "ANY" && (
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {listing.genderPref === "MALE" ? "Male only" : "Female only"}
            </span>
          )}
        </div>

        {/* Price + landlord */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-baseline gap-0.5">
            <span className="text-lg font-bold text-gray-900">{formatPrice(listing.price, listing.currency)}</span>
            <span className="text-xs text-gray-400 ml-0.5">/mo</span>
          </div>

          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              {listing.landlord.avatar && (
                <AvatarImage src={listing.landlord.avatar} alt={listing.landlord.name ?? "Landlord"} />
              )}
              <AvatarFallback className="text-[10px] font-bold bg-brand-100 text-brand-700">
                {(listing.landlord.name ?? "L")[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-500 font-medium">{listing.landlord.name ?? "Landlord"}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
