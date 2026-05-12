import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Zap } from "lucide-react";
import { db } from "@/lib/db";
import { ListingCard } from "@/components/listings/ListingCard";
import { Badge } from "@/components/ui/badge";
import { MetalButton } from "@/components/ui/liquid-glass-button";
import { Sparkles } from "@/components/ui/sparkles";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { HeroCinematic } from "@/components/shared/HeroCinematic";
import { ProjectShowcase } from "@/components/shared/ProjectShowcase";
import { InfiniteScrollGallery } from "@/components/ui/infinite-scroll-gallery";
import { Globe } from "@/components/ui/globe";
import { Marquee } from "@/components/ui/marquee";
import { Star } from "lucide-react";

interface Review {
  name: string;
  handle: string;
  avatar: string;
  body: string;
  rating: number;
}

function ReviewCard({ name, handle, avatar, body, rating }: Review) {
  return (
    <figure className="relative w-72 cursor-pointer rounded-2xl border border-gray-100 bg-white p-5 shadow-card hover:shadow-card-hover transition-shadow mx-2">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">{avatar}</span>
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">{name}</p>
          <p className="text-gray-400 text-xs truncate">{handle}</p>
        </div>
        <div className="ml-auto flex gap-0.5">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>
      <blockquote className="text-sm text-gray-600 leading-relaxed">&ldquo;{body}&rdquo;</blockquote>
    </figure>
  );
}

const REVIEWS: Review[] = [
  {
    name: "Amara Osei",
    handle: "@amara_london",
    avatar: "AO",
    body: "Found my room in Hackney within 3 days. The landlord was responsive and the listing was exactly as described. Couldn't be happier.",
    rating: 5,
  },
  {
    name: "Priya Nair",
    handle: "@priya.toronto",
    avatar: "PN",
    body: "As a newcomer to Toronto, this platform was a lifesaver. No scams, no fees, just genuine listings. Highly recommend to every international student.",
    rating: 5,
  },
  {
    name: "James Whitfield",
    handle: "@jwhitfield",
    avatar: "JW",
    body: "Listed my spare room and had messages within hours. The review process gave my tenants confidence in the listing too.",
    rating: 5,
  },
  {
    name: "Fatima Al-Hassan",
    handle: "@fatima.rents",
    avatar: "FA",
    body: "The messaging feature is brilliant — I sorted out a viewing, negotiated the rent, and signed a contract all without sharing my number. So safe.",
    rating: 5,
  },
  {
    name: "Diego Martínez",
    handle: "@diego_m",
    avatar: "DM",
    body: "Moved from Madrid to London and was terrified of room scams. Every listing here is vetted and I found a great flatshare in Zone 2.",
    rating: 4,
  },
  {
    name: "Yuki Tanaka",
    handle: "@yukitanaka",
    avatar: "YT",
    body: "Clean interface, no clutter. Found a private room in Scarborough, Toronto in under a week. The filters are really accurate.",
    rating: 5,
  },
  {
    name: "Chinwe Eze",
    handle: "@chinwe.eze",
    avatar: "CE",
    body: "Much better than Facebook groups. All listings have proper photos and bills info upfront. Saved me so much back-and-forth.",
    rating: 5,
  },
  {
    name: "Liam O'Connor",
    handle: "@liam_ocon",
    avatar: "LO",
    body: "Had a suspicious listing reported and it was taken down the same day. The team actually cares about quality.",
    rating: 4,
  },
];

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

async function getCityCounts() {
  try {
    const [london, toronto] = await Promise.all([
      db.listing.count({ where: { approved: true, rented: false, city: { equals: "london", mode: "insensitive" } } }),
      db.listing.count({ where: { approved: true, rented: false, city: { equals: "toronto", mode: "insensitive" } } }),
    ]);
    return { london, toronto };
  } catch {
    return { london: 0, toronto: 0 };
  }
}

const POPULAR_CITIES = [
  {
    city: "london",
    label: "London",
    country: "United Kingdom",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
  },
  {
    city: "sydney",
    label: "Sydney",
    country: "Australia",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  },
  {
    city: "toronto",
    label: "Toronto",
    country: "Canada",
    image: "https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=800&q=80",
  },
  {
    city: "newyork",
    label: "New York",
    country: "United States",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
  },
];

const SERVICE_MARKERS = [
  { id: "uk", label: "UK", location: [54.5, -3] as [number, number] },
  { id: "canada", label: "Canada", location: [56.1304, -106.3468] as [number, number] },
  { id: "us", label: "US", location: [39.8283, -98.5795] as [number, number] },
  { id: "australia", label: "Australia", location: [-25.2744, 133.7751] as [number, number] },
];

const SERVICE_ARCS = [
  {
    id: "uk-canada",
    from: SERVICE_MARKERS[0].location,
    to: SERVICE_MARKERS[1].location,
    label: "UK to Canada",
  },
  {
    id: "canada-us",
    from: SERVICE_MARKERS[1].location,
    to: SERVICE_MARKERS[2].location,
    label: "Canada to US",
  },
  {
    id: "us-australia",
    from: SERVICE_MARKERS[2].location,
    to: SERVICE_MARKERS[3].location,
    label: "US to Australia",
  },
];

const AVAILABLE_COUNTRIES = [
  { name: "United Kingdom", code: "UK" },
  { name: "Australia", code: "AU" },
  { name: "Canada", code: "CA" },
  { name: "United States", code: "US" },
];

export default async function HomePage() {
  const [listings, cityCounts] = await Promise.all([getRecentListings(), getCityCounts()]);

  return (
    <div className="bg-white">

      {/* ─── Cinematic Hero ─── */}
      <HeroCinematic />

      {/* ─── City Explorer ─── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-sm font-semibold text-brand-600 uppercase tracking-widest mb-2">Explore</p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Popular Cities</h2>
            </div>
            <Link
              href="/listings"
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 hover:text-brand-600 transition-colors"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {POPULAR_CITIES.map(({ city, label, country, image }) => {
              const count = cityCounts[city as keyof typeof cityCounts];
              return (
                <Link
                  key={city}
                  href={`/listings?city=${city}`}
                  className="relative rounded-3xl overflow-hidden group h-48 md:h-56 block"
                >
                  <Image
                    src={image}
                    alt={label}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-7">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-white/70 text-sm font-medium mb-1">{country}</p>
                        <p className="text-white font-bold text-2xl leading-none">{label}</p>
                      </div>
                      <div className="glass-panel px-3 py-2 text-right">
                        <p className="text-white font-bold text-lg leading-none">
                          {count > 0 ? count.toLocaleString() : "—"}
                        </p>
                        <p className="text-white/70 text-xs mt-0.5">listings</p>
                      </div>
                    </div>
                  </div>

                  {/* Hover arrow */}
                  <div className="absolute top-5 right-5 h-10 w-10 rounded-full bg-white/0 group-hover:bg-white/20 backdrop-blur flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                    <ArrowRight className="h-4 w-4 text-white" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Service Availability ─── */}
      <section className="py-16 md:py-24 bg-gray-50 text-gray-900 overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold text-brand-600 uppercase tracking-widest mb-3">
              Availability
            </p>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
              NestMate is built for major student destinations
            </h2>
            <p className="mt-4 max-w-xl text-sm md:text-base leading-7 text-gray-600">
              Search, list, and manage rooms across the UK, Australia, Canada, and the US from one marketplace.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:max-w-lg">
              {AVAILABLE_COUNTRIES.map((country) => (
                <div
                  key={country.code}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
                    {country.code}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {country.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Globe
            markers={SERVICE_MARKERS}
            arcs={SERVICE_ARCS}
            className="mx-auto w-full max-w-[560px]"
            baseColor={[0.93, 0.96, 1]}
            markerColor={[0.98, 0.42, 0.48]}
            arcColor={[0.98, 0.42, 0.48]}
            glowColor={[0.25, 0.36, 0.72]}
            dark={0.35}
            mapBrightness={7}
            markerSize={0.04}
            markerElevation={0.025}
            arcWidth={0.8}
            arcHeight={0.32}
            speed={0.004}
            theta={0.15}
          />
        </div>
      </section>

      <ProjectShowcase />

      {/* ─── Recent Listings ─── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-sm font-semibold text-brand-600 uppercase tracking-widest mb-2">Fresh</p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Latest Rooms</h2>
            </div>
            <Link
              href="/listings"
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 hover:text-brand-600 transition-colors"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 rounded-3xl border-2 border-dashed border-gray-200 bg-white">
              <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-gray-400" />
              </div>
              <p className="font-semibold text-gray-700 text-lg">No listings yet</p>
              <p className="text-sm text-gray-400 mt-1.5">Be the first to post a room!</p>
              <Link href="/dashboard/listings/new" className="mt-5 inline-block">
                <MetalButton variant="primary">
                  <Zap className="h-4 w-4" /> Post a Room Free
                </MetalButton>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ─── Reviews Marquee ─── */}
      <section className="py-16 md:py-24 bg-gray-50 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8 text-center">
          <p className="text-sm font-semibold text-brand-600 uppercase tracking-widest mb-3">Reviews</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">What tenants say</h2>
          <p className="text-gray-500 mt-2">Real stories from people who found their home through NestMate</p>
        </div>

        <Marquee pauseOnHover className="[--duration:35s]">
          {REVIEWS.map((r, i) => (
            <ReviewCard key={i} {...r} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:40s] mt-3">
          {REVIEWS.slice().reverse().map((r, i) => (
            <ReviewCard key={i} {...r} />
          ))}
        </Marquee>
      </section>

      {/* ─── Room Gallery ─── */}
      <section className="py-16 md:py-24 overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
          <p className="text-sm font-semibold text-brand-600 uppercase tracking-widest mb-2">Rooms</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Spaces waiting for you</h2>
        </div>
        <InfiniteScrollGallery speed={28} />
      </section>

      {/* ─── FAQ ─── */}
      <HeroHighlight containerClassName="py-16 md:py-24 min-h-0 bg-gray-50">
        <section className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold text-brand-600 uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Common questions</h2>
            <p className="text-gray-500 mt-2">Everything you need to know before you start</p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {[
              {
                q: "Is NestMate free to use?",
                a: "Yes — browsing and messaging landlords is completely free for tenants. Landlords can also list their rooms at no cost. We believe finding a home shouldn't come with extra fees.",
              },
              {
                q: "How do I know listings are genuine?",
                a: "Every listing is manually reviewed by our team before it goes live. If anything looks suspicious after approval, any user can report it and we remove it within 24 hours.",
              },
              {
                q: "Can I message a landlord before viewing?",
                a: "Absolutely. Our built-in messaging lets you ask questions, arrange viewings, and negotiate terms — all without sharing your personal contact details until you're ready.",
              },
              {
                q: "Which cities are available?",
                a: "NestMate supports the UK, Australia, Canada, and the US, with city coverage expanding around major student and newcomer destinations.",
              },
              {
                q: "How do I post a room?",
                a: "Create a free account, go to your dashboard, and click 'Post a Room'. Fill in the details, upload photos, and submit for review. Most listings are approved within a few hours.",
              },
              {
                q: "What if a landlord is unresponsive?",
                a: "If a landlord hasn't replied within a reasonable time, you can report the listing as inactive. Our team will follow up and remove it if it's no longer available.",
              },
            ].map(({ q, a }, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger>{q}</AccordionTrigger>
                <AccordionContent>{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </HeroHighlight>

      {/* ─── CTA Banner ─── */}
      <section className="py-16 md:py-24 bg-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">

            {/* Background photo */}
            <Image
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80"
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-950/80 to-gray-950/40" />

            {/* Sparkles */}
            <Sparkles
              className="absolute inset-0 w-full h-full"
              density={35}
              size={0.8}
              speed={0.25}
              opacity={0.4}
              color="#fda4af"
            />

            {/* Content */}
            <div className="relative px-8 py-16 md:px-14 md:py-24 lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">

              {/* Left: copy */}
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur px-4 py-1.5 text-xs font-semibold text-white/80 uppercase tracking-widest mb-6">
                  Free to list
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-5">
                  Have a room<br />
                  <span className="text-brand-400">to rent?</span>
                </h2>
                <p className="text-white/60 text-base md:text-lg leading-relaxed mb-8 max-w-md">
                  Post your listing in minutes. Reach thousands of students and newcomers searching for a home in London and Toronto.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/sign-up">
                    <MetalButton variant="gold">
                      Post a Room Free <ArrowRight className="h-4 w-4" />
                    </MetalButton>
                  </Link>
                  <Link href="/listings">
                    <MetalButton variant="default">
                      Browse listings
                    </MetalButton>
                  </Link>
                </div>
              </div>

              {/* Right: floating stat cards */}
              <div className="hidden lg:flex flex-col gap-4 items-end">
                {[
                  { value: "2 min", label: "Average time to post a listing", icon: "⚡" },
                  { value: "100%", label: "Free for landlords, always", icon: "🎉" },
                  { value: "24 hr", label: "Manual review turnaround", icon: "🛡️" },
                ].map(({ value, label, icon }) => (
                  <div
                    key={value}
                    className="flex items-center gap-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 px-6 py-4 w-72"
                  >
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <p className="text-2xl font-black text-white leading-none">{value}</p>
                      <p className="text-white/55 text-xs mt-0.5 leading-snug">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
