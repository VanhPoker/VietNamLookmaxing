'use client';

import { useState, useCallback } from 'react';
import { AnalysisResult, AnalysisResponse } from '@/types';
import { analyzeImages, MOCK_ANALYSIS_RESULT } from '@/lib/api';

interface UseAnalysisState {
    isLoading: boolean;
    error: string | null;
    result: AnalysisResult | null;
}

interface UseAnalysisReturn extends UseAnalysisState {
    analyze: (frontImage: string, sideImage: string) => Promise<void>;
    reset: () => void;
    useMockData: () => void;
}

export function useAnalysis(): UseAnalysisReturn {
    const [state, setState] = useState<UseAnalysisState>({
        isLoading: false,
        error: null,
        result: null,
    });

    const analyze = useCallback(async (frontImage: string, sideImage: string) => {
        setState({ isLoading: true, error: null, result: null });

        try {
            const response: AnalysisResponse = await analyzeImages({
                frontImage,
                sideImage,
            });

            if (response.success) {
                setState({ isLoading: false, error: null, result: response.data });
            } else {
                throw new Error('Analysis failed');
            }
        } catch (err) {
            setState({
                isLoading: false,
                error: err instanceof Error ? err.message : 'An unexpected error occurred',
                result: null,
            });
        }
    }, []);

    const reset = useCallback(() => {
        setState({ isLoading: false, error: null, result: null });
    }, []);

    const useMockData = useCallback(() => {
        setState({ isLoading: false, error: null, result: MOCK_ANALYSIS_RESULT.data });
    }, []);

    return {
        ...state,
        analyze,
        reset,
        useMockData,
    };
}
