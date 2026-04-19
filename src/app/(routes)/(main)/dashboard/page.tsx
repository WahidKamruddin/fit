'use client';

import Link from "next/link";
import { useUser } from "@/src/app/auth/auth";
import { useCloset } from "@/src/app/providers/closetContext";
import { BiCloset } from "react-icons/bi";
import { PiTShirt } from "react-icons/pi";
import { BsCalendar3 } from "react-icons/bs";
import { AiOutlineShopping } from "react-icons/ai";
import { capitalize } from "@/src/app/lib/utils";

const quickNav = [
    { label: "Closet",   sub: "Your wardrobe",  href: "/closet",   Icon: BiCloset,         num: "01" },
    { label: "Outfits",  sub: "Saved looks",    href: "/outfits",  Icon: PiTShirt,         num: "02" },
    { label: "Calendar", sub: "Plan ahead",     href: "/calendar", Icon: BsCalendar3,      num: "03" },
    { label: "Shop",     sub: "Browse & buy",   href: "/shop",     Icon: AiOutlineShopping, num: "04" },
];

export default function Page() {
    const user    = useUser();
    const { cards, outfits } = useCloset();

    const firstName = capitalize(user?.user_metadata?.full_name?.split(' ')[0] ?? '')  || null;

    const dateStr = new Date().toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric',
    });

    return (
        <div className="min-h-screen bg-off-white-100 pt-16 px-6 sm:px-10 pb-16">

            {/* ── Greeting ─────────────────────────────────────── */}
            <div
                className="pt-10 pb-10 border-b border-mocha-200 animate-fade-in-up"
                style={{ animationDelay: '0.05s' }}
            >
                <p className="text-[10px] tracking-[0.5em] uppercase text-mocha-400 mb-3">
                    {dateStr}
                </p>
                <h1 className="font-cormorant text-4xl sm:text-5xl font-light text-mocha-500 leading-[1.05]">
                    Good to see you,<br />
                    <span className="italic text-mocha-400">{firstName}.</span>
                </h1>
            </div>

            {/* ── Main grid ────────────────────────────────────── */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Today's Look — spans 2 cols */}
                <div
                    className="lg:col-span-2 bg-mocha-500 rounded-3xl p-8 sm:p-10 relative overflow-hidden animate-fade-in-up"
                    style={{ animationDelay: '0.15s', minHeight: '300px' }}
                >
                    {/* Ambient glow */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: 'radial-gradient(ellipse 65% 55% at 85% 100%, rgba(162,135,105,0.22) 0%, transparent 70%)' }}
                    />

                    {/* Decorative number */}
                    <div className="absolute right-8 top-4 pointer-events-none select-none">
                        <span className="font-cormorant text-[7rem] font-light text-mocha-400/10 leading-none">
                            01
                        </span>
                    </div>

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <p className="text-[10px] tracking-[0.5em] uppercase text-mocha-300 mb-6">
                                {"Today's Look"}
                            </p>
                            <h2 className="font-cormorant font-light text-mocha-100 leading-[0.95]"
                                style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
                            >
                                Dressed for<br />
                                <span className="italic text-mocha-300">the moment.</span>
                            </h2>
                            <p className="text-mocha-200/65 text-sm font-light leading-relaxed max-w-sm mt-5">
                                AI outfit suggestions based on your wardrobe are coming soon.
                                Add items to your closet to get started.
                            </p>
                        </div>

                        <div className="mt-10 flex flex-wrap gap-3">
                            {['Minimal', 'Refined', 'Warm'].map((tag) => (
                                <span
                                    key={tag}
                                    className="text-[10px] tracking-[0.3em] uppercase text-mocha-300 border border-mocha-400 px-4 py-1.5 rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats column */}
                <div className="flex flex-col gap-5">

                    {/* Clothes count */}
                    <div
                        className="bg-mocha-100 rounded-3xl p-7 flex flex-col justify-between animate-fade-in-up"
                        style={{ animationDelay: '0.25s', minHeight: '138px' }}
                    >
                        <p className="text-[10px] tracking-[0.45em] uppercase text-mocha-400">
                            Wardrobe
                        </p>
                        <div>
                            <p className="font-cormorant text-6xl font-light text-mocha-500 leading-none">
                                {cards.length}
                            </p>
                            <p className="text-mocha-400 text-[11px] tracking-wide mt-1">
                                {cards.length === 1 ? 'item catalogued' : 'items catalogued'}
                            </p>
                        </div>
                    </div>

                    {/* Outfits count */}
                    <div
                        className="bg-white rounded-3xl p-7 flex flex-col justify-between shadow-sm shadow-mocha-200/60 animate-fade-in-up"
                        style={{ animationDelay: '0.35s', minHeight: '138px' }}
                    >
                        <p className="text-[10px] tracking-[0.45em] uppercase text-mocha-400">
                            Outfits
                        </p>
                        <div>
                            <p className="font-cormorant text-6xl font-light text-mocha-500 leading-none">
                                {outfits.length}
                            </p>
                            <p className="text-mocha-400 text-[11px] tracking-wide mt-1">
                                {outfits.length === 1 ? 'look saved' : 'looks saved'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Quick nav tiles ───────────────────────────────── */}
            <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
                {quickNav.map(({ label, sub, href, Icon, num }, i) => (
                    <Link
                        key={label}
                        href={href}
                        className="group bg-white rounded-2xl p-6 flex flex-col justify-between hover:bg-mocha-500 transition-all duration-500 shadow-sm shadow-mocha-200/40 animate-fade-in-up"
                        style={{ animationDelay: `${0.42 + i * 0.08}s`, minHeight: '148px' }}
                    >
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] tracking-[0.4em] uppercase text-mocha-300 group-hover:text-mocha-400 transition-colors duration-300">
                                {num}
                            </span>
                            <Icon
                                size={17}
                                className="text-mocha-300 group-hover:text-mocha-200 transition-colors duration-300"
                            />
                        </div>
                        <div>
                            <p className="font-cormorant text-2xl text-mocha-500 group-hover:text-mocha-100 transition-colors duration-300 leading-tight">
                                {label}
                            </p>
                            <p className="text-[10px] tracking-[0.25em] uppercase text-mocha-400 group-hover:text-mocha-300 transition-colors duration-300 mt-1">
                                {sub}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
