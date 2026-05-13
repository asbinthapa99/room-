'use client';

import Image from 'next/image';
import Link from 'next/link';
import { RoomImageGallery } from '@/components/listings/RoomImageGallery';
import { ContactButton } from '@/components/listings/ContactButton';
import { SaveButton } from '@/components/listings/SaveButton';
import { ReportButton } from '@/components/listings/ReportButton';
import { MapPin, Calendar, Clock, ShieldCheck, Star, ChevronLeft } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

interface ListingViewProps {
  listing: {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    city: string;
    country: string;
    address?: string | null;
    roomType: 'PRIVATE' | 'SHARED';
    billsIncluded: boolean;
    availableDate: Date;
    images: string[];
    landlord: {
      id: string;
      name: string;
      avatar: string | null;
      createdAt: Date;
    };
  };
  isSaved?: boolean;
  onContactClick?: () => void;
}

export function RoomDetailsView({
  listing,
  isSaved = false,
  onContactClick,
}: ListingViewProps) {
  const landlordSince = new Date(listing.landlord.createdAt).getFullYear();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href="/listings"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="h-4 w-4" /> Back to listings
        </Link>

        {/* Image Gallery with Carousel */}
        <div className="rounded-2xl overflow-hidden mb-8 h-96">
          <RoomImageGallery
            images={listing.images}
            title={listing.title}
            className="w-full h-full"
            alwaysShowNavigation={false}
          />
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left — content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 text-sm rounded-full font-medium">
                <ShieldCheck className="h-3.5 w-3.5" /> Verified
              </span>
              <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium">
                {listing.roomType === 'PRIVATE' ? 'Private Room' : 'Shared Room'}
              </span>
              {listing.billsIncluded && (
                <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full font-medium">
                  Bills included
                </span>
              )}
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {listing.city}, {listing.country}
                </span>
                {listing.address && <span>· {listing.address}</span>}
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-gray-600">New listing</span>
              </div>
            </div>

            {/* Mobile: price card */}
            <div className="lg:hidden bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(listing.price, listing.currency)}
                </span>
                <span className="text-gray-500 text-sm">/month</span>
                {listing.billsIncluded && (
                  <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
                    Bills included
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <ContactButton listingId={listing.id} landlordId={listing.landlord.id} />
                <SaveButton listingId={listing.id} initialSaved={isSaved} />
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Available from</span>
                  <span className="font-semibold">{formatDate(listing.availableDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Room type</span>
                  <span className="font-semibold">
                    {listing.roomType === 'PRIVATE' ? 'Private Room' : 'Shared Room'}
                  </span>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* About */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-3">About this room</h2>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            {/* Info boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                <div className="p-2.5 bg-brand-50 rounded-xl">
                  <Calendar className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Available from</p>
                  <p className="font-semibold text-gray-900">{formatDate(listing.availableDate)}</p>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                <div className="p-2.5 bg-brand-50 rounded-xl">
                  <Clock className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Minimum stay</p>
                  <p className="font-semibold text-gray-900">1 month</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-6 space-y-4">
              {/* Price card */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(listing.price, listing.currency)}
                    </span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  {listing.billsIncluded && (
                    <p className="text-sm text-green-700 font-medium">✓ Bills included</p>
                  )}
                </div>
                <div className="space-y-2">
                  <ContactButton listingId={listing.id} landlordId={listing.landlord.id} />
                  <SaveButton listingId={listing.id} initialSaved={isSaved} />
                  <ReportButton listingId={listing.id} />
                </div>
              </div>

              {/* Landlord info */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4">Landlord info</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                    {listing.landlord.avatar ? (
                      <Image
                        src={listing.landlord.avatar}
                        alt={listing.landlord.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold">
                        {listing.landlord.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{listing.landlord.name}</p>
                    <p className="text-xs text-gray-500">Member since {landlordSince}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Message the landlord to ask questions about this listing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomDetailsView;
