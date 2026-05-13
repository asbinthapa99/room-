"use client";

import { useState, useEffect, useCallback, useDeferredValue } from "react";
import { Search, Users, ShieldOff, ShieldCheck, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  role: "RENTER" | "LANDLORD" | "ADMIN";
  banned: boolean;
  createdAt: string;
  _count: { listings: number; sentMessages: number };
}

const ROLE_VARIANT: Record<string, "default" | "brand" | "green" | "amber" | "destructive" | "dark"> = {
  ADMIN: "dark",
  LANDLORD: "brand",
  RENTER: "default",
};

function BanToggle({ userId, banned, onDone }: { userId: string; banned: boolean; onDone: () => void }) {
  const [loading, setLoading] = useState(false);
  const toggle = async () => {
    setLoading(true);
    await fetch("/api/admin/ban", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ban: !banned }),
    });
    setLoading(false);
    onDone();
  };
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={toggle}
      disabled={loading}
      className={banned ? "border-green-200 text-green-700 hover:bg-green-50" : "border-red-200 text-red-700 hover:bg-red-50"}
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : banned ? <ShieldCheck className="h-3.5 w-3.5" /> : <ShieldOff className="h-3.5 w-3.5" />}
      {banned ? "Unban" : "Ban"}
    </Button>
  );
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const deferred = useDeferredValue(search);

  const load = useCallback(async (q: string, p: number) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), limit: "20" });
    if (q) params.set("search", q);
    const res = await fetch(`/api/admin/users?${params}`);
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.pagination?.totalPages ?? 1);
    }
    setLoading(false);
  }, []);

  useEffect(() => { void load(deferred.trim(), page); }, [deferred, page, load]);
  useEffect(() => { setPage(1); }, [deferred]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-50 rounded-xl border border-violet-100">
              <Users className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Users</h1>
              <p className="text-xs text-gray-400 mt-0.5">{loading ? "Loading…" : `${total} total`}</p>
            </div>
          </div>
          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-full max-w-xs">
            <Search className="h-4 w-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
          </div>
        ) : users.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <Users className="h-8 w-8 text-gray-200 mx-auto mb-3" />
              <p className="font-medium text-gray-500">No users found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {users.map((u) => (
              <Card key={u.id} className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  {/* Avatar */}
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-white">{(u.name ?? u.email)[0].toUpperCase()}</span>
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900 truncate">{u.name ?? "—"}</p>
                      <Badge variant={ROLE_VARIANT[u.role] ?? "default"} className="text-[10px]">{u.role}</Badge>
                      {u.banned && <Badge variant="destructive" className="text-[10px]">Banned</Badge>}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{u.email}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {u._count.listings} listing{u._count.listings !== 1 ? "s" : ""} · joined {formatDate(new Date(u.createdAt))}
                    </p>
                  </div>
                  {/* Actions */}
                  {u.role !== "ADMIN" && (
                    <BanToggle userId={u.id} banned={u.banned} onDone={() => load(deferred.trim(), page)} />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
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
