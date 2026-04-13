"use client"
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { useInView } from "../hooks/use-in-view";

const faqs = [
  {
    q: "What is FIT?",
    a: "FIT is a digital wardrobe platform that helps you organise your clothes, build outfits, and plan what to wear — all in one place. Think of it as your personal stylist, built into your browser.",
  },
  {
    q: "Is FIT free to use?",
    a: "During Beta, FIT is completely free. We'll introduce optional premium tiers when we launch fully, but core wardrobe features will always remain accessible.",
  },
  {
    q: "How does the AI outfit generator work?",
    a: "Once your closet is populated, our AI analyses your pieces — colours, styles, and types — and suggests cohesive outfits tailored to occasion, season, or mood.",
  },
  {
    q: "What clothing types does FIT support?",
    a: "Currently FIT supports Outerwear, Tops, and Bottoms. Shoes, accessories, and full looks are planned for upcoming releases.",
  },
  {
    q: "Is my wardrobe data private?",
    a: "Yes. Your wardrobe is tied to your account and never shared. We don't sell data or use your clothing photos for advertising.",
  },
  {
    q: "When does the full version launch?",
    a: "We're targeting a full public launch in late 2025. Sign up for early access to be the first to know when we're ready.",
  },
];

export default function Faq() {
  const { ref: sectionRef, inView } = useInView();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="faq"
      className="min-h-screen bg-off-white-100 flex items-center py-28 snap-start"
    >
      <div className="max-w-7xl mx-auto px-8 sm:px-16 w-full">

        {/* Section label */}
        <div className={`flex items-center gap-4 mb-20 reveal ${inView ? "is-visible" : ""}`}>
          <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">05</span>
          <div className="w-10 h-px bg-mocha-300" />
          <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">FAQ</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left: heading */}
          <div className={`reveal-left ${inView ? "is-visible" : ""}`} style={{ transitionDelay: "0.1s" }}>
            <h2 className="font-cormorant text-5xl sm:text-6xl font-light text-mocha-500 leading-[1.05]">
              Questions,<br />
              <span className="italic text-mocha-400">answered.</span>
            </h2>
            <p className="mt-8 text-mocha-400 text-sm font-light leading-relaxed max-w-xs">
              Everything you need to know about FIT — how it works, what{"'"}s coming, and why we{"'"}re building it.
            </p>
            <div className="mt-10 w-12 h-px bg-mocha-300" />
          </div>

          {/* Right: accordion */}
          <div className={`reveal ${inView ? "is-visible" : ""}`} style={{ transitionDelay: "0.2s" }}>
            {faqs.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={i} className="border-b border-mocha-200/70 last:border-b-0">
                  <button
                    onClick={() => toggle(i)}
                    className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                    aria-expanded={isOpen}
                  >
                    <span className={`font-cormorant text-xl sm:text-2xl font-light leading-snug transition-colors duration-200 ${
                      isOpen ? "text-mocha-500" : "text-mocha-400 group-hover:text-mocha-500"
                    }`}>
                      {item.q}
                    </span>
                    <span className={`flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-200 ${
                      isOpen
                        ? "bg-mocha-500 border-mocha-500 text-mocha-100"
                        : "border-mocha-300 text-mocha-400 group-hover:border-mocha-400"
                    }`}>
                      {isOpen ? <Minus size={12} /> : <Plus size={12} />}
                    </span>
                  </button>

                  {/* Answer — smooth height transition via max-height */}
                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ maxHeight: isOpen ? "200px" : "0px", opacity: isOpen ? 1 : 0 }}
                  >
                    <p className="pb-6 text-sm text-mocha-400 font-light leading-relaxed max-w-lg">
                      {item.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
