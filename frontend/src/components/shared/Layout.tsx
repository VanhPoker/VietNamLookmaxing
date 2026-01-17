'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Dna, Moon, Sun, Menu, X, ShoppingBag, GraduationCap, Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NAV_ITEMS = [
    { name: 'Chấm Điểm', href: '/', icon: Scan, active: true },
    { name: 'Sản Phẩm', href: '/san-pham', icon: ShoppingBag, comingSoon: true },
    { name: 'Khóa Học', href: '/khoa-hoc', icon: GraduationCap, comingSoon: true },
];

export function Header() {
    const [isDark, setIsDark] = React.useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    React.useEffect(() => {
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
            <nav className="max-w-6xl mx-auto px-4 md:px-6 py-3 rounded-2xl glass-card">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 md:gap-3 group">
                        <div className="relative p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Dna className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                        </div>
                        <div>
                            <span className="text-base md:text-lg font-bold text-foreground tracking-tight">
                                Máy Đo <span className="text-gradient">Lookmaxing</span>
                            </span>
                            <p className="text-[10px] md:text-xs text-muted-foreground -mt-0.5">
                                AI Chấm Điểm Nhan Sắc
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.name}
                                href={item.comingSoon ? '#' : item.href}
                                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${item.active
                                    ? 'text-primary bg-primary/10'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    } ${item.comingSoon ? 'cursor-not-allowed opacity-60' : ''}`}
                                onClick={(e) => item.comingSoon && e.preventDefault()}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.name}
                                {item.comingSoon && (
                                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[8px] font-bold bg-primary/20 text-primary rounded-full">
                                        Soon
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 md:gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="rounded-xl w-9 h-9"
                        >
                            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </Button>

                        {/* Mobile Menu Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden rounded-xl w-9 h-9"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden mt-4 pt-4 border-t border-border/50"
                    >
                        <div className="flex flex-col gap-2">
                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.comingSoon ? '#' : item.href}
                                    className={`relative px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-3 ${item.active
                                        ? 'text-primary bg-primary/10'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                        } ${item.comingSoon ? 'opacity-60' : ''}`}
                                    onClick={(e) => {
                                        if (item.comingSoon) e.preventDefault();
                                        else setMobileMenuOpen(false);
                                    }}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                    {item.comingSoon && (
                                        <span className="ml-auto px-2 py-0.5 text-[10px] font-bold bg-primary/20 text-primary rounded-full">
                                            Sắp ra mắt
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
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
                        <span>Máy Đo Lookmaxing © 2026</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-center md:text-right max-w-md">
                        Chỉ dành cho mục đích tham khảo. Phân tích AI không phải lời khuyên y tế.
                        Thẩm mỹ khuôn mặt mang tính chủ quan và khác biệt theo văn hóa.
                    </p>
                </div>
            </div>
        </footer>
    );
}
