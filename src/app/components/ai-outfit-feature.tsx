"use client"
import React from "react";
import { useTypewriter } from "react-simple-typewriter";
import Image from "next/image";
import { useInView } from "../hooks/use-in-view";

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

                    {/* Outfit showcase */}
                    <div className={`bg-mocha-500 rounded-3xl p-8 sm:p-10 reveal-right ${inView ? 'is-visible' : ''}`} style={{ transitionDelay: '0.25s' }}>
                        <div className="bg-mocha-100/15 rounded-2xl p-5 flex gap-4 justify-center items-stretch">
                            <Image
                                alt="outfit 1"
                                src="./img/fit1.svg"
                                className="w-[46%] rounded-xl object-cover"
                                width={500}
                                height={500}
                            />
                            <Image
                                alt="outfit 2"
                                src="./img/fit2.svg"
                                className="w-[46%] rounded-xl object-cover"
                                width={500}
                                height={500}
                            />
                        </div>
                        <p className="mt-5 text-center text-mocha-300 text-[10px] tracking-[0.4em] uppercase">
                            AI Generated Outfits
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
