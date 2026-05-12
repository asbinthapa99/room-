import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 mb-6">
        <Search className="h-7 w-7 text-blue-400" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <p className="text-lg font-semibold text-gray-700 mb-2">Page not found</p>
      <p className="text-sm text-gray-500 max-w-sm mb-8">
        The page you are looking for does not exist or may have been removed.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/" className="btn-primary gap-2">
          <Home className="h-4 w-4" /> Back to Home
        </Link>
        <Link href="/listings" className="btn-secondary gap-2">
          <Search className="h-4 w-4" /> Browse Listings
        </Link>
      </div>
    </div>
  );
}
