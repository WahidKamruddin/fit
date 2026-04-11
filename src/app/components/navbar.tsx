"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useUser } from '../auth/auth'

export default function Navbar() {
    const user = useUser();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            scrolled
                ? 'bg-off-white-100/95 backdrop-blur-md shadow-sm'
                : 'bg-transparent'
        }`}>
            <div className="max-w-7xl mx-auto px-8 sm:px-16 py-5 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className={`font-cormorant text-2xl font-semibold tracking-[0.2em] transition-colors duration-300 ${
                    scrolled ? 'text-mocha-500 hover:text-mocha-400' : 'text-mocha-100 hover:text-white'
                }`}>
                    FIT.
                </Link>

                {/* Nav links */}
                <ul className="flex items-center gap-8">
                    <li>
                        <Link
                            href="/"
                            className={`text-xs tracking-[0.3em] uppercase transition-colors duration-300 ${
                                scrolled ? 'text-mocha-400 hover:text-mocha-500' : 'text-mocha-200 hover:text-mocha-100'
                            }`}
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/pricing"
                            className={`text-xs tracking-[0.3em] uppercase transition-colors duration-300 ${
                                scrolled ? 'text-mocha-400 hover:text-mocha-500' : 'text-mocha-200 hover:text-mocha-100'
                            }`}
                        >
                            Pricing
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={user ? '/dashboard' : '/login'}
                            className={`text-xs tracking-[0.3em] uppercase px-6 py-2.5 rounded-full border transition-all duration-300 ${
                                scrolled
                                    ? 'border-mocha-400 text-mocha-400 hover:bg-mocha-500 hover:text-mocha-100 hover:border-mocha-500'
                                    : 'border-mocha-200/60 text-mocha-200 hover:bg-white hover:border-white hover:text-mocha-500'
                            }`}
                        >
                            {user ? 'Dashboard' : 'Login'}
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}
