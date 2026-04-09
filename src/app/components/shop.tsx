"use client"
import React from "react";
import Image from "next/image";
import { useInView } from "../hooks/use-in-view";

const items = [
    { src: "img/buyJacket.svg",     label: "Jacket",      category: "Outerwear" },
    { src: "img/buyShirt.svg",      label: "Shirt",       category: "Tops" },
    { src: "img/buyTurtleneck.svg", label: "Turtleneck",  category: "Tops" },
];

export default function Shop() {
    const { ref: sectionRef, inView } = useInView()

    return (
        <section ref={sectionRef as React.RefObject<HTMLElement>} className="min-h-screen bg-off-white-100 flex items-center py-28 snap-start">
            <div className="max-w-7xl mx-auto px-8 sm:px-16 w-full">

                {/* Section label */}
                <div className={`flex items-center gap-4 mb-14 reveal ${inView ? 'is-visible' : ''}`}>
                    <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">03</span>
                    <div className="w-10 h-px bg-mocha-300" />
                    <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">Shop</span>
                </div>

                {/* Header row */}
                <div className={`flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6 reveal ${inView ? 'is-visible' : ''}`} style={{ transitionDelay: '0.1s' }}>
                    <h2 className="font-cormorant text-5xl sm:text-6xl font-light text-mocha-500 leading-[1.05]">
                        Shop<br />
                        <span className="italic text-mocha-400">Essentials.</span>
                    </h2>
                    <p className="text-mocha-400 text-sm font-light max-w-xs leading-relaxed sm:text-right">
                        Buy what you need. When you need it. Curated picks to complete your wardrobe.
                    </p>
                </div>

                {/* Product grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className={`group rounded-2xl overflow-hidden border border-mocha-200 hover:-translate-y-1 transition-all duration-500 cursor-pointer reveal ${inView ? 'is-visible' : ''}`}
                            style={{ transitionDelay: `${0.2 + i * 0.12}s` }}
                        >
                            <div className="px-10 pt-10 pb-6 flex justify-center">
                                <Image
                                    alt={item.label}
                                    src={item.src}
                                    width={280}
                                    height={280}
                                    className="w-full max-w-[200px] group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="px-6 pb-7 border-t border-mocha-200 pt-5">
                                <p className="text-[10px] tracking-[0.4em] uppercase text-mocha-400 mb-1.5">
                                    {item.category}
                                </p>
                                <p className="font-cormorant text-2xl text-mocha-500">
                                    {item.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
