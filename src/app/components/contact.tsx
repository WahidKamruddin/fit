"use client"
import React from "react";
import { AiFillLinkedin, AiFillGithub } from "react-icons/ai";
import { BsBell } from "react-icons/bs";
import { TbLetterW, TbLetterK } from "react-icons/tb";
import { useInView } from "../hooks/use-in-view";

export default function Contact() {
    const { ref: sectionRef, inView } = useInView()

    return (
        <section ref={sectionRef as React.RefObject<HTMLElement>} id="notif" className="min-h-screen bg-mocha-500 flex items-center py-28 snap-start">
            <div className="max-w-7xl mx-auto px-8 sm:px-16 w-full">

                {/* Main CTA block */}
                <div className={`max-w-2xl reveal ${inView ? 'is-visible' : ''}`} style={{ transitionDelay: '0.1s' }}>
                    <p className="text-mocha-300 text-[10px] tracking-[0.5em] uppercase mb-10">
                        Stay in the loop
                    </p>

                    <h2 className="font-cormorant text-6xl sm:text-7xl md:text-8xl font-light text-mocha-100 leading-[0.9] mb-12">
                        Get notified<br />
                        <span className="italic text-mocha-300">first.</span>
                    </h2>

                    <p className="text-mocha-200/80 text-base sm:text-lg font-light leading-relaxed mb-12 max-w-md">
                        {"Lose the pile of clothes on your bed. Sign up for FIT Beta — we'll let you know the moment we're ready."}
                    </p>

                    <a
                        href="https://forms.gle/fedR43dq635K6jdH7"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-mocha-100 text-mocha-500 text-[11px] tracking-[0.35em] uppercase font-bold rounded-full hover:bg-white hover:scale-105 transition-all duration-300"
                    >
                        Notify Me
                        <BsBell size={14} />
                    </a>
                </div>

                {/* Divider + social links */}
                <div className={`mt-28 pt-10 border-t border-mocha-400/50 reveal ${inView ? 'is-visible' : ''}`} style={{ transitionDelay: '0.35s' }}>
                    <p className="text-mocha-300/60 text-[10px] tracking-[0.45em] uppercase mb-8">
                        Find me here
                    </p>
                    <div className="flex gap-4 items-center">
                        <a
                            href="https://www.linkedin.com/in/wahid-kamruddin-191248209/"
                            target="_blank"
                            rel="noreferrer"
                            className="w-11 h-11 rounded-full border border-mocha-400 flex items-center justify-center text-mocha-300 hover:border-mocha-100 hover:text-mocha-100 hover:scale-110 transition-all duration-300"
                            aria-label="LinkedIn"
                        >
                            <AiFillLinkedin size={18} />
                        </a>
                        <a
                            href="https://wahidkamruddin.netlify.app/"
                            target="_blank"
                            rel="noreferrer"
                            className="w-11 h-11 rounded-full border border-mocha-400 flex items-center justify-center text-mocha-300 hover:border-mocha-100 hover:text-mocha-100 hover:scale-110 transition-all duration-300"
                            aria-label="Portfolio"
                        >
                            <span className="flex items-center text-xs font-bold leading-none">
                                <TbLetterW size={13} />
                                <TbLetterK size={13} />
                            </span>
                        </a>
                        <a
                            href="https://github.com/WahidKamruddin"
                            target="_blank"
                            rel="noreferrer"
                            className="w-11 h-11 rounded-full border border-mocha-400 flex items-center justify-center text-mocha-300 hover:border-mocha-100 hover:text-mocha-100 hover:scale-110 transition-all duration-300"
                            aria-label="GitHub"
                        >
                            <AiFillGithub size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
