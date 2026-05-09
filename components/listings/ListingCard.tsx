"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Users, Zap, Heart } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

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
    <div className="card group hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <Image
          src={coverImage}
          alt={listing.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Save button */}
        {onToggleSave && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleSave(listing.id);
            }}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 backdrop-blur shadow-sm hover:bg-white transition-colors"
          >
            <Heart
              className={cn("h-4 w-4 transition-colors", isSaved ? "fill-red-500 text-red-500" : "text-gray-500")}
            />
          </button>
        )}
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur text-xs font-medium text-gray-700">
            {listing.roomType === "PRIVATE" ? "Private" : "Shared"}
          </span>
          {listing.billsIncluded && (
            <span className="px-2 py-0.5 rounded-full bg-brand-600/90 backdrop-blur text-xs font-medium text-white flex items-center gap-1">
              <Zap className="h-3 w-3" /> Bills included
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <Link href={`/listings/${listing.id}`} className="block p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-snug">{listing.title}</h3>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span>{listing.city}, {listing.country}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Available {formatDate(listing.availableDate)}
          </span>
          {listing.genderPref !== "ANY" && (
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {listing.genderPref === "MALE" ? "Male only" : "Female only"}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-lg font-bold text-gray-900">{formatPrice(listing.price, listing.currency)}</span>
            <span className="text-xs text-gray-500">/month</span>
          </div>
          <div className="flex items-center gap-1.5">
            {listing.landlord.avatar ? (
              <Image
                src={listing.landlord.avatar}
                alt={listing.landlord.name ?? "Landlord"}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="h-6 w-6 rounded-full bg-brand-100 flex items-center justify-center">
                <span className="text-xs font-medium text-brand-700">
                  {(listing.landlord.name ?? "L")[0].toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-xs text-gray-600">{listing.landlord.name ?? "Landlord"}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
