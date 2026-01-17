'use client';

import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RotateCcw, Check, ChevronRight, User, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CameraCaptureProps {
    onCapture: (frontImage: string, sideImage: string) => void;
    onCancel?: () => void;
}

type CaptureStep = 'front' | 'side' | 'review';

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
    const webcamRef = useRef<Webcam>(null);
    const [step, setStep] = useState<CaptureStep>('front');
    const [frontImage, setFrontImage] = useState<string | null>(null);
    const [sideImage, setSideImage] = useState<string | null>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
    const [countdown, setCountdown] = useState<number | null>(null);

    const videoConstraints = {
        width: 720,
        height: 720,
        facingMode: facingMode,
    };

    const captureWithCountdown = useCallback(() => {
        setCountdown(3);

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev === null || prev <= 1) {
                    clearInterval(timer);
                    // Capture image
                    const imageSrc = webcamRef.current?.getScreenshot();
                    if (imageSrc) {
                        if (step === 'front') {
                            setFrontImage(imageSrc);
                            setStep('side');
                        } else if (step === 'side') {
                            setSideImage(imageSrc);
                            setStep('review');
                        }
                    }
                    return null;
                }
                return prev - 1;
            });
        }, 1000);
    }, [step]);

    const retake = useCallback((which: 'front' | 'side') => {
        if (which === 'front') {
            setFrontImage(null);
            setSideImage(null);
            setStep('front');
        } else {
            setSideImage(null);
            setStep('side');
        }
    }, []);

    const handleSubmit = useCallback(() => {
        if (frontImage && sideImage) {
            onCapture(frontImage, sideImage);
        }
    }, [frontImage, sideImage, onCapture]);

    const toggleCamera = () => {
        setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Progress indicator */}
            <div className="flex items-center justify-center gap-2 mb-6">
                {(['front', 'side', 'review'] as const).map((s, i) => (
                    <React.Fragment key={s}>
                        <div
                            className={cn(
                                'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300',
                                step === s
                                    ? 'border-primary bg-primary text-primary-foreground scale-110'
                                    : (step === 'side' && s === 'front') || (step === 'review')
                                        ? 'border-primary bg-primary/20 text-primary'
                                        : 'border-muted-foreground/30 text-muted-foreground'
                            )}
                        >
                            {(step === 'side' && s === 'front') || (step === 'review' && s !== 'review') ? (
                                <Check className="w-5 h-5" />
                            ) : (
                                <span className="text-sm font-semibold">{i + 1}</span>
                            )}
                        </div>
                        {i < 2 && (
                            <div
                                className={cn(
                                    'w-12 h-0.5 transition-colors duration-300',
                                    (step === 'side' && i === 0) || step === 'review'
                                        ? 'bg-primary'
                                        : 'bg-muted-foreground/30'
                                )}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Step labels */}
            <div className="flex justify-between mb-6 px-4">
                <span className={cn('text-sm', step === 'front' ? 'text-primary font-medium' : 'text-muted-foreground')}>
                    Front View
                </span>
                <span className={cn('text-sm', step === 'side' ? 'text-primary font-medium' : 'text-muted-foreground')}>
                    Side Profile
                </span>
                <span className={cn('text-sm', step === 'review' ? 'text-primary font-medium' : 'text-muted-foreground')}>
                    Review
                </span>
            </div>

            {/* Camera / Review area */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-black/90 border border-border/50">
                <AnimatePresence mode="wait">
                    {step !== 'review' ? (
                        <motion.div
                            key="camera"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative w-full h-full"
                        >
                            <Webcam
                                ref={webcamRef}
                                audio={false}
                                screenshotFormat="image/jpeg"
                                videoConstraints={videoConstraints}
                                className="w-full h-full object-cover"
                                mirrored={facingMode === 'user'}
                            />

                            {/* Face guide overlay */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                {step === 'front' ? (
                                    <FrontFaceOverlay />
                                ) : (
                                    <SideFaceOverlay />
                                )}
                            </div>

                            {/* Countdown overlay */}
                            <AnimatePresence>
                                {countdown !== null && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        className="absolute inset-0 flex items-center justify-center bg-black/50"
                                    >
                                        <motion.span
                                            key={countdown}
                                            initial={{ scale: 1.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.5, opacity: 0 }}
                                            className="text-8xl font-bold text-white drop-shadow-lg"
                                        >
                                            {countdown}
                                        </motion.span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Instructions */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-center text-white text-sm">
                                    {step === 'front'
                                        ? 'Position your face within the guide. Look straight at the camera.'
                                        : 'Turn your head to show your side profile.'}
                                </p>
                            </div>

                            {/* Camera switch button */}
                            <button
                                onClick={toggleCamera}
                                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                            >
                                <RotateCcw className="w-5 h-5 text-white" />
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="review"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full grid grid-cols-2 gap-2 p-2"
                        >
                            {/* Front image */}
                            <div className="relative rounded-2xl overflow-hidden group">
                                {frontImage && (
                                    <img src={frontImage} alt="Front view" className="w-full h-full object-cover" />
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button variant="secondary" size="sm" onClick={() => retake('front')}>
                                        <RotateCcw className="w-4 h-4 mr-2" /> Retake
                                    </Button>
                                </div>
                                <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-black/60 text-white text-xs flex items-center gap-1">
                                    <User className="w-3 h-3" /> Front
                                </div>
                            </div>

                            {/* Side image */}
                            <div className="relative rounded-2xl overflow-hidden group">
                                {sideImage && (
                                    <img src={sideImage} alt="Side view" className="w-full h-full object-cover" />
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button variant="secondary" size="sm" onClick={() => retake('side')}>
                                        <RotateCcw className="w-4 h-4 mr-2" /> Retake
                                    </Button>
                                </div>
                                <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-black/60 text-white text-xs flex items-center gap-1">
                                    <UserCircle className="w-3 h-3" /> Side
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 mt-6">
                {onCancel && (
                    <Button variant="outline" onClick={onCancel} className="flex-1">
                        Cancel
                    </Button>
                )}

                {step !== 'review' ? (
                    <Button
                        onClick={captureWithCountdown}
                        disabled={countdown !== null}
                        className="flex-1 gap-2"
                        size="lg"
                    >
                        <Camera className="w-5 h-5" />
                        Capture {step === 'front' ? 'Front' : 'Side'}
                    </Button>
                ) : (
                    <Button onClick={handleSubmit} className="flex-1 gap-2" size="lg">
                        Analyze Now
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                )}
            </div>
        </div>
    );
}

// Front face outline SVG overlay
function FrontFaceOverlay() {
    return (
        <svg
            viewBox="0 0 200 240"
            className="w-64 h-80 opacity-60"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
        >
            {/* Face outline */}
            <ellipse cx="100" cy="120" rx="65" ry="85" className="text-cyan stroke-2" strokeDasharray="8 4" />

            {/* Eye guides */}
            <ellipse cx="70" cy="100" rx="18" ry="10" className="text-primary/60" strokeDasharray="4 2" />
            <ellipse cx="130" cy="100" rx="18" ry="10" className="text-primary/60" strokeDasharray="4 2" />

            {/* Nose guide */}
            <line x1="100" y1="110" x2="100" y2="145" className="text-primary/40" strokeDasharray="4 2" />

            {/* Mouth guide */}
            <ellipse cx="100" cy="165" rx="25" ry="10" className="text-primary/40" strokeDasharray="4 2" />

            {/* Center crosshair */}
            <line x1="100" y1="60" x2="100" y2="75" className="text-cyan/80" />
            <line x1="85" y1="120" x2="100" y2="120" className="text-cyan/80" />
            <line x1="100" y1="120" x2="115" y2="120" className="text-cyan/80" />
        </svg>
    );
}

// Side face outline SVG overlay
function SideFaceOverlay() {
    return (
        <svg
            viewBox="0 0 200 240"
            className="w-64 h-80 opacity-60"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
        >
            {/* Side profile outline */}
            <path
                d="M 120 50 
           Q 130 60, 130 80 
           Q 130 95, 125 100
           L 140 115
           Q 145 120, 142 130
           Q 135 145, 130 155
           L 130 165
           Q 130 180, 115 195
           Q 100 210, 85 210
           L 70 210
           Q 60 200, 60 180
           L 60 100
           Q 60 70, 80 55
           Q 100 40, 120 50"
                className="text-cyan stroke-2"
                strokeDasharray="8 4"
            />

            {/* Eye position */}
            <circle cx="105" cy="95" r="8" className="text-primary/60" strokeDasharray="4 2" />

            {/* Jaw line guide */}
            <path
                d="M 130 165 Q 115 190, 85 210"
                className="text-primary/60"
                strokeDasharray="4 2"
            />

            {/* Nose guide */}
            <path
                d="M 125 100 L 142 120 Q 145 125, 138 130"
                className="text-primary/40"
                strokeDasharray="4 2"
            />
        </svg>
    );
}
