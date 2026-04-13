"use client"
import React from "react";
import { useTypewriter } from "react-simple-typewriter";
import Image from "next/image";
import { useInView } from "../hooks/use-in-view";

function ScoreDots({ filled }: { filled: number }) {
    return (
        <span className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <span
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${i < filled ? 'bg-mocha-500' : 'bg-mocha-200'}`}
                />
            ))}
        </span>
    );
}

function MockPill({ label, active }: { label: string; active?: boolean }) {
    return (
        <span className={`px-3 py-1 rounded-full text-[8px] tracking-[0.25em] uppercase whitespace-nowrap select-none ${
            active
                ? 'bg-mocha-500 text-mocha-100'
                : 'border border-mocha-200 text-mocha-400'
        }`}>
            {label}
        </span>
    );
}

function MockSlotBox({ label, src, imgClassName }: { label: string; src?: string; imgClassName?: string }) {
    return (
        <div className="border border-dashed border-mocha-300 rounded-xl aspect-square flex flex-col justify-center items-center overflow-hidden bg-white/40">
            {src ? (
                <Image
                    src={src}
                    alt={label}
                    width={120}
                    height={120}
                    className={`w-full h-full object-contain transition-transform duration-300 hover:scale-110 ${imgClassName ?? 'p-2'}`}
                    draggable={false}
                />
            ) : (
                <p className="text-[7px] tracking-[0.3em] uppercase text-mocha-300">{label}</p>
            )}
        </div>
    );
}

export default function AiOutfitFeature() {
    const [style] = useTypewriter({
        words: ["Minimal", "Casual", "Goth", "Formal", "Soft", "Old Money"],
        loop: true,
        typeSpeed: 120,
        deleteSpeed: 90,
    });

    const [theme] = useTypewriter({
        words: ["Sporty", "Smart", "Cheery", "Cozy", "Techy", "Retro"],
        loop: true,
        typeSpeed: 120,
        deleteSpeed: 90,
    });

    const { ref: sectionRef, inView } = useInView()

    return (
        <section ref={sectionRef as React.RefObject<HTMLElement>} className="min-h-screen bg-mocha-100 flex items-center py-28 snap-start">
            <div className="max-w-7xl mx-auto px-8 sm:px-16 w-full">

                {/* Section label */}
                <div className={`flex items-center gap-4 mb-20 reveal ${inView ? 'is-visible' : ''}`}>
                    <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">02</span>
                    <div className="w-10 h-px bg-mocha-300" />
                    <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">AI Outfits</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* Text side */}
                    <div className={`reveal-left ${inView ? 'is-visible' : ''}`} style={{ transitionDelay: '0.1s' }}>
                        <h2 className="font-cormorant text-5xl sm:text-6xl font-light text-mocha-500 leading-[1.05] mb-14">
                            Dress for<br />
                            <span className="italic text-mocha-400">every</span><br />
                            version of you.
                        </h2>

                        {/* Typewriter blocks */}
                        <div className="space-y-0">
                            <div className="py-8 border-t border-mocha-300">
                                <p className="text-[10px] tracking-[0.45em] uppercase text-mocha-400 mb-3">
                                    Style
                                </p>
                                <p className="font-cormorant text-4xl sm:text-5xl text-mocha-500 font-medium min-h-[3.5rem]">
                                    {style}
                                    <span className="text-mocha-300">.</span>
                                </p>
                            </div>

                            <div className="py-8 border-t border-mocha-300">
                                <p className="text-[10px] tracking-[0.45em] uppercase text-mocha-400 mb-3">
                                    Vibe
                                </p>
                                <p className="font-cormorant text-4xl sm:text-5xl text-mocha-500 font-medium min-h-[3.5rem]">
                                    {theme}
                                    <span className="text-mocha-300">.</span>
                                </p>
                            </div>

                            <div className="border-t border-mocha-300 pt-8">
                                <p className="text-mocha-400 text-sm font-light leading-relaxed max-w-xs">
                                    {"Choose from hundreds of different styles and vibes, or let the AI pick based on your mood and what's in your closet."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Mock modal showcase */}
                    <div className={`relative reveal-right ${inView ? 'is-visible' : ''}`} style={{ transitionDelay: '0.25s' }}>

                        {/* Decorative offset blocks */}
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-mocha-200 rounded-2xl -z-10" />
                        <div className="absolute -top-4 -left-4 w-14 h-14 border border-mocha-200 rounded-xl -z-10" />

                        {/* Modal card */}
                        <div className="w-full bg-off-white-100 rounded-3xl p-6 shadow-2xl shadow-mocha-300/20 select-none pointer-events-none [&_img]:pointer-events-auto">

                            {/* Header */}
                            <p className="text-[8px] tracking-[0.5em] uppercase text-mocha-400 mb-1">AI Generate</p>
                            <h2 className="font-cormorant text-3xl font-light text-mocha-500 leading-tight mb-4">
                                Build a<br />
                                <span className="italic text-mocha-400">look for me.</span>
                            </h2>

                            {/* Preferences */}
                            <div className="space-y-2.5 mb-4">
                                <div>
                                    <p className="text-[7px] tracking-[0.4em] uppercase text-mocha-400 mb-1.5">Vibe</p>
                                    <div className="flex flex-wrap gap-1">
                                        <MockPill label="Casual" active />
                                        <MockPill label="Minimalist" active />
                                        <MockPill label="Streetwear" />
                                        <MockPill label="Formal" />
                                        <MockPill label="Preppy" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[7px] tracking-[0.4em] uppercase text-mocha-400 mb-1.5">Style</p>
                                    <div className="flex flex-wrap gap-1">
                                        <MockPill label="Basic" active />
                                        <MockPill label="Versatile" active />
                                        <MockPill label="Statement" />
                                        <MockPill label="Layering" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[7px] tracking-[0.4em] uppercase text-mocha-400 mb-1.5">Weather</p>
                                    <div className="flex flex-wrap gap-1">
                                        <MockPill label="Mild" active />
                                        <MockPill label="Warm" />
                                        <MockPill label="Cool" />
                                        <MockPill label="Rainy" />
                                    </div>
                                </div>
                            </div>

                            {/* Generate button */}
                            <div className="w-full py-2.5 bg-mocha-500 text-mocha-100 text-[9px] tracking-[0.3em] uppercase rounded-full text-center mb-4">
                                Generate Look
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-mocha-200 mb-4" />

                            {/* Preview grid */}
                            <div className="grid grid-cols-3 gap-2 mb-2">
                                <MockSlotBox label="Outerwear" src="/jacket.png" imgClassName="p-0.5" />
                                <MockSlotBox label="Top" src="/tshirt.png" imgClassName="p-0.5" />
                                <MockSlotBox label="Bottom" src="/pants.png" imgClassName="p-4" />
                            </div>

                            {/* Scores */}
                            <div className="space-y-1.5 mb-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[7px] tracking-[0.35em] uppercase text-mocha-400">Warmth</span>
                                    <ScoreDots filled={3} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[7px] tracking-[0.35em] uppercase text-mocha-400">Comfort</span>
                                    <ScoreDots filled={5} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[7px] tracking-[0.35em] uppercase text-mocha-400">Confidence</span>
                                    <ScoreDots filled={4} />
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1 mb-1.5">
                                {['casual', 'minimalist'].map(v => (
                                    <span key={v} className="px-2 py-0.5 bg-mocha-100 text-mocha-500 rounded-full text-[7px] tracking-[0.2em] uppercase">{v}</span>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-1 mb-4">
                                {['mild', 'warm'].map(w => (
                                    <span key={w} className="px-2 py-0.5 border border-mocha-200 text-mocha-400 rounded-full text-[7px] tracking-[0.2em] uppercase">{w}</span>
                                ))}
                            </div>

                            {/* Save button */}
                            <div className="w-full py-2.5 bg-mocha-500 text-mocha-100 text-[9px] tracking-[0.3em] uppercase rounded-full text-center">
                                Save Look
                            </div>
                        </div>

                        <p className="mt-5 text-center text-mocha-400 text-[10px] tracking-[0.4em] uppercase">
                            AI Generated Outfits
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
