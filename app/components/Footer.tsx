export default function Footer() {
    return (
        <footer className="py-12 px-6 md:px-12 border-t border-border">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Logo */}
                    <div>
                        <h2 className="text-lg font-medium tracking-tight">showcase</h2>
                    </div>

                    {/* Links */}
                    <nav className="flex items-center gap-8">
                        <a
                            href="#"
                            className="text-sm text-muted hover:text-foreground transition-colors"
                        >
                            Instagram
                        </a>
                        <a
                            href="#"
                            className="text-sm text-muted hover:text-foreground transition-colors"
                        >
                            Twitter
                        </a>
                        <a
                            href="#"
                            className="text-sm text-muted hover:text-foreground transition-colors"
                        >
                            Pinterest
                        </a>
                    </nav>

                    {/* Copyright */}
                    <p className="text-sm text-muted">
                        © 2026 showcase. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
