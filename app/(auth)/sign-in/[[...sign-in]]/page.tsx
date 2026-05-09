import { SignIn } from "@clerk/nextjs";
import { Home } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700 flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur border border-white/20">
          <Home className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-bold text-white">RoomRent</span>
      </Link>
      <div className="glass-card w-full max-w-sm overflow-visible shadow-2xl">
        <SignIn />
      </div>
    </div>
  );
}
