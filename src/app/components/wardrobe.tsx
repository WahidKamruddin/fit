"use client"
import React from "react";
import Image from "next/image";
import { useInView } from "../hooks/use-in-view";

export default function Wardrobe() {
    const { ref: sectionRef, inView } = useInView()

    return (
        <section ref={sectionRef as React.RefObject<HTMLElement>} id="wardrobe" className="min-h-screen bg-off-white-100 flex items-center py-28 snap-start">
            <div className="max-w-7xl mx-auto px-8 sm:px-16 w-full">

                {/* Section label */}
                <div className={`flex items-center gap-4 mb-20 reveal ${inView ? 'is-visible' : ''}`}>
                    <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">01</span>
                    <div className="w-10 h-px bg-mocha-300" />
                    <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">Digital Wardrobe</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* Image panel */}
                    <div className={`relative reveal-left ${inView ? 'is-visible' : ''}`} style={{ transitionDelay: '0.1s' }}>
                        <Image
                            alt="virtual closet"
                            src="/closet.png"
                            className="rounded-2xl w-full drop-shadow-xl"
                            width={700}
                            height={600}
                            draggable={false}
                        />
                        {/* Decorative offset blocks */}
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-mocha-200 rounded-2xl -z-10" />
                        <div className="absolute -top-4 -left-4 w-14 h-14 border border-mocha-200 rounded-xl -z-10" />
                    </div>

                    {/* Text panel */}
                    <div className={`reveal-right ${inView ? 'is-visible' : ''}`} style={{ transitionDelay: '0.25s' }}>
                        <h2 className="font-cormorant text-5xl sm:text-6xl font-light text-mocha-500 leading-[1.05] mb-12">
                            Your entire<br />
                            wardrobe,<br />
                            <span className="italic text-mocha-400">digitized.</span>
                        </h2>

                        <div className="space-y-8">
                            {[
                                {
                                    title: "Find instantly.",
                                    desc: "Search by color, type, or style in seconds.",
                                },
                                {
                                    title: "Skip the mess.",
                                    desc: "No more digging through piles to find that one piece.",
                                },
                                {
                                    title: "And the folding.",
                                    desc: "Everything organized, always at your fingertips.",
                                },
                            ].map((item) => (
                                <div key={item.title} className="flex gap-5 items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-mocha-400 mt-2.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-mocha-500 font-semibold text-sm tracking-wide">
                                            {item.title}
                                        </p>
                                        <p className="text-mocha-400 text-sm mt-1 font-light leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
