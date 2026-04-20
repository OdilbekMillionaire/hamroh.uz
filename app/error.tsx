"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="uz">
      <body className="min-h-screen bg-[#F7F9FA] flex items-center justify-center p-4" style={{ fontFamily: "system-ui, sans-serif" }}>
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#D8E2E9] shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-[#E74C3C]" />
          </div>

          <h1 className="text-xl font-bold text-[#1A2733] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
            Something went wrong
          </h1>
          <p className="text-sm text-[#4A6274] leading-relaxed mb-6">
            An unexpected error occurred. Please try again. If the problem persists, contact{" "}
            <a href="mailto:help@hamroh.uz" className="text-[#0E6E7E] underline">help@hamroh.uz</a>.
          </p>

          {error.digest && (
            <p className="text-xs text-[#8FA5B5] font-mono mb-6 bg-[#F7F9FA] rounded-lg px-3 py-2">
              Error ID: {error.digest}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={reset}
              className="flex-1 flex items-center justify-center gap-2 bg-[#0E6E7E] text-white font-semibold py-3 rounded-xl hover:bg-[#0B5A6A] transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
            <a
              href="/uz"
              className="flex-1 flex items-center justify-center gap-2 border border-[#D8E2E9] text-[#4A6274] font-semibold py-3 rounded-xl hover:border-[#0E6E7E] hover:text-[#0E6E7E] transition-colors"
            >
              <Home className="w-4 h-4" /> Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
