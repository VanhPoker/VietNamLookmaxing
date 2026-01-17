'use client';

import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RotateCcw, Check, ChevronRight, User, UserCircle, Upload, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CameraCaptureProps {
    onCapture: (frontImage: string, sideImage: string) => void;
    onCancel?: () => void;
}

type CaptureStep = 'front' | 'side' | 'review';
type CaptureMode = 'camera' | 'upload';

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
    const webcamRef = useRef<Webcam>(null);
    const frontInputRef = useRef<HTMLInputElement>(null);
    const sideInputRef = useRef<HTMLInputElement>(null);

    const [mode, setMode] = useState<CaptureMode>('camera');
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

    // Handle file upload
    const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'side') => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                if (type === 'front') {
                    setFrontImage(base64);
                    setStep('side');
                } else {
                    setSideImage(base64);
                    setStep('review');
                }
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const captureWithCountdown = useCallback(() => {
        setCountdown(3);

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev === null || prev <= 1) {
                    clearInterval(timer);
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
            {/* Mode Toggle */}
            <div className="flex justify-center gap-2 mb-6">
                <Button
                    variant={mode === 'camera' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMode('camera')}
                    className="gap-2"
                >
                    <Camera className="w-4 h-4" />
                    Chụp ảnh
                </Button>
                <Button
                    variant={mode === 'upload' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMode('upload')}
                    className="gap-2"
                >
                    <Upload className="w-4 h-4" />
                    Tải ảnh lên
                </Button>
            </div>

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
                    Mặt trước
                </span>
                <span className={cn('text-sm', step === 'side' ? 'text-primary font-medium' : 'text-muted-foreground')}>
                    Mặt nghiêng
                </span>
                <span className={cn('text-sm', step === 'review' ? 'text-primary font-medium' : 'text-muted-foreground')}>
                    Xem lại
                </span>
            </div>

            {/* Hidden file inputs */}
            <input
                type="file"
                ref={frontInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'front')}
            />
            <input
                type="file"
                ref={sideInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'side')}
            />

            {/* Camera / Upload / Review area */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-black/90 border border-border/50">
                <AnimatePresence mode="wait">
                    {step !== 'review' ? (
                        <motion.div
                            key={mode === 'camera' ? 'camera' : 'upload'}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative w-full h-full"
                        >
                            {mode === 'camera' ? (
                                <>
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

                                    {/* Camera switch button */}
                                    <button
                                        onClick={toggleCamera}
                                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                                    >
                                        <RotateCcw className="w-5 h-5 text-white" />
                                    </button>
                                </>
                            ) : (
                                // Upload mode
                                <div className="w-full h-full flex items-center justify-center">
                                    <div
                                        onClick={() => step === 'front' ? frontInputRef.current?.click() : sideInputRef.current?.click()}
                                        className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 border-dashed border-primary/50 hover:border-primary cursor-pointer transition-colors"
                                    >
                                        <ImagePlus className="w-16 h-16 text-primary/60" />
                                        <div className="text-center">
                                            <p className="text-lg font-medium text-foreground">
                                                Tải ảnh {step === 'front' ? 'mặt trước' : 'mặt nghiêng'}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Click để chọn ảnh từ thiết bị
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Instructions */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-center text-white text-sm">
                                    {step === 'front'
                                        ? mode === 'camera'
                                            ? 'Đặt khuôn mặt trong khung. Nhìn thẳng vào camera.'
                                            : 'Chọn ảnh mặt trước rõ nét, nhìn thẳng.'
                                        : mode === 'camera'
                                            ? 'Quay đầu sang bên để chụp profile.'
                                            : 'Chọn ảnh mặt nghiêng (profile).'}
                                </p>
                            </div>
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
                                    <img src={frontImage} alt="Mặt trước" className="w-full h-full object-cover" />
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button variant="secondary" size="sm" onClick={() => retake('front')}>
                                        <RotateCcw className="w-4 h-4 mr-2" /> Chụp lại
                                    </Button>
                                </div>
                                <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-black/60 text-white text-xs flex items-center gap-1">
                                    <User className="w-3 h-3" /> Mặt trước
                                </div>
                            </div>

                            {/* Side image */}
                            <div className="relative rounded-2xl overflow-hidden group">
                                {sideImage && (
                                    <img src={sideImage} alt="Mặt nghiêng" className="w-full h-full object-cover" />
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button variant="secondary" size="sm" onClick={() => retake('side')}>
                                        <RotateCcw className="w-4 h-4 mr-2" /> Chụp lại
                                    </Button>
                                </div>
                                <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-black/60 text-white text-xs flex items-center gap-1">
                                    <UserCircle className="w-3 h-3" /> Mặt nghiêng
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
                        Hủy
                    </Button>
                )}

                {step !== 'review' ? (
                    mode === 'camera' ? (
                        <Button
                            onClick={captureWithCountdown}
                            disabled={countdown !== null}
                            className="flex-1 gap-2"
                            size="lg"
                        >
                            <Camera className="w-5 h-5" />
                            Chụp {step === 'front' ? 'mặt trước' : 'mặt nghiêng'}
                        </Button>
                    ) : (
                        <Button
                            onClick={() => step === 'front' ? frontInputRef.current?.click() : sideInputRef.current?.click()}
                            className="flex-1 gap-2"
                            size="lg"
                        >
                            <Upload className="w-5 h-5" />
                            Tải ảnh {step === 'front' ? 'mặt trước' : 'mặt nghiêng'}
                        </Button>
                    )
                ) : (
                    <Button onClick={handleSubmit} className="flex-1 gap-2" size="lg">
                        Phân Tích Ngay
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
            <ellipse cx="100" cy="120" rx="65" ry="85" className="text-cyan stroke-2" strokeDasharray="8 4" />
            <ellipse cx="70" cy="100" rx="18" ry="10" className="text-primary/60" strokeDasharray="4 2" />
            <ellipse cx="130" cy="100" rx="18" ry="10" className="text-primary/60" strokeDasharray="4 2" />
            <line x1="100" y1="110" x2="100" y2="145" className="text-primary/40" strokeDasharray="4 2" />
            <ellipse cx="100" cy="165" rx="25" ry="10" className="text-primary/40" strokeDasharray="4 2" />
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
            <circle cx="105" cy="95" r="8" className="text-primary/60" strokeDasharray="4 2" />
            <path
                d="M 130 165 Q 115 190, 85 210"
                className="text-primary/60"
                strokeDasharray="4 2"
            />
            <path
                d="M 125 100 L 142 120 Q 145 125, 138 130"
                className="text-primary/40"
                strokeDasharray="4 2"
            />
        </svg>
    );
}
