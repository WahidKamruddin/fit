"use client";

import Link from "next/link";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative min-h-screen bg-off-white-100 flex flex-col items-center justify-center overflow-hidden">

      {/* Decorative rule — offset left, mirroring not-found */}
      <div
        className="absolute left-0 top-1/2 w-24 h-px bg-mocha-200 animate-fade-in"
        style={{ animationDelay: '0.05s' }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-start px-8 sm:px-20 max-w-2xl w-full">

        {/* Overline */}
        <div
          className="flex items-center gap-4 mb-7 animate-fade-in"
          style={{ animationDelay: '0.1s' }}
        >
          <span className="text-[10px] tracking-[0.55em] uppercase text-mocha-300">
            Error
          </span>
          <div className="w-8 h-px bg-mocha-300" />
          <span className="text-[10px] tracking-[0.55em] uppercase text-mocha-300">
            Unexpected
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-cormorant font-light text-mocha-500 leading-[1.0] animate-fade-in-up"
          style={{ fontSize: 'clamp(3.2rem, 7vw, 5.5rem)', animationDelay: '0.18s' }}
        >
          Something went<br />
          <span className="italic text-mocha-400">wrong.</span>
        </h1>

        {/* Divider */}
        <div
          className="mt-8 w-16 h-px bg-mocha-200 animate-fade-in"
          style={{ animationDelay: '0.3s' }}
        />

        {/* Body */}
        <p
          className="mt-6 text-sm text-mocha-400 leading-relaxed max-w-xs animate-fade-in"
          style={{ animationDelay: '0.38s' }}
        >
          An unexpected error occurred. You can try again or head back to safety.
        </p>

        {/* Error digest (if present) — subtle reference for debugging */}
        {error.digest && (
          <p
            className="mt-3 text-[10px] tracking-[0.3em] uppercase text-mocha-200 animate-fade-in"
            style={{ animationDelay: '0.42s' }}
          >
            Ref: {error.digest}
          </p>
        )}

        {/* CTAs */}
        <div
          className="mt-10 flex items-center gap-4 animate-fade-in"
          style={{ animationDelay: '0.48s' }}
        >
          <button
            onClick={reset}
            className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-mocha-500 text-mocha-100 text-[10px] tracking-[0.4em] uppercase hover:bg-mocha-400 transition-all duration-300"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-8 py-3 rounded-full border border-mocha-300 text-[10px] tracking-[0.4em] uppercase text-mocha-400 hover:border-mocha-400 hover:text-mocha-500 transition-all duration-300"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
