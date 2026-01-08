"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Header() {
    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 px-6 py-5 md:px-12"
        >
            <div className="flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="group">
                    <h1 className="text-xl font-medium tracking-tight text-foreground transition-opacity group-hover:opacity-70">
                        showcase
                    </h1>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link
                        href="/"
                        className="text-sm font-medium text-muted hover:text-foreground transition-colors"
                    >
                        collections
                    </Link>
                    <Link
                        href="/about"
                        className="text-sm font-medium text-muted hover:text-foreground transition-colors"
                    >
                        about
                    </Link>
                    <Link
                        href="/contact"
                        className="text-sm font-medium text-muted hover:text-foreground transition-colors"
                    >
                        contact
                    </Link>
                </nav>

                {/* Mobile menu button */}
                <button className="md:hidden p-2 -mr-2" aria-label="Menu">
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
            </div>
        </motion.header>
    );
}
