import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Bell, Shield, AlertTriangle } from "lucide-react";
import { db } from "@/lib/db";
import { DeleteAccountButton } from "@/components/dashboard/DeleteAccountButton";
import { NotificationSettings } from "@/components/dashboard/NotificationSettings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
    <div className="bg-gray-50/60 min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-5">
          <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-0.5">Dashboard</p>
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-5">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Notifications */}
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-brand-50 border border-brand-100">
                  <Bell className="h-4 w-4 text-brand-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Notifications</CardTitle>
                  <p className="text-xs text-gray-500 mt-0.5">Manage your notification preferences</p>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-5">
              <NotificationSettings
                initial={{
                  emailNotifications: user.emailNotifications,
                  messageAlerts: user.messageAlerts,
                  listingAlerts: user.listingAlerts,
                }}
              />
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gray-100 border border-gray-200">
                  <Shield className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Security</CardTitle>
                  <p className="text-xs text-gray-500 mt-0.5">Managed via your Clerk account</p>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-3 pb-1">
              {[
                { label: "Email address", desc: user.email ?? "—" },
                { label: "Password & 2FA", desc: "Managed in your account portal" },
                { label: "Connected accounts", desc: "OAuth providers linked to your account" },
              ].map(({ label, desc }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Danger zone */}
        <Card className="border-red-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-red-50 border border-red-100">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-base text-red-700">Danger Zone</CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">Irreversible account actions</p>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">Delete Account</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Permanently delete your account and all associated data.
                </p>
              </div>
              <DeleteAccountButton />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
