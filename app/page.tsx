import Link from "next/link";
import Image from "next/image";
import { Search, Shield, MessageSquare, ArrowRight, MapPin, Star } from "lucide-react";
import { db } from "@/lib/db";
import { ListingCard } from "@/components/listings/ListingCard";

async function getRecentListings() {
  try {
    return await db.listing.findMany({
      where: { approved: true, rented: false },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { landlord: { select: { name: true, avatar: true } } },
    });
  } catch {
    return [];
  }
}

const POPULAR_CITIES = [
  { city: "london", label: "London", country: "UK", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80", listings: 1234 },
  { city: "toronto", label: "Toronto", country: "Canada", image: "https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=600&q=80", listings: 856 },
];

export default async function HomePage() {
  const listings = await getRecentListings();

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs font-medium mb-5">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              Trusted by students &amp; newcomers worldwide
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
              Find your perfect room in London or Toronto
            </h1>
            <p className="text-base sm:text-lg text-blue-100 mb-8">
              Verified listings, no scams, no middlemen. Connect directly with landlords.
            </p>

            {/* Search bar */}
            <div className="bg-white rounded-xl p-3 flex flex-col sm:flex-row gap-3 shadow-xl">
              <select className="flex-1 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select city</option>
                <option value="london">London, UK</option>
                <option value="toronto">Toronto, Canada</option>
              </select>
              <select className="flex-1 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Any room type</option>
                <option value="PRIVATE">Private Room</option>
                <option value="SHARED">Shared Room</option>
              </select>
              <Link
                href="/listings"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap"
              >
                <Search className="h-4 w-4" />
                Search Rooms
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-12 md:py-16 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Popular Cities</h2>
              <p className="text-sm text-gray-500 mt-0.5">Explore rooms in top student destinations</p>
            </div>
            <Link href="/listings" className="text-sm font-medium text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {POPULAR_CITIES.map(({ city, label, image, listings: count }) => (
              <Link
                key={city}
                href={`/listings?city=${city}`}
                className="relative rounded-xl overflow-hidden h-40 sm:h-48 group"
              >
                <Image
                  src={image}
                  alt={label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-bold text-lg leading-none">{label}</p>
                  <p className="text-sm text-white/80 mt-1">{count.toLocaleString()} listings available</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Listings */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Latest Rooms</h2>
              <p className="text-sm text-gray-500 mt-0.5">Fresh listings updated daily</p>
            </div>
            <Link href="/listings" className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
              <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-3" />
              <p className="font-medium text-gray-500">No listings yet</p>
              <p className="text-sm text-gray-400 mt-1">Be the first to post a room!</p>
              <Link href="/sign-up" className="btn-primary inline-flex mt-4">Post a Room Free</Link>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 border-t border-gray-100 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xl font-bold text-gray-900">How RoomRent works</h2>
            <p className="text-sm text-gray-500 mt-1">Simple, safe, and transparent</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Search, title: "Search & Filter", desc: "Browse rooms by city, budget, room type, and move-in date. Every listing is manually reviewed before going live." },
              { icon: MessageSquare, title: "Message Directly", desc: "Contact landlords directly through our built-in messaging. No hidden fees or middlemen — just direct communication." },
              { icon: Shield, title: "Move In Safely", desc: "Report suspicious listings instantly. Our team reviews every report and removes bad actors fast." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 mb-4">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-blue-600 p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Have a room to rent?</h2>
            <p className="text-blue-100 mb-6 max-w-md mx-auto text-sm sm:text-base">
              Post your listing in minutes and reach students and newcomers looking for a home.
            </p>
            <Link href="/sign-up" className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm">
              Post a Room Free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
