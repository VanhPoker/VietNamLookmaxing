'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Check,
    AlertTriangle,
    Lightbulb,
    ChevronDown,
    TrendingUp,
    Target,
    Ruler,
    RotateCcw,
    Share2,
    Download,
    User,
    UserCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { FaceRadarChart } from './RadarChart';
import { TooltipTerm, highlightTerms } from '@/components/shared/Tooltip';
import { AnalysisResult, TIER_COLORS, MEASUREMENT_LABELS } from '@/types';
import { cn } from '@/lib/utils';

interface ResultCardProps {
    result: AnalysisResult;
    images?: { front: string; side: string } | null;
    onAnalyzeAgain?: () => void;
}

export function ResultCard({ result, images, onAnalyzeAgain }: ResultCardProps) {
    const tierStyle = TIER_COLORS[result.tier] || TIER_COLORS['Normie'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl mx-auto space-y-6"
        >
            {/* Main Score Card */}
            <Card className="overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-0">
                    <div className="grid md:grid-cols-2 gap-0">
                        {/* Left: Score Display */}
                        <div className="relative p-8 flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-transparent to-cyan/5">
                            {/* Background decoration */}
                            <div className="absolute inset-0 bg-grid opacity-30" />

                            {/* Score circle */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                                className="relative"
                            >
                                <svg className="w-40 h-40" viewBox="0 0 100 100">
                                    {/* Background circle */}
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="45"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        className="text-muted/30"
                                    />
                                    {/* Score arc */}
                                    <motion.circle
                                        cx="50"
                                        cy="50"
                                        r="45"
                                        fill="none"
                                        stroke="url(#scoreGradient)"
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        strokeDasharray={`${(result.score / 10) * 283} 283`}
                                        transform="rotate(-90 50 50)"
                                        initial={{ strokeDasharray: '0 283' }}
                                        animate={{ strokeDasharray: `${(result.score / 10) * 283} 283` }}
                                        transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                                    />
                                    <defs>
                                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="oklch(0.7 0.2 195)" />
                                            <stop offset="100%" stopColor="oklch(0.55 0.2 230)" />
                                        </linearGradient>
                                    </defs>
                                </svg>

                                {/* Score number */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1 }}
                                        className="text-5xl font-bold text-foreground"
                                    >
                                        {result.score.toFixed(1)}
                                    </motion.span>
                                    <span className="text-sm text-muted-foreground">/10</span>
                                </div>
                            </motion.div>

                            {/* Tier badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 }}
                                className="mt-4"
                            >
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        'text-lg px-4 py-1.5 font-semibold',
                                        tierStyle.bg,
                                        tierStyle.text,
                                        tierStyle.border
                                    )}
                                >
                                    {result.tier}
                                </Badge>
                            </motion.div>

                            {/* Quick stats */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.4 }}
                                className="flex gap-6 mt-6 text-center"
                            >
                                <div>
                                    <p className="text-2xl font-bold text-primary">{result.strengths.length}</p>
                                    <p className="text-xs text-muted-foreground">Điểm mạnh</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-warning">{result.weaknesses.length}</p>
                                    <p className="text-xs text-muted-foreground">Cần cải thiện</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right: Radar Chart + Images */}
                        <div className="p-8 flex flex-col items-center justify-center border-l border-border/50">
                            {/* User Images */}
                            {images && (
                                <div className="flex gap-2 mb-4">
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border/50">
                                        <img src={images.front} alt="Mặt trước" className="w-full h-full object-cover" />
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] text-center py-0.5">
                                            <User className="w-2 h-2 inline mr-0.5" />Trước
                                        </div>
                                    </div>
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border/50">
                                        <img src={images.side} alt="Mặt nghiêng" className="w-full h-full object-cover" />
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] text-center py-0.5">
                                            <UserCircle className="w-2 h-2 inline mr-0.5" />Nghiêng
                                        </div>
                                    </div>
                                </div>
                            )}
                            <h3 className="text-sm font-medium text-muted-foreground mb-4">Phân Tích Chi Tiết</h3>
                            <FaceRadarChart data={result.radar_data} size="md" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Analysis Tabs */}
            <Tabs defaultValue="analysis" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-muted/50">
                    <TabsTrigger value="analysis" className="gap-2 text-xs md:text-sm">
                        <Target className="w-4 h-4" />
                        <span className="hidden md:inline">Phân Tích</span>
                    </TabsTrigger>
                    <TabsTrigger value="strengths" className="gap-2 text-xs md:text-sm">
                        <Check className="w-4 h-4" />
                        <span className="hidden md:inline">Điểm Mạnh</span>
                    </TabsTrigger>
                    <TabsTrigger value="improvements" className="gap-2 text-xs md:text-sm">
                        <TrendingUp className="w-4 h-4" />
                        <span className="hidden md:inline">Cải Thiện</span>
                    </TabsTrigger>
                    <TabsTrigger value="measurements" className="gap-2 text-xs md:text-sm">
                        <Ruler className="w-4 h-4" />
                        <span className="hidden md:inline">Số Đo</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="analysis" className="mt-4">
                    <Card className="border-border/50 bg-card/80">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-primary" />
                                Phân Tích Chuyên Gia
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">{result.analysis}</p>

                            <Separator className="my-6" />

                            <div className="space-y-3">
                                <h4 className="font-medium flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4 text-warning" />
                                    Lời Khuyên
                                </h4>
                                <p className="text-muted-foreground text-sm leading-relaxed">{result.advice}</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="strengths" className="mt-4">
                    <Card className="border-border/50 bg-card/80">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-success" />
                                Điểm Mạnh Của Bạn
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {result.strengths.map((strength, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-start gap-3 p-3 rounded-lg bg-success/10 border border-success/20"
                                    >
                                        <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                                        <span className="text-foreground">{strength}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="improvements" className="mt-4">
                    <Card className="border-border/50 bg-card/80">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-warning" />
                                Cần Cải Thiện
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {result.weaknesses.map((weakness, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20"
                                    >
                                        <AlertTriangle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                                        <span className="text-foreground">{weakness}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="measurements" className="mt-4">
                    <Card className="border-border/50 bg-card/80">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Ruler className="w-5 h-5 text-primary" />
                                Số Đo Chi Tiết
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                {Object.entries(MEASUREMENT_LABELS).map(([key, info]) => {
                                    const value = result.measurements[key as keyof typeof result.measurements];
                                    if (value === undefined || key === 'facial_thirds') return null;

                                    const displayValue = key.includes('ratio') || key === 'symmetry_score'
                                        ? `${(Number(value) * 100).toFixed(1)}%`
                                        : `${Number(value).toFixed(1)}${info.unit}`;

                                    const percentage = key.includes('ratio') || key === 'symmetry_score'
                                        ? Number(value) * 100
                                        : Math.min(100, (Math.abs(Number(value)) / 150) * 100);

                                    return (
                                        <motion.div
                                            key={key}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-4 rounded-lg bg-muted/30 border border-border/50"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="font-medium text-foreground">{info.label}</p>
                                                    <p className="text-xs text-muted-foreground">Ideal: {info.ideal}</p>
                                                </div>
                                                <span className="text-lg font-bold text-primary">{displayValue}</span>
                                            </div>
                                            <Progress value={percentage} className="h-2" />
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Facial thirds */}
                            <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/50">
                                <p className="font-medium text-foreground mb-3">Facial Thirds Distribution</p>
                                <div className="flex gap-2">
                                    {result.measurements.facial_thirds.map((value, i) => (
                                        <div key={i} className="flex-1 text-center">
                                            <div className="h-20 rounded-lg bg-primary/20 relative overflow-hidden">
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${value * 100}%` }}
                                                    transition={{ delay: 0.5 + i * 0.2 }}
                                                    className="absolute bottom-0 left-0 right-0 bg-primary/60"
                                                />
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-2">
                                                {['Upper', 'Middle', 'Lower'][i]}
                                            </p>
                                            <p className="text-sm font-medium">{(value * 100).toFixed(1)}%</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
                <Button variant="outline" size="lg" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Chia Sẻ
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                    <Download className="w-4 h-4" />
                    Tải Xuống
                </Button>
                {onAnalyzeAgain && (
                    <Button size="lg" onClick={onAnalyzeAgain} className="gap-2">
                        <RotateCcw className="w-4 h-4" />
                        Chấm Điểm Lại
                    </Button>
                )}
            </div>
        </motion.div>
    );
}
