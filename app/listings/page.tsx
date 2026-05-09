import { Suspense } from "react";
import { db } from "@/lib/db";
import { ListingCard } from "@/components/listings/ListingCard";
import { SearchFilters } from "@/components/listings/SearchFilters";
import { SlidersHorizontal } from "lucide-react";

interface SearchParams {
  q?: string;
  country?: string;
  city?: string;
  roomType?: string;
  maxPrice?: string;
  availableFrom?: string;
  billsIncluded?: string;
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

  const [listings, total] = await Promise.all([
    db.listing.findMany({
      where,
      orderBy: { createdAt: "desc" },
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
    <div className="bg-gray-50 min-h-screen">
      {/* Filters bar */}
      <div className="sticky top-16 z-40 glass-nav border-t-0">
        <Suspense fallback={<div className="h-14 bg-white/80" />}>
          <SearchFilters />
        </Suspense>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-gray-400" />
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{total.toLocaleString()}</span> room{total !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {/* Grid */}
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass-card">
            <p className="text-lg font-semibold text-gray-700">No rooms found</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or search terms.</p>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <a
                key={p}
                href={`?${new URLSearchParams({ ...params, page: String(p) })}`}
                className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-colors ${
                  p === page
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {p}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
