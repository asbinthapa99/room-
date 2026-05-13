import { Suspense } from "react";
import { db } from "@/lib/db";
import { ListingCard } from "@/components/listings/ListingCard";
import { SearchFilters } from "@/components/listings/SearchFilters";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface SearchParams {
  q?: string;
  country?: string;
  city?: string;
  roomType?: string;
  maxPrice?: string;
  availableFrom?: string;
  billsIncluded?: string;
  sort?: string;
  page?: string;
}

async function getListings(params: SearchParams) {
  const page = Math.max(1, parseInt(params.page ?? "1"));
  const limit = 12;

  const where: Record<string, unknown> = { approved: true, rented: false };
  if (params.q) where.OR = [
    { title: { contains: params.q, mode: "insensitive" } },
    { description: { contains: params.q, mode: "insensitive" } },
  ];
  if (params.country) where.country = params.country;
  if (params.city) where.city = { equals: params.city, mode: "insensitive" };
  if (params.roomType) where.roomType = params.roomType;
  if (params.maxPrice) where.price = { lte: parseFloat(params.maxPrice) };
  if (params.billsIncluded === "true") where.billsIncluded = true;
  if (params.availableFrom) where.availableDate = { lte: new Date(params.availableFrom) };

  const orderBy =
    params.sort === "price_asc" ? { price: "asc" as const } :
    params.sort === "price_desc" ? { price: "desc" as const } :
    { createdAt: "desc" as const };

  const [listings, total] = await Promise.all([
    db.listing.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { landlord: { select: { name: true, avatar: true } } },
    }),
    db.listing.count({ where }),
  ]);

  return { listings, total, page, pages: Math.ceil(total / limit) };
}

export default async function ListingsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const { listings, total, page, pages } = await getListings(params);

  return (
    <div className="bg-white min-h-screen">
      {/* Sticky filter bar */}
      <div className="sticky top-16 z-40 bg-white shadow-sm">
        <Suspense fallback={<div className="h-14 bg-white border-b border-gray-100" />}>
          <SearchFilters />
        </Suspense>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Results count */}
        <p className="text-sm text-gray-500 mb-6">
          <span className="font-semibold text-gray-900">{total.toLocaleString()}</span>{" "}
          room{total !== 1 ? "s" : ""} available
        </p>

        {/* Grid */}
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-6 w-6 text-gray-400" />
            </div>
            <p className="font-semibold text-gray-700 text-lg">No rooms found</p>
            <p className="text-sm text-gray-400 mt-1.5">Try adjusting your filters or search terms.</p>
            <Link href="/listings" className="btn-secondary inline-flex mt-5">Clear filters</Link>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <a
              href={`?${new URLSearchParams({ ...params, page: String(page - 1) })}`}
              className={`flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors ${page === 1 ? "pointer-events-none opacity-40" : ""}`}
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </a>

            <div className="flex items-center gap-1">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`?${new URLSearchParams({ ...params, page: String(p) })}`}
                  className={`h-9 w-9 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    p === page
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {p}
                </a>
              ))}
            </div>

            <a
              href={`?${new URLSearchParams({ ...params, page: String(page + 1) })}`}
              className={`flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors ${page === pages ? "pointer-events-none opacity-40" : ""}`}
            >
              Next <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
