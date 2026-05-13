"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md w-full">
        {/* Icon */}
        <div className="relative inline-flex mb-8">
          <div className="h-20 w-20 rounded-3xl bg-red-50 flex items-center justify-center">
            <AlertTriangle className="h-9 w-9 text-red-500" />
          </div>
          <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center animate-pulse">!</span>
        </div>

        {/* Copy */}
        <h2 className="text-3xl font-black text-gray-900 mb-3">Something went wrong</h2>
        <p className="text-gray-500 leading-relaxed mb-2">
          An unexpected error occurred. This has been logged and our team will look into it.
        </p>
        {error.digest && (
          <p className="text-xs text-gray-400 font-mono mb-8">
            Error ID: {error.digest}
          </p>
        )}
        {!error.digest && <div className="mb-8" />}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" onClick={reset}>
            <RotateCcw className="h-4 w-4" /> Try Again
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/">
              <Home className="h-4 w-4" /> Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
