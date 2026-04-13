const links = [
    { label: "Wahid Kamruddin", href: "https://www.linkedin.com/in/wahid-kamruddin/" },
    { label: "Contact",         href: "mailto:wahidkamruddin101@gmail.com" },
    { label: "F.I.T Beta",      href: "https://forms.gle/fedR43dq635K6jdH7" },
];

export default function Footer() {
    return (
        <footer className="bg-mocha-500 border-t border-mocha-400/30 py-8">
            <div className="max-w-7xl mx-auto px-8 sm:px-16 flex flex-col sm:flex-row justify-between items-center gap-6">
                <span className="font-cormorant text-xl text-mocha-300 tracking-[0.2em]">
                    FIT.
                </span>

                <ul className="flex flex-wrap justify-center gap-6 sm:gap-8">
                    {links.map((link) => (
                        <li key={link.label}>
                            <a
                                href={link.href}
                                target="_blank"
                                rel="noreferrer"
                                className="text-mocha-300 text-[10px] tracking-[0.35em] uppercase hover:text-mocha-100 transition-colors duration-300"
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                <span className="text-mocha-400 text-[10px] tracking-wider">
                    © 2025 FIT.
                </span>
            </div>
        </footer>
    )
}
