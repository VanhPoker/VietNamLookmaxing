'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    AlertCircle,
    Check,
    Zap,
    Trophy,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FaceRadarChart } from './RadarChart';
import { CompareResponse, GEMINI_MODELS, TIER_COLORS, ModelResult } from '@/types';
import { cn } from '@/lib/utils';

interface ModelCompareProps {
    data: CompareResponse;
    onSelectModel?: (modelId: string) => void;
}

export function ModelCompare({ data, onSelectModel }: ModelCompareProps) {
    const [expandedModel, setExpandedModel] = React.useState<string | null>(null);

    // Sort models by score
    const sortedModels = React.useMemo(() => {
        return Object.entries(data.model_results)
            .map(([id, result]) => ({ id, result }))
            .sort((a, b) => {
                if (!a.result.success) return 1;
                if (!b.result.success) return -1;
                return (b.result.data?.score || 0) - (a.result.data?.score || 0);
            });
    }, [data.model_results]);

    const bestModel = sortedModels.find(m => m.result.success);

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Model Comparison Results</h2>
                <p className="text-muted-foreground">
                    Compare analysis from 4 different Gemini models
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sortedModels.map(({ id, result }, index) => {
                    const modelInfo = GEMINI_MODELS.find(m => m.id === id);
                    const isExpanded = expandedModel === id;
                    const isBest = index === 0 && result.success;
                    const tierStyle = result.data ? TIER_COLORS[result.data.tier] || TIER_COLORS['Normie'] : null;

                    return (
                        <motion.div
                            key={id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card
                                className={cn(
                                    'cursor-pointer transition-all hover:border-primary/50 relative overflow-hidden',
                                    isBest && 'ring-2 ring-primary',
                                    !result.success && 'opacity-60'
                                )}
                                onClick={() => setExpandedModel(isExpanded ? null : id)}
                            >
                                {isBest && (
                                    <div className="absolute top-2 right-2">
                                        <Badge className="bg-primary text-primary-foreground">
                                            <Trophy className="w-3 h-3 mr-1" /> Best
                                        </Badge>
                                    </div>
                                )}

                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {modelInfo?.name || id}
                                    </CardTitle>
                                    <p className="text-xs text-muted-foreground">
                                        {modelInfo?.speed} {modelInfo?.quality}
                                    </p>
                                </CardHeader>

                                <CardContent className="pt-0">
                                    {result.success && result.data ? (
                                        <>
                                            <div className="text-center mb-3">
                                                <span className="text-4xl font-bold text-foreground">
                                                    {result.data.score.toFixed(1)}
                                                </span>
                                                <span className="text-sm text-muted-foreground">/10</span>
                                            </div>

                                            <div className="flex items-center justify-between text-xs">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        'text-xs',
                                                        tierStyle?.bg,
                                                        tierStyle?.text,
                                                        tierStyle?.border
                                                    )}
                                                >
                                                    {result.data.tier}
                                                </Badge>
                                                <span className="flex items-center text-muted-foreground">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {result.time_seconds}s
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-4">
                                            <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                                            <p className="text-xs text-destructive">Failed</p>
                                        </div>
                                    )}

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full mt-2 h-6 text-xs"
                                    >
                                        {isExpanded ? (
                                            <>
                                                <ChevronUp className="w-3 h-3 mr-1" /> Less
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDown className="w-3 h-3 mr-1" /> Details
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
                {expandedModel && data.model_results[expandedModel]?.success && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <Card className="border-primary/30">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-primary" />
                                        {GEMINI_MODELS.find(m => m.id === expandedModel)?.name} - Detailed Analysis
                                    </CardTitle>
                                    <Badge variant="outline">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {data.model_results[expandedModel].time_seconds}s
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Radar Chart */}
                                    <div>
                                        <h4 className="text-sm font-medium mb-4 text-center">Feature Breakdown</h4>
                                        <FaceRadarChart
                                            data={data.model_results[expandedModel].data!.radar_data}
                                            size="sm"
                                        />
                                    </div>

                                    {/* Analysis Text */}
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                                <Check className="w-4 h-4 text-success" />
                                                Strengths ({data.model_results[expandedModel].data!.strengths.length})
                                            </h4>
                                            <ul className="space-y-1">
                                                {data.model_results[expandedModel].data!.strengths.slice(0, 3).map((s, i) => (
                                                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                                                        <span className="text-success">•</span> {s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4 text-warning" />
                                                Areas to Improve ({data.model_results[expandedModel].data!.weaknesses.length})
                                            </h4>
                                            <ul className="space-y-1">
                                                {data.model_results[expandedModel].data!.weaknesses.slice(0, 3).map((w, i) => (
                                                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                                                        <span className="text-warning">•</span> {w}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border/50">
                                    <p className="text-sm text-muted-foreground">
                                        {data.model_results[expandedModel].data!.analysis.slice(0, 300)}...
                                    </p>
                                </div>

                                {onSelectModel && (
                                    <div className="mt-4 flex justify-end">
                                        <Button onClick={() => onSelectModel(expandedModel)}>
                                            Use This Model
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Score Comparison Chart */}
            <Card className="border-border/50 bg-card/80">
                <CardHeader>
                    <CardTitle className="text-lg">Score Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {sortedModels.map(({ id, result }) => {
                            const modelInfo = GEMINI_MODELS.find(m => m.id === id);
                            const score = result.data?.score || 0;

                            return (
                                <div key={id} className="space-y-1">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">{modelInfo?.name}</span>
                                        <span className="text-muted-foreground">
                                            {result.success ? `${score.toFixed(1)}/10` : 'Failed'}
                                        </span>
                                    </div>
                                    <Progress
                                        value={result.success ? score * 10 : 0}
                                        className={cn(
                                            'h-2',
                                            !result.success && 'opacity-30'
                                        )}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-6 p-3 rounded-lg bg-primary/10 border border-primary/20">
                        <p className="text-sm text-center">
                            <strong>Score variance:</strong>{' '}
                            {(() => {
                                const scores = sortedModels
                                    .filter(m => m.result.success && m.result.data)
                                    .map(m => m.result.data!.score);
                                const min = Math.min(...scores);
                                const max = Math.max(...scores);
                                return `${(max - min).toFixed(1)} points between models`;
                            })()}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
