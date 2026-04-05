import { BiCloset } from "react-icons/bi";
import { PiTShirt } from "react-icons/pi";
import { AiOutlineShopping } from "react-icons/ai";
import { BsBell } from "react-icons/bs";

const milestones = [
    {
        Icon: BiCloset,
        label: "Digital Closet",
        date: "Apr 2025 — Beta Launch",
        done: true,
    },
    {
        Icon: PiTShirt,
        label: "AI Outfit Generator",
        date: "Jun 2025 — Launch",
        done: false,
    },
    {
        Icon: AiOutlineShopping,
        label: "Shop",
        date: "Sept 2025",
        done: false,
    },
    {
        Icon: BsBell,
        label: "More to come...",
        date: "TBD",
        done: false,
    },
];

export default function Timeline() {
    return (
        <section id="timeline" className="min-h-screen bg-mocha-100 flex items-center py-28">
            <div className="max-w-7xl mx-auto px-8 sm:px-16 w-full">

                {/* Section label */}
                <div className="flex items-center gap-4 mb-20">
                    <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">04</span>
                    <div className="w-10 h-px bg-mocha-300" />
                    <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">Roadmap</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

                    {/* Heading */}
                    <div>
                        <h2 className="font-cormorant text-5xl sm:text-6xl font-light text-mocha-500 leading-[1.05]">
                            {"What's"}<br />
                            <span className="italic text-mocha-400">coming next.</span>
                        </h2>
                        <p className="mt-8 text-mocha-400 text-sm font-light leading-relaxed max-w-xs">
                            {"We're building in public. Here's the roadmap for FIT as we grow from a beta closet to a full AI-powered wardrobe platform."}
                        </p>
                    </div>

                    {/* Timeline list */}
                    <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-6 top-6 bottom-6 w-px bg-mocha-300" />

                        <div className="space-y-10">
                            {milestones.map((m, i) => (
                                <div key={i} className="flex gap-8 items-start">
                                    {/* Icon dot — 48 px wide, centered on the line at left:6 (24px) */}
                                    <div
                                        className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all duration-300 ${
                                            m.done
                                                ? 'bg-mocha-500 border-mocha-500 text-mocha-100'
                                                : 'bg-off-white-100 border-mocha-400 text-mocha-400'
                                        }`}
                                    >
                                        <m.Icon size={18} />
                                    </div>

                                    {/* Label */}
                                    <div className="pt-2.5">
                                        <p className="text-[10px] tracking-[0.4em] uppercase text-mocha-400 mb-2">
                                            {m.date}
                                        </p>
                                        <h3 className="font-cormorant text-2xl sm:text-3xl text-mocha-500 font-medium leading-tight">
                                            {m.label}
                                        </h3>
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
