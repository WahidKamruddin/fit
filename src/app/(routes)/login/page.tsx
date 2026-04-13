'use client'

import React from "react"
import { googleSignIn, useUser } from "../../auth/auth"
import Link from "next/link"
import { redirect } from "next/navigation"
import { FcGoogle } from "react-icons/fc"

export default function Login() {
    const user = useUser()

    if (user != null) {
        redirect('/dashboard')
    }

    return (
        <div className="min-h-screen flex">

            {/* ── Left editorial panel ─────────────────────────────── */}
            <div className="hidden lg:flex lg:w-[55%] bg-mocha-500 flex-col justify-between p-16 relative overflow-hidden">

                {/* Ambient glow */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse 65% 55% at 15% 85%, rgba(162,135,105,0.22) 0%, transparent 70%)' }}
                />

                {/* Top rule */}
                <div className="absolute top-0 left-0 right-0 h-px bg-mocha-300/20" />

                {/* Vertical side accent */}
                <div className="absolute left-10 top-0 bottom-0 flex flex-col items-center justify-center gap-6 pointer-events-none">
                    <div className="h-24 w-px bg-mocha-300/30" />
                    <span
                        className="text-[9px] tracking-[0.45em] uppercase text-mocha-300/50"
                        style={{ writingMode: 'vertical-rl' }}
                    >
                        Est. 2026
                    </span>
                    <div className="h-24 w-px bg-mocha-300/30" />
                </div>

                {/* Decorative number */}
                <div className="absolute right-10 bottom-16 pointer-events-none select-none">
                    <span className="font-cormorant text-[10rem] font-light text-mocha-400/10 leading-none">
                        02
                    </span>
                </div>

                {/* Logo */}
                <div className="relative z-10">
                    <Link
                        href="/"
                        className="font-cormorant text-2xl font-semibold tracking-[0.2em] text-mocha-100 hover:text-white transition-colors duration-300"
                    >
                        FIT.
                    </Link>
                </div>

                {/* Headline block */}
                <div className="relative z-10 pl-8">
                    <p
                        className="text-mocha-200 text-[10px] tracking-[0.5em] uppercase mb-8 animate-fade-in-up"
                        style={{ animationDelay: '0.1s' }}
                    >
                        Your Personal AI Wardrobe
                    </p>
                    <h2
                        className="font-cormorant font-light text-mocha-100 leading-[0.9] animate-fade-in-up"
                        style={{ fontSize: 'clamp(3rem, 4.5vw, 5.5rem)', animationDelay: '0.25s' }}
                    >
                        Dress for<br />
                        <span className="italic text-mocha-300">every</span><br />
                        version of you.
                    </h2>
                    <p
                        className="mt-8 text-off-white-100 text-sm font-light leading-relaxed max-w-xs animate-fade-in-up"
                        style={{ animationDelay: '0.45s' }}
                    >
                        Organize your clothes, plan outfits, and generate new looks with AI.
                    </p>
                </div>

                {/* Footer rule */}
                <div className="relative z-10">
                    <div className="h-px bg-mocha-400/40 mb-6" />
                    <p className="text-mocha-400 text-[10px] tracking-[0.35em] uppercase">
                        Beta Access — 2026
                    </p>
                </div>
            </div>

            {/* ── Right form panel ─────────────────────────────────── */}
            <div className="flex-1 bg-off-white-100 flex flex-col justify-center items-center px-8 sm:px-16 py-20 relative">

                {/* Mobile logo */}
                <div className="lg:hidden absolute top-8 left-8">
                    <Link
                        href="/"
                        className="font-cormorant text-2xl font-semibold tracking-[0.2em] text-mocha-500 hover:text-mocha-400 transition-colors duration-300"
                    >
                        FIT.
                    </Link>
                </div>

                <div className="w-full max-w-sm">

                    {/* Overline */}
                    <p
                        className="text-mocha-400 text-[10px] tracking-[0.5em] uppercase mb-6 animate-fade-in-up"
                        style={{ animationDelay: '0.2s' }}
                    >
                        Welcome back
                    </p>

                    {/* Heading */}
                    <h1
                        className="font-cormorant text-5xl sm:text-6xl font-light text-mocha-500 leading-[0.95] mb-12 animate-fade-in-up"
                        style={{ animationDelay: '0.35s' }}
                    >
                        Sign 
                        <span className="italic text-mocha-400"> in.</span>
                    </h1>

                    {/* Disabled fields */}
                    <div
                        className="space-y-6 mb-10 animate-fade-in-up"
                        style={{ animationDelay: '0.5s' }}
                    >
                        <div>
                            <label className="block text-[10px] tracking-[0.4em] uppercase text-mocha-400 mb-2.5">
                                Email
                            </label>
                            <input
                                type="text"
                                disabled
                                placeholder="— coming soon —"
                                className="w-full bg-transparent border-b border-mocha-200 py-2.5 text-mocha-300 text-sm placeholder:text-mocha-300/40 cursor-not-allowed focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] tracking-[0.4em] uppercase text-mocha-400 mb-2.5">
                                Password
                            </label>
                            <input
                                type="password"
                                disabled
                                placeholder="— coming soon —"
                                className="w-full bg-transparent border-b border-mocha-200 py-2.5 text-mocha-300 text-sm placeholder:text-mocha-300/40 cursor-not-allowed focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Divider */}
                    <div
                        className="flex items-center gap-4 mb-8 animate-fade-in"
                        style={{ animationDelay: '0.6s' }}
                    >
                        <div className="flex-1 h-px bg-mocha-200" />
                        <span className="text-[10px] tracking-[0.3em] uppercase text-mocha-300">or</span>
                        <div className="flex-1 h-px bg-mocha-200" />
                    </div>

                    {/* Google sign-in */}
                    <div
                        className="animate-fade-in-up"
                        style={{ animationDelay: '0.7s' }}
                    >
                        <button
                            type="button"
                            onClick={() => { googleSignIn() }}
                            className="w-full flex items-center justify-center gap-3 px-8 py-3.5 border border-mocha-300 text-mocha-500 text-[11px] tracking-[0.3em] uppercase rounded-full hover:bg-mocha-500 hover:text-mocha-100 hover:border-mocha-500 transition-all duration-300"
                        >
                            <FcGoogle size={15} />
                            Continue with Google
                        </button>
                    </div>

                    {/* Back link */}
                    <p
                        className="mt-10 text-center animate-fade-in"
                        style={{ animationDelay: '0.85s' }}
                    >
                        <Link
                            href="/"
                            className="text-mocha-300 text-[10px] tracking-[0.3em] uppercase hover:text-mocha-500 transition-colors duration-300"
                        >
                            ← Back to home
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
