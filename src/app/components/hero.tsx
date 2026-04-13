export default function Hero() {
    return (
        <section
            id="hero"
            className="relative h-screen bg-mocha-500 flex flex-col justify-center overflow-hidden snap-start"
        >
            {/* Directional gradient for depth — darker top-left, slightly warmer bottom-right */}
            <div className="absolute inset-0 bg-gradient-to-br from-mocha-500 via-mocha-500 to-mocha-400" />

            {/* Radial warm glow from bottom-right */}
            <div className="absolute inset-0" style={{background: 'radial-gradient(ellipse 70% 60% at 80% 90%, rgba(162,135,105,0.25) 0%, transparent 70%)'}} />

            {/* Top rule */}
            <div className="absolute top-0 left-0 right-0 h-px bg-mocha-300/20" />

            {/* Vertical side accent — desktop */}
            <div className="absolute left-10 top-0 bottom-0 hidden lg:flex flex-col items-center justify-center gap-6 pointer-events-none">
                <div className="h-28 w-px bg-mocha-300/30" />
                <span
                    className="text-[10px] tracking-[0.45em] uppercase text-mocha-300/50"
                    style={{ writingMode: 'vertical-rl' }}
                >
                    Est. 2026
                </span>
                <div className="h-28 w-px bg-mocha-300/30" />
            </div>

            {/* Right decorative number */}
            <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none">
                <span
                    className="font-cormorant text-[10rem] font-light text-mocha-400/10 leading-none select-none"
                >
                    01
                </span>
            </div>

            {/* Main content */}
            <div className="relative z-10 max-w-7xl mx-auto px-8 sm:px-20 lg:px-32 w-full">
                {/* Overline */}
                <p
                    className="text-mocha-200 text-[11px] sm:text-xs tracking-[0.5em] uppercase mb-10 animate-fade-in-up"
                    style={{ animationDelay: '0.15s' }}
                >
                    Your Personal AI Wardrobe
                </p>

                {/* Headline */}
                <h1
                    className="font-cormorant font-light text-mocha-100 leading-[0.88] tracking-tight animate-fade-in-up"
                    style={{
                        fontSize: 'clamp(4.5rem, 11vw, 10rem)',
                        animationDelay: '0.35s',
                    }}
                >
                    Fashion,
                    <br />
                    <span className="italic text-mocha-300">your</span>
                    <br />
                    way.
                </h1>

                {/* Sub-copy */}
                <p
                    className="mt-12 text-mocha-100/80 text-lg font-light max-w-sm leading-relaxed animate-fade-in-up"
                    style={{ animationDelay: '0.6s' }}
                >
                    Organize your clothes, plan your outfits, sell your old clothes, and generate new looks with AI.
                </p>

                {/* CTA row */}
                <div
                    className="mt-12 flex flex-wrap gap-4 items-center animate-fade-in-up"
                    style={{ animationDelay: '0.8s' }}
                >
                    <a
                        href="https://forms.gle/fedR43dq635K6jdH7"
                        target="_blank"
                        rel="noreferrer"
                        className="px-8 py-3.5 bg-mocha-100 text-mocha-500 text-[11px] tracking-[0.3em] uppercase font-bold rounded-full hover:bg-white hover:scale-105 transition-all duration-300"
                    >
                        Join Beta
                    </a>
                    <a
                        href="#wardrobe"
                        className="px-8 py-3.5 border border-mocha-300 text-mocha-100 text-[11px] tracking-[0.3em] uppercase rounded-full hover:border-mocha-100 hover:bg-mocha-400/30 transition-all duration-300"
                    >
                        Explore
                    </a>
                </div>
            </div>

            {/* Scroll indicator */}
            <div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none animate-fade-in"
                style={{ animationDelay: '1.4s' }}
            >
                <span className="text-[9px] tracking-[0.4em] uppercase text-mocha-200/60">
                    Scroll
                </span>
                <div className="w-px h-12 bg-gradient-to-b from-mocha-300/50 to-transparent" />
            </div>
        </section>
    )
}
