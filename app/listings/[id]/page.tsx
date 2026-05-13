import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { MapPin, Calendar, Clock, ShieldCheck, Star, Wifi, Car, Flame, Tv, WashingMachine, ChevronLeft } from "lucide-react";
import { db } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";
import { ContactButton } from "@/components/listings/ContactButton";
import { SaveButton } from "@/components/listings/SaveButton";
import { ReportButton } from "@/components/listings/ReportButton";
import { LocationMap } from "@/components/ui/location-map";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const CITY_COORDINATES: Record<string, { coords: string; label: string }> = {
  london: { coords: "51.5074° N, 0.1278° W", label: "London, UK" },
  toronto: { coords: "43.6532° N, 79.3832° W", label: "Toronto, Canada" },
};

interface PageProps { params: Promise<{ id: string }> }

async function getListing(id: string) {
  return db.listing.findUnique({
    where: { id, approved: true },
    include: { landlord: { select: { id: true, name: true, avatar: true, createdAt: true } } },
  });
}

async function getSavedStatus(listingId: string, clerkId: string | null) {
  if (!clerkId) return false;
  const user = await db.user.findUnique({ where: { clerkId }, select: { id: true } });
  if (!user) return false;
  const saved = await db.savedListing.findUnique({ where: { userId_listingId: { userId: user.id, listingId } } });
  return !!saved;
}

const AMENITY_ICONS: Record<string, React.ElementType> = {
  wifi: Wifi, parking: Car, heating: Flame, tv: Tv, washing: WashingMachine,
};

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { userId } = await auth();
  const [listing, isSaved] = await Promise.all([getListing(id), getSavedStatus(id, userId)]);
  if (!listing) notFound();

  const amenities = [
    { key: "wifi", label: "WiFi" },
    { key: "parking", label: "Parking" },
    { key: "heating", label: "Heating" },
    { key: "tv", label: "TV" },
    { key: "washing", label: "Washing Machine" },
  ];

  const cityKey = listing.city.toLowerCase();
  const cityInfo = CITY_COORDINATES[cityKey] ?? { coords: "", label: listing.city };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/listings" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to listings
        </Link>

        {/* Image gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-2xl overflow-hidden mb-8 h-60 sm:h-80 lg:h-96">
          <div className="relative h-full bg-gray-200">
            {listing.images[0] ? (
              <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" priority sizes="(max-width: 640px) 100vw, 50vw" />
            ) : (
              <div className="h-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
                <span className="text-brand-400 text-sm">No photo</span>
              </div>
            )}
          </div>
          <div className="hidden sm:grid grid-cols-2 gap-2 h-full">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative bg-gray-100">
                {listing.images[i] ? (
                  <Image src={listing.images[i]} alt="" fill className="object-cover" sizes="25vw" />
                ) : (
                  <div className="h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left — content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="brand">
                <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Verified
              </Badge>
              <Badge>{listing.roomType === "PRIVATE" ? "Private Room" : "Shared Room"}</Badge>
              {listing.billsIncluded && <Badge variant="green">Bills included</Badge>}
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{listing.city}, {listing.country}</span>
                {listing.address && <span>· {listing.address}</span>}
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-gray-600">New listing</span>
              </div>
            </div>

            {/* Mobile price card */}
            <Card className="lg:hidden shadow-sm border-gray-100">
              <CardContent className="p-5">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold text-gray-900">{formatPrice(listing.price, listing.currency)}</span>
                  <span className="text-gray-500 text-sm">/month</span>
                  {listing.billsIncluded && <Badge variant="green" className="text-xs">Bills included</Badge>}
                </div>
                <div className="space-y-2">
                  <ContactButton listingId={listing.id} landlordId={listing.landlord.id} />
                  <SaveButton listingId={listing.id} initialSaved={isSaved} />
                </div>
                <Separator className="my-4" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Available from</span><span className="font-semibold">{formatDate(listing.availableDate)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Room type</span><span className="font-semibold">{listing.roomType === "PRIVATE" ? "Private Room" : "Shared Room"}</span></div>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* About */}
            <Card className="border-gray-100 shadow-sm">
              <CardContent className="p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-3">About this room</h2>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">{listing.description}</p>
              </CardContent>
            </Card>

            {/* Info boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border-gray-100 shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2.5 bg-brand-50 rounded-xl border border-brand-100">
                    <Calendar className="h-5 w-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Available from</p>
                    <p className="font-semibold text-gray-900">{formatDate(listing.availableDate)}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-gray-100 shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2.5 bg-brand-50 rounded-xl border border-brand-100">
                    <Clock className="h-5 w-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Minimum stay</p>
                    <p className="font-semibold text-gray-900">1 month</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Amenities */}
            <Card className="border-gray-100 shadow-sm">
              <CardContent className="p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-4">What this place offers</h2>
                <div className="grid grid-cols-2 gap-3">
                  {amenities.map(({ key, label }) => {
                    const Icon = AMENITY_ICONS[key] ?? Wifi;
                    return (
                      <div key={key} className="flex items-center gap-2.5 text-sm text-gray-700">
                        <Icon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        {label}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Location Map */}
            <Card className="border-gray-100 shadow-sm">
              <CardContent className="p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Location</h2>
                <div className="flex justify-center">
                  <LocationMap location={cityInfo.label} coordinates={cityInfo.coords} />
                </div>
                <p className="text-xs text-gray-400 text-center mt-8">
                  Exact address shared after booking confirmation
                </p>
              </CardContent>
            </Card>

            {/* Landlord */}
            <Card className="border-gray-100 shadow-sm">
              <CardContent className="p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-4">About the landlord</h2>
                <div className="flex items-center gap-4">
                  {listing.landlord.avatar ? (
                    <Image src={listing.landlord.avatar} alt="" width={56} height={56} className="rounded-full ring-2 ring-white shadow" />
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow">
                      <span className="text-xl font-bold text-white">{(listing.landlord.name ?? "L")[0].toUpperCase()}</span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{listing.landlord.name ?? "Landlord"}</p>
                    <p className="text-sm text-gray-500">Member since {formatDate(listing.landlord.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Report */}
            <div className="pb-8">
              <ReportButton listingId={listing.id} />
            </div>
          </div>

          {/* Right — sticky price card (desktop) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-lg border-gray-100">
                <CardContent className="p-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-gray-900">{formatPrice(listing.price, listing.currency)}</span>
                    <span className="text-gray-500 text-sm">/month</span>
                  </div>
                  {listing.billsIncluded && <Badge variant="green" className="mb-4">Bills included</Badge>}

                  <div className="mt-4 space-y-3">
                    <ContactButton listingId={listing.id} landlordId={listing.landlord.id} />
                    <SaveButton listingId={listing.id} initialSaved={isSaved} />
                  </div>

                  <Separator className="my-5" />

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Available from</span>
                      <span className="font-semibold text-gray-900">{formatDate(listing.availableDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Minimum stay</span>
                      <span className="font-semibold text-gray-900">1 month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Room type</span>
                      <span className="font-semibold text-gray-900">{listing.roomType === "PRIVATE" ? "Private Room" : "Shared Room"}</span>
                    </div>
                    {listing.genderPref !== "ANY" && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Gender pref.</span>
                        <span className="font-semibold text-gray-900">{listing.genderPref === "MALE" ? "Male only" : "Female only"}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <p className="text-xs text-center text-gray-400 mt-3">
                Something wrong? <ReportButton listingId={listing.id} inline />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
