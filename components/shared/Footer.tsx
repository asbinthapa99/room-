import Link from "next/link";
import { Home } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600">
                <Home className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">RoomRent</span>
            </Link>
            <p className="text-sm text-gray-500 max-w-xs">
              Trusted room rentals for students and newcomers moving to London and Toronto.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Browse</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/listings?city=london" className="hover:text-gray-900 transition-colors">Rooms in London</Link></li>
              <li><Link href="/listings?city=toronto" className="hover:text-gray-900 transition-colors">Rooms in Toronto</Link></li>
              <li><Link href="/listings?roomType=PRIVATE" className="hover:text-gray-900 transition-colors">Private Rooms</Link></li>
              <li><Link href="/listings?roomType=SHARED" className="hover:text-gray-900 transition-colors">Shared Rooms</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Platform</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/sign-up" className="hover:text-gray-900 transition-colors">Post a Room</Link></li>
              <li><Link href="/dashboard" className="hover:text-gray-900 transition-colors">Dashboard</Link></li>
              <li><Link href="/about" className="hover:text-gray-900 transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-gray-900 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} RoomRent. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-gray-400">
            <Link href="/privacy" className="hover:text-gray-600">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-600">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
