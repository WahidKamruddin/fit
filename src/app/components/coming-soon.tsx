import Link from "next/link";

const ComingSoon = () => {
  return (
    <div className="relative min-h-screen bg-off-white-100 flex flex-col items-center justify-center overflow-hidden">

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">

        {/* Overline */}
        <div
          className="flex items-center gap-4 mb-8 animate-fade-in"
          style={{ animationDelay: '0.05s' }}
        >
          <div className="w-12 h-px bg-mocha-300" />
          <span className="text-[10px] tracking-[0.55em] uppercase text-mocha-400">
            Coming Soon
          </span>
          <div className="w-12 h-px bg-mocha-300" />
        </div>

        {/* Headline */}
        <h1
          className="font-cormorant font-light text-mocha-500 leading-[1.0] animate-fade-in-up"
          style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', animationDelay: '0.15s' }}
        >
          Something beautiful<br />
          <span className="italic text-mocha-400">is in the works.</span>
        </h1>

        {/* Divider */}
        <div
          className="mt-8 w-16 h-px bg-mocha-200 animate-fade-in"
          style={{ animationDelay: '0.3s' }}
        />

        {/* Body */}
        <p
          className="mt-6 text-sm text-mocha-400 leading-relaxed max-w-xs animate-fade-in"
          style={{ animationDelay: '0.38s' }}
        >
          This section is being carefully crafted.<br />
          Check back soon.
        </p>

        {/* CTA */}
        <div
          className="mt-10 animate-fade-in"
          style={{ animationDelay: '0.48s' }}
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-3 px-8 py-3 rounded-full border border-mocha-300 text-[10px] tracking-[0.4em] uppercase text-mocha-400 hover:bg-mocha-500 hover:border-mocha-500 hover:text-mocha-100 transition-all duration-300"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
