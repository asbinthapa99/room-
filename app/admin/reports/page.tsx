"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Flag, CheckCircle, XCircle, ExternalLink, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface AdminReport {
  id: string;
  reason: string;
  details: string | null;
  resolved: boolean;
  createdAt: string;
  listingId: string;
  listing: { title: string };
  reporter: { name: string | null };
}

const REASON_LABELS: Record<string, string> = {
  FAKE_LISTING: "Fake listing",
  SUSPICIOUS_LANDLORD: "Suspicious landlord",
  SPAM: "Spam",
  INAPPROPRIATE_CONTENT: "Inappropriate",
  OTHER: "Other",
};

function ReportActions({ report, onDone }: { report: AdminReport; onDone: () => void }) {
  const [loading, setLoading] = useState<string | null>(null);

  const resolve = async () => {
    setLoading("resolve");
    await fetch("/api/admin/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportId: report.id }),
    });
    setLoading(null);
    onDone();
  };

  const remove = async () => {
    setLoading("remove");
    await fetch("/api/admin/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId: report.listingId, reportId: report.id }),
    });
    setLoading(null);
    onDone();
  };

  if (report.resolved) {
    return <Badge variant="green" className="text-xs">Resolved</Badge>;
  }

  return (
    <div className="flex items-center gap-2">
      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={resolve} disabled={!!loading}>
        {loading === "resolve" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
        Dismiss
      </Button>
      <Button size="sm" variant="outline" className="border-red-200 text-red-700 hover:bg-red-50" onClick={remove} disabled={!!loading}>
        {loading === "remove" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
        Remove Listing
      </Button>
    </div>
  );
}

const FILTERS = [
  { label: "Open", value: "open" },
  { label: "Resolved", value: "resolved" },
  { label: "All", value: "all" },
];

export default function AdminReportsPage() {
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("open");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (f: string, p: number) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), filter: f });
    const res = await fetch(`/api/admin/reports?${params}`);
    if (res.ok) {
      const data = await res.json();
      setReports(data.reports ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.pagination?.totalPages ?? 1);
    }
    setLoading(false);
  }, []);

  useEffect(() => { void load(filter, page); }, [filter, page, load]);
  useEffect(() => { setPage(1); }, [filter]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-50 rounded-xl border border-red-100">
              <Flag className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Reports</h1>
              <p className="text-xs text-gray-400 mt-0.5">{loading ? "Loading…" : `${total} reports`}</p>
            </div>
          </div>
          <div className="flex gap-1">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === f.value ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"
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
        ) : reports.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <CheckCircle className="h-8 w-8 text-green-300 mx-auto mb-3" />
              <p className="font-medium text-gray-500">
                {filter === "open" ? "No open reports — all clear!" : "No reports found"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {reports.map((r) => (
              <Card key={r.id} className={`shadow-sm hover:shadow-md transition-shadow ${r.resolved ? "border-gray-100 opacity-70" : "border-red-100"}`}>
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge variant="destructive" className="text-[10px] shrink-0">
                        {REASON_LABELS[r.reason] ?? r.reason}
                      </Badge>
                      {r.resolved && <Badge variant="green" className="text-[10px]">Resolved</Badge>}
                      <span className="text-[10px] text-gray-400">{formatDate(new Date(r.createdAt))}</span>
                    </div>
                    <p className="font-semibold text-gray-900 truncate">{r.listing.title}</p>
                    {r.details && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{r.details}</p>}
                    <p className="text-xs text-gray-400 mt-1">by {r.reporter.name ?? "user"}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/listings/${r.listingId}`} target="_blank">
                        <ExternalLink className="h-3.5 w-3.5" /> View
                      </Link>
                    </Button>
                    <ReportActions report={r} onDone={() => load(filter, page)} />
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
