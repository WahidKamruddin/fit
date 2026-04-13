"use client"

import Link from 'next/link'
import { Bug } from 'lucide-react'

// ── Swap this for your actual Google Form URL ─────────────────────────────────
const GOOGLE_FORM_URL = 'https://forms.gle/5ngofA4AdkTfkbJi6'
// ─────────────────────────────────────────────────────────────────────────────

export default function BugsPage() {
    return (
        <div className="min-h-screen bg-off-white-100 flex flex-col">

            {/* ── Header ──────────────────────────────────────────────────── */}
            <div className="px-8 sm:px-16 lg:px-24 pt-28 pb-10 border-b border-mocha-200">
                <div className="max-w-4xl mx-auto">

                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">FIT.</span>
                        <div className="w-8 h-px bg-mocha-300" />
                        <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">Bug Reports</span>
                    </div>

                    <h1 className="font-cormorant font-light text-mocha-500 leading-[0.95]"
                        style={{ fontSize: 'clamp(3rem, 6vw, 5rem)' }}>
                        Found something<br />
                        <span className="italic text-mocha-400">broken?</span>
                    </h1>
                    <p className="mt-4 text-sm font-light text-mocha-400 max-w-md leading-relaxed">
                        Help us make FIT. better. Describe what happened and we&apos;ll look into it.
                    </p>
                </div>
            </div>

            {/* ── CTA ─────────────────────────────────────────────────────── */}
            <div className="flex-1 flex items-center justify-center px-8 py-24">
                <div className="flex flex-col items-center gap-6 text-center">
                    <div className="w-14 h-14 rounded-full border border-mocha-200 flex items-center justify-center">
                        <Bug size={20} className="text-mocha-400" />
                    </div>
                    <a
                        href={GOOGLE_FORM_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 px-8 py-3.5 bg-mocha-500 text-mocha-100 text-[11px] tracking-[0.35em] uppercase rounded-full hover:bg-mocha-400 transition-all duration-300"
                    >
                        Report a Bug
                    </a>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-mocha-300">
                        Opens in Google Forms
                    </p>
                </div>
            </div>

            {/* ── Back link ───────────────────────────────────────────────── */}
            <div className="px-8 sm:px-16 lg:px-24 py-8 border-t border-mocha-200">
                <div className="max-w-4xl mx-auto">
                    <Link
                        href="/"
                        className="text-[10px] tracking-[0.35em] uppercase text-mocha-400 hover:text-mocha-500 transition-colors duration-200"
                    >
                        ← Back to FIT.
                    </Link>
                </div>
            </div>
        </div>
    )
}
