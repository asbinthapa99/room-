"use client";

import { useState, useEffect, useCallback, useDeferredValue } from "react";
import Link from "next/link";
import { Home, Search, CheckCircle, XCircle, ExternalLink, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface AdminListing {
  id: string;
  title: string;
  city: string;
  country: string;
  price: number;
  currency: string;
  approved: boolean;
  rented: boolean;
  createdAt: string;
  landlord: { id: string; name: string | null; email: string };
}

function statusVariant(l: AdminListing): "default" | "green" | "amber" | "destructive" {
  if (l.rented) return "default";
  if (l.approved) return "green";
  return "amber";
}
function statusLabel(l: AdminListing) {
  if (l.rented) return "Rented";
  if (l.approved) return "Live";
  return "Pending";
}

function ApproveRejectButtons({ listingId, approved, onDone }: { listingId: string; approved: boolean; onDone: () => void }) {
  const [loading, setLoading] = useState<string | null>(null);
  const act = async (action: string) => {
    setLoading(action);
    await fetch(`/api/admin/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId }),
    });
    setLoading(null);
    onDone();
  };
  return (
    <div className="flex items-center gap-2">
      {!approved && (
        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => act("approve")} disabled={!!loading}>
          {loading === "approve" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
          Approve
        </Button>
      )}
      <Button size="sm" variant="outline" className="border-red-200 text-red-700 hover:bg-red-50" onClick={() => act("remove")} disabled={!!loading}>
        {loading === "remove" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
        Remove
      </Button>
    </div>
  );
}

const FILTERS = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Live", value: "approved" },
  { label: "Rented", value: "rented" },
];

export default function AdminListingsPage() {
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const deferred = useDeferredValue(search);

  const load = useCallback(async (q: string, st: string, p: number) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p) });
    if (q) params.set("search", q);
    if (st) params.set("status", st);
    const res = await fetch(`/api/admin/listings?${params}`);
    if (res.ok) {
      const data = await res.json();
      setListings(data.listings ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.pagination?.totalPages ?? 1);
    }
    setLoading(false);
  }, []);

  useEffect(() => { void load(deferred.trim(), status, page); }, [deferred, status, page, load]);
  useEffect(() => { setPage(1); }, [deferred, status]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-50 rounded-xl border border-brand-100">
                <Home className="h-5 w-5 text-brand-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Listings</h1>
                <p className="text-xs text-gray-400 mt-0.5">{loading ? "Loading…" : `${total} total`}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-full max-w-xs">
              <Search className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search listings…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 mt-4">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatus(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  status === f.value
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
          </div>
        ) : listings.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <Home className="h-8 w-8 text-gray-200 mx-auto mb-3" />
              <p className="font-medium text-gray-500">No listings found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {listings.map((l) => (
              <Card key={l.id} className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold text-gray-900 truncate">{l.title}</p>
                      <Badge variant={statusVariant(l)} className="text-[10px] shrink-0">{statusLabel(l)}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      {l.city}, {l.country} · {l.currency === "GBP" ? "£" : "CA$"}{l.price}/mo
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      by {l.landlord.name ?? l.landlord.email} · {formatDate(new Date(l.createdAt))}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/listings/${l.id}`} target="_blank">
                        <ExternalLink className="h-3.5 w-3.5" /> View
                      </Link>
                    </Button>
                    <ApproveRejectButtons listingId={l.id} approved={l.approved} onDone={() => load(deferred.trim(), status, page)} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
