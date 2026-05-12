"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log to error reporting service in production
    if (process.env.NODE_ENV === "production") return;
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 mb-6">
        <AlertTriangle className="h-7 w-7 text-red-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
      <p className="text-sm text-gray-500 max-w-sm mb-8">
        An unexpected error occurred. Please try again or contact support if the problem persists.
      </p>
      <button onClick={reset} className="btn-primary">
        Try Again
      </button>
    </div>
  );
}
