"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";

interface Props {
  initial: {
    emailNotifications: boolean;
    messageAlerts: boolean;
    listingAlerts: boolean;
  };
}

const PREFS = [
  { key: "emailNotifications" as const, label: "Email notifications", desc: "Receive updates via email" },
  { key: "messageAlerts" as const, label: "New message alerts", desc: "Get notified about new messages" },
  { key: "listingAlerts" as const, label: "Listing alerts", desc: "New listings matching your criteria" },
];

export function NotificationSettings({ initial }: Props) {
  const [prefs, setPrefs] = useState(initial);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const toggle = async (key: keyof typeof prefs) => {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    setSaving(key);

    await fetch("/api/account/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [key]: next[key] }),
    });

    setSaving(null);
    setSaved(key);
    setTimeout(() => setSaved(null), 1500);
  };

  return (
    <div className="space-y-0">
      {PREFS.map(({ key, label, desc }) => (
        <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
          <div>
            <p className="text-sm font-medium text-gray-900">{label}</p>
            <p className="text-xs text-gray-500">{desc}</p>
          </div>
          <button
            onClick={() => toggle(key)}
            disabled={saving === key}
            className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-60"
            style={{ backgroundColor: prefs[key] ? "#2563eb" : "#d1d5db" }}
            aria-checked={prefs[key]}
            role="switch"
          >
            <span
              className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transform transition-transform"
              style={{ transform: prefs[key] ? "translateX(18px)" : "translateX(2px)" }}
            />
          </button>
          <span className="ml-2 w-4 flex-shrink-0">
            {saving === key && <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-400" />}
            {saved === key && <Check className="h-3.5 w-3.5 text-green-500" />}
          </span>
        </div>
      ))}
    </div>
  );
}
