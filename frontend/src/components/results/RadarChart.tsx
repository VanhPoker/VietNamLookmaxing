'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
import { RadarData } from '@/types';

interface FaceRadarChartProps {
    data: RadarData;
    size?: 'sm' | 'md' | 'lg';
    animated?: boolean;
}

const RADAR_LABELS: Record<keyof RadarData, string> = {
    eyes: 'Eyes',
    jaw: 'Jaw',
    midface: 'Midface',
    symmetry: 'Symmetry',
    harmony: 'Harmony',
};

export function FaceRadarChart({ data, size = 'md', animated = true }: FaceRadarChartProps) {
    const chartData = useMemo(() => {
        return Object.entries(data).map(([key, value]) => ({
            subject: RADAR_LABELS[key as keyof RadarData],
            value: value,
            fullMark: 10,
        }));
    }, [data]);

    const sizeClasses = {
        sm: 'h-48',
        md: 'h-72',
        lg: 'h-96',
    };

    const Wrapper = animated ? motion.div : 'div';
    const wrapperProps = animated
        ? {
            initial: { opacity: 0, scale: 0.8 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.6, delay: 0.3 },
        }
        : {};

    return (
        <Wrapper {...wrapperProps} className={`w-full ${sizeClasses[size]}`}>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                    <PolarGrid
                        stroke="currentColor"
                        strokeOpacity={0.15}
                        gridType="polygon"
                    />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.7 }}
                        tickLine={false}
                    />
                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 10]}
                        tick={{ fill: 'currentColor', fontSize: 10, opacity: 0.5 }}
                        tickCount={6}
                        axisLine={false}
                    />
                    <Radar
                        name="Score"
                        dataKey="value"
                        stroke="oklch(0.7 0.2 195)"
                        fill="oklch(0.7 0.2 195)"
                        fillOpacity={0.25}
                        strokeWidth={2}
                        dot={{
                            r: 4,
                            fill: 'oklch(0.7 0.2 195)',
                            strokeWidth: 2,
                            stroke: 'oklch(0.08 0.02 260)',
                        }}
                        animationDuration={animated ? 1500 : 0}
                        animationEasing="ease-out"
                    />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const item = payload[0];
                                return (
                                    <div className="bg-card/95 backdrop-blur-sm border border-border px-3 py-2 rounded-lg shadow-lg">
                                        <p className="text-sm font-medium text-foreground">
                                            {item.payload.subject}
                                        </p>
                                        <p className="text-lg font-bold text-primary">
                                            {Number(item.value).toFixed(1)}/10
                                        </p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </Wrapper>
    );
}

// Alternative: Simple visual radar (no recharts dependency)
export function SimpleRadarChart({ data }: { data: RadarData }) {
    const categories = Object.entries(data);
    const angleStep = (2 * Math.PI) / categories.length;
    const maxRadius = 100;

    return (
        <div className="relative w-64 h-64 mx-auto">
            <svg viewBox="-120 -120 240 240" className="w-full h-full">
                {/* Grid circles */}
                {[2, 4, 6, 8, 10].map((level) => (
                    <circle
                        key={level}
                        cx="0"
                        cy="0"
                        r={(level / 10) * maxRadius}
                        fill="none"
                        stroke="currentColor"
                        strokeOpacity={0.1}
                        strokeWidth="1"
                    />
                ))}

                {/* Grid lines */}
                {categories.map((_, i) => {
                    const angle = i * angleStep - Math.PI / 2;
                    const x = Math.cos(angle) * maxRadius;
                    const y = Math.sin(angle) * maxRadius;
                    return (
                        <line
                            key={i}
                            x1="0"
                            y1="0"
                            x2={x}
                            y2={y}
                            stroke="currentColor"
                            strokeOpacity={0.1}
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Data polygon */}
                <motion.polygon
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    points={categories
                        .map(([, value], i) => {
                            const angle = i * angleStep - Math.PI / 2;
                            const radius = (value / 10) * maxRadius;
                            return `${Math.cos(angle) * radius},${Math.sin(angle) * radius}`;
                        })
                        .join(' ')}
                    fill="oklch(0.7 0.2 195 / 0.25)"
                    stroke="oklch(0.7 0.2 195)"
                    strokeWidth="2"
                />

                {/* Data points */}
                {categories.map(([, value], i) => {
                    const angle = i * angleStep - Math.PI / 2;
                    const radius = (value / 10) * maxRadius;
                    return (
                        <motion.circle
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                            cx={Math.cos(angle) * radius}
                            cy={Math.sin(angle) * radius}
                            r="5"
                            fill="oklch(0.7 0.2 195)"
                            stroke="oklch(0.08 0.02 260)"
                            strokeWidth="2"
                        />
                    );
                })}

                {/* Labels */}
                {categories.map(([key], i) => {
                    const angle = i * angleStep - Math.PI / 2;
                    const labelRadius = maxRadius + 20;
                    const x = Math.cos(angle) * labelRadius;
                    const y = Math.sin(angle) * labelRadius;
                    return (
                        <text
                            key={key}
                            x={x}
                            y={y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="text-xs fill-muted-foreground"
                        >
                            {RADAR_LABELS[key as keyof RadarData]}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
}
