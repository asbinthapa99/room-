import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Bell, Shield } from "lucide-react";
import { db } from "@/lib/db";
import { DeleteAccountButton } from "@/components/dashboard/DeleteAccountButton";
import { NotificationSettings } from "@/components/dashboard/NotificationSettings";

export default async function SettingsPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { clerkId },
    select: {
      id: true,
      name: true,
      email: true,
      emailNotifications: true,
      messageAlerts: true,
      listingAlerts: true,
    },
  });
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
            <NotificationSettings
              initial={{
                emailNotifications: user.emailNotifications,
                messageAlerts: user.messageAlerts,
                listingAlerts: user.listingAlerts,
              }}
            />
          </div>

          {/* Security — managed by Clerk, links out */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <Shield className="h-5 w-5 text-gray-700" />
              <div>
                <h2 className="font-bold text-gray-900">Security</h2>
                <p className="text-xs text-gray-500">Managed via your Clerk account</p>
              </div>
            </div>
            <div className="space-y-0">
              {[
                { label: "Email address", desc: user.email },
                { label: "Password & 2FA", desc: "Managed in your account portal" },
                { label: "Connected accounts", desc: "OAuth providers linked to your account" },
              ].map(({ label, desc }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[180px]">{desc}</p>
                  </div>
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
