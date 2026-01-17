'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Dna, Github, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
    const [isDark, setIsDark] = React.useState(true);

    React.useEffect(() => {
        // Check initial theme
        const isDarkMode = document.documentElement.classList.contains('dark');
        setIsDark(isDarkMode);
    }, []);

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        document.documentElement.classList.toggle('dark', newIsDark);
    };

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-4 left-4 right-4 z-50"
        >
            <nav className="max-w-6xl mx-auto px-6 py-3 rounded-2xl glass-card">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Dna className="w-6 h-6 text-primary" />
                            <div className="absolute inset-0 rounded-xl bg-primary/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div>
                            <span className="text-lg font-bold text-foreground tracking-tight">
                                Project <span className="text-gradient">Adam</span>
                            </span>
                            <p className="text-xs text-muted-foreground -mt-0.5">AI Face Aesthetics</p>
                        </div>
                    </Link>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="rounded-xl"
                        >
                            {isDark ? (
                                <Sun className="w-5 h-5" />
                            ) : (
                                <Moon className="w-5 h-5" />
                            )}
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-xl" asChild>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                        </Button>
                    </div>
                </div>
            </nav>
        </motion.header>
    );
}

export function Footer() {
    return (
        <footer className="py-8 mt-auto border-t border-border/50">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Dna className="w-4 h-4" />
                        <span>Project Adam © 2026</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-center md:text-right max-w-md">
                        For educational purposes only. AI analysis is not medical advice.
                        Facial aesthetics are subjective and culturally variable.
                    </p>
                </div>
            </div>
        </footer>
    );
}
