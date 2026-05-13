"use client";

import { useState } from "react";
import { Flag, X, Loader2 } from "lucide-react";
import { REPORT_REASONS } from "@/lib/utils";

export function ReportButton({ listingId, inline }: { listingId: string; inline?: boolean }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (!reason) return;
    setLoading(true);
    await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, reason, details }),
    });
    setLoading(false);
    setDone(true);
    setTimeout(() => { setOpen(false); setDone(false); }, 1500);
  };

  if (inline) {
    return (
      <button onClick={() => setOpen(true)} className="text-xs text-gray-400 hover:text-red-500 underline underline-offset-2 transition-colors">
        Report listing
      </button>
    );
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors">
        <Flag className="h-4 w-4" />
        Report this listing
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 relative">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100">
              <X className="h-4 w-4 text-gray-500" />
            </button>
            <h2 className="font-bold text-gray-900 mb-1">Report this listing</h2>
            <p className="text-sm text-gray-500 mb-4">Help us keep RoomRent safe and scam-free.</p>

            {done ? (
              <p className="text-sm text-green-600 font-medium text-center py-4">Thanks for your report! We will review it shortly.</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason</label>
                  <select value={reason} onChange={(e) => setReason(e.target.value)} className="input-field">
                    <option value="">Select a reason</option>
                    {REPORT_REASONS.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Details (optional)</label>
                  <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={3}
                    className="input-field resize-none" placeholder="Describe what seems wrong..." />
                </div>
                <button onClick={submit} disabled={!reason || loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Submit Report
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
