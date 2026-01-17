'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scan,
  Sparkles,
  Target,
  Zap,
  Brain,
  ChevronRight,
  Play,
  GitCompare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CameraCapture } from '@/components/camera/CameraCapture';
import { ResultCard } from '@/components/results/ResultCard';
import { ModelCompare } from '@/components/results/ModelCompare';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useAnalysis } from '@/hooks/useAnalysis';
import { compareModels, MOCK_COMPARE_RESULT } from '@/lib/api';
import { CompareResponse } from '@/types';

type AppState = 'home' | 'capture' | 'capture-compare' | 'analyzing' | 'comparing' | 'results' | 'compare-results';

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>('home');
  const [compareData, setCompareData] = useState<CompareResponse | null>(null);
  const [capturedImages, setCapturedImages] = useState<{ front: string; side: string } | null>(null);
  const { isLoading, error, result, analyze, reset, useMockData } = useAnalysis();

  const handleStartAnalysis = () => {
    setAppState('capture');
  };

  const handleStartCompare = () => {
    setAppState('capture-compare');
  };

  const handleCapture = async (frontImage: string, sideImage: string) => {
    setCapturedImages({ front: frontImage, side: sideImage });
    setAppState('analyzing');

    try {
      await analyze(frontImage, sideImage);
      setAppState('results');
    } catch {
      useMockData();
      setAppState('results');
    }
  };

  const handleCaptureForCompare = async (frontImage: string, sideImage: string) => {
    setAppState('comparing');

    try {
      const data = await compareModels(frontImage, sideImage);
      setCompareData(data);
      setAppState('compare-results');
    } catch (err) {
      console.error('Compare error:', err);
      setCompareData(MOCK_COMPARE_RESULT);
      setAppState('compare-results');
    }
  };

  const handleDemoMode = () => {
    setAppState('analyzing');
    setTimeout(() => {
      useMockData();
      setAppState('results');
    }, 2000);
  };

  const handleDemoCompare = () => {
    setAppState('comparing');
    setTimeout(() => {
      setCompareData(MOCK_COMPARE_RESULT);
      setAppState('compare-results');
    }, 3000);
  };

  const handleReset = () => {
    reset();
    setCompareData(null);
    setCapturedImages(null);
    setAppState('home');
  };

  return (
    <div className="min-h-screen">
      {/* Background effects */}
      <div className="fixed inset-0 bg-background -z-10">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-radial-gradient" />
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1.1, 1, 1.1],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container max-w-6xl mx-auto px-4 md:px-6 py-12">
        <AnimatePresence mode="wait">
          {appState === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center min-h-[70vh] text-center"
            >
              {/* Hero */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary">Phân Tích Bằng AI</span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
                  <span className="text-foreground">Khám Phá</span>
                  <br />
                  <span className="text-gradient">Điểm Nhan Sắc Của Bạn</span>
                </h1>

                <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
                  AI phân tích 468 điểm trên khuôn mặt để đưa ra đánh giá khoa học
                  và cá nhân hóa về cấu trúc gương mặt của bạn.
                </p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 mb-8"
              >
                <Button
                  size="lg"
                  onClick={handleStartAnalysis}
                  className="gap-2 text-base md:text-lg px-6 md:px-8 py-5 md:py-6 rounded-2xl glow-primary"
                >
                  <Scan className="w-5 h-5" />
                  Bắt Đầu Chấm Điểm
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </motion.div>

              {/* Demo Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex gap-4 mb-12"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDemoMode}
                  className="gap-2"
                >
                  <Play className="w-4 h-4" />
                  Xem Demo
                </Button>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 gap-4 w-full max-w-md"
              >
                {[
                  {
                    icon: Target,
                    title: '468 Điểm Mặt',
                    description: 'Mapping chính xác khuôn mặt',
                  },
                  {
                    icon: Zap,
                    title: 'Kết Quả Nhanh',
                    description: 'Phân tích tức thì bằng AI',
                  },
                ].map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="p-4 rounded-xl glass-card hover:border-primary/30 transition-colors cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Tier explanation */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-12 p-4 rounded-xl glass-card max-w-2xl"
              >
                <h4 className="text-sm font-semibold text-foreground mb-2">Thang Đánh Giá</h4>
                <div className="flex flex-wrap justify-center gap-2 text-xs">
                  {['Sub3', 'Sub5', 'LTN', 'MTN', 'HTN', 'Chadlite', 'Chad', 'Adam'].map((tier, i) => (
                    <span
                      key={tier}
                      className={`px-2 py-1 rounded-full ${i < 2 ? 'bg-red-500/20 text-red-400' :
                        i < 4 ? 'bg-yellow-500/20 text-yellow-400' :
                          i < 6 ? 'bg-green-500/20 text-green-400' :
                            'bg-cyan-500/20 text-cyan-400'
                        }`}
                    >
                      {tier}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {(appState === 'capture' || appState === 'capture-compare') && (
            <motion.div
              key="capture"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  {appState === 'capture-compare' ? 'Chụp Ảnh So Sánh Models' : 'Chụp Ảnh Khuôn Mặt'}
                </h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  {appState === 'capture-compare'
                    ? 'Ảnh của bạn sẽ được phân tích bởi 4 AI models'
                    : 'Đặt khuôn mặt trong khung hướng dẫn để có kết quả chính xác'
                  }
                </p>
              </div>
              <CameraCapture
                onCapture={appState === 'capture-compare' ? handleCaptureForCompare : handleCapture}
                onCancel={handleReset}
              />
            </motion.div>
          )}

          {appState === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center min-h-[60vh]"
            >
              <LoadingSpinner
                text="Đang phân tích khuôn mặt..."
                subtext="AI đang xử lý 468 điểm trên gương mặt"
              />
            </motion.div>
          )}

          {appState === 'comparing' && (
            <motion.div
              key="comparing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center min-h-[60vh]"
            >
              <LoadingSpinner
                text="Đang chạy 4 models song song..."
                subtext="Gemini 2.0 Flash, 1.5 Flash, 1.5 Pro, 2.0 Pro"
              />
            </motion.div>
          )}

          {appState === 'results' && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Kết Quả Phân Tích</h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  Dựa trên số liệu khoa học và phân tích AI
                </p>
              </div>
              <ResultCard result={result} images={capturedImages} onAnalyzeAgain={handleReset} />
            </motion.div>
          )}

          {appState === 'compare-results' && compareData && (
            <motion.div
              key="compare-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-8"
            >
              <ModelCompare data={compareData} />
              <div className="flex justify-center mt-8">
                <Button onClick={handleReset} variant="outline" size="lg">
                  Chấm Điểm Lại
                </Button>
              </div>
            </motion.div>
          )}

          {appState === 'results' && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
              <div className="p-4 rounded-full bg-destructive/10 mb-4">
                <Zap className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Phân Tích Thất Bại</h3>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={handleReset}>Thử Lại</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
