'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Scan } from 'lucide-react';

interface LoadingSpinnerProps {
    text?: string;
    subtext?: string;
}

export function LoadingSpinner({
    text = 'Analyzing...',
    subtext = 'AI is processing your facial features'
}: LoadingSpinnerProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-6 py-12">
            {/* Animated Scanner */}
            <div className="relative">
                {/* Outer ring */}
                <motion.div
                    className="w-24 h-24 rounded-full border-2 border-primary/30"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />

                {/* Inner ring */}
                <motion.div
                    className="absolute inset-2 rounded-full border-2 border-cyan/50"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />

                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <Scan className="w-8 h-8 text-primary" />
                    </motion.div>
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl animate-pulse" />
            </div>

            {/* Text */}
            <div className="text-center space-y-2">
                <motion.p
                    className="text-lg font-medium text-foreground"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    {text}
                </motion.p>
                <p className="text-sm text-muted-foreground">{subtext}</p>
            </div>

            {/* Progress dots */}
            <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-primary"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                ))}
            </div>
        </div>
    );
}

export function SkeletonCard() {
    return (
        <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-4 animate-pulse">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-muted" />
                <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-3 bg-muted rounded w-1/4" />
                </div>
            </div>
            <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-5/6" />
                <div className="h-3 bg-muted rounded w-4/6" />
            </div>
        </div>
    );
}
