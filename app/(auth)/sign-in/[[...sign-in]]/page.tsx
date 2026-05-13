import { SignIn } from "@clerk/nextjs";
import { Home, Shield, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { isClerkConfigured } from "@/lib/clerk-config";

export default function SignInPage() {
  if (!isClerkConfigured) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
        <Link href="/" className="flex items-center gap-2.5 mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600">
            <Home className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">RoomRent</span>
        </Link>
        <div className="w-full max-w-sm card p-6">
          <h1 className="text-lg font-semibold text-gray-900">Auth not configured</h1>
          <p className="mt-2 text-sm text-gray-500">
            Add valid Clerk keys to .env.local to enable authentication.
          </p>
          <Link href="/" className="flex items-center justify-center w-full mt-4 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">Go home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col bg-gray-900 p-10">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=80"
            alt="Room interior"
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 to-gray-900/90" />
        </div>
        <div className="relative">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600">
              <Home className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">RoomRent</span>
          </Link>
        </div>
        <div className="relative mt-auto space-y-4">
          <p className="text-2xl font-bold text-white leading-tight">
            Find your perfect room in London or Toronto
          </p>
          <div className="flex flex-col gap-2">
            {[
              { icon: Shield, text: "Verified listings only" },
              { icon: Star, text: "Trusted by thousands" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-white/70 text-sm">
                <Icon className="h-4 w-4 text-brand-400 shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="lg:hidden mb-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600">
              <Home className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">RoomRent</span>
          </Link>
        </div>
        <SignIn />
      </div>
    </div>
  );
}
