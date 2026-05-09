import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Bell, Shield } from "lucide-react";
import { db } from "@/lib/db";
import { DeleteAccountButton } from "@/components/dashboard/DeleteAccountButton";

export default async function SettingsPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await db.user.findUnique({ where: { clerkId }, select: { id: true, name: true, email: true } });
  if (!user) redirect("/onboarding");

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-sm text-gray-500 mb-8">Manage your account preferences and security.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {/* Notifications */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <Bell className="h-5 w-5 text-gray-700" />
              <div>
                <h2 className="font-bold text-gray-900">Notifications</h2>
                <p className="text-xs text-gray-500">Manage your notification preferences</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: "Email notifications", desc: "Receive updates via email", defaultChecked: true },
                { label: "New message alerts", desc: "Get notified about new messages", defaultChecked: true },
                { label: "Listing alerts", desc: "New listings matching your criteria", defaultChecked: false },
              ].map(({ label, desc, defaultChecked }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked={defaultChecked}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <Shield className="h-5 w-5 text-gray-700" />
              <div>
                <h2 className="font-bold text-gray-900">Security</h2>
                <p className="text-xs text-gray-500">Manage your account security</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: "Password", desc: "Last changed 3 months ago", action: "Change" },
                { label: "Two-factor authentication", desc: "Add an extra layer of security", action: "Enable" },
                { label: "Connected accounts", desc: "Google, Apple", action: "Manage" },
              ].map(({ label, desc, action }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                  <button className="btn-secondary text-xs px-3 py-1.5">{action}</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="glass-card p-6 border border-red-100">
          <div className="mb-4">
            <h2 className="font-bold text-red-600">Danger Zone</h2>
            <p className="text-xs text-gray-500">Irreversible account actions</p>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Delete Account</p>
              <p className="text-xs text-gray-500">Permanently delete your account and all data</p>
            </div>
            <DeleteAccountButton />
          </div>
        </div>
      </div>
    </div>
  );
}
