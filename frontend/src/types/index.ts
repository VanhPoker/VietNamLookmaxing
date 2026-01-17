// API Response Types
export interface RadarData {
    eyes: number;
    jaw: number;
    midface: number;
    symmetry: number;
    harmony: number;
}

export interface GeometricMeasurements {
    canthal_tilt: number;
    bigonial_bizygomatic_ratio: number;
    midface_ratio: number;
    gonial_angle: number;
    nasofrontal_angle: number;
    facial_thirds: [number, number, number];
    symmetry_score: number;
    ipd_face_ratio?: number;
}

export interface AnalysisResult {
    score: number;
    tier: string;
    analysis: string;
    strengths: string[];
    weaknesses: string[];
    advice: string;
    radar_data: RadarData;
    measurements: GeometricMeasurements;
}

export interface AnalysisResponse {
    success: boolean;
    data: AnalysisResult;
    timestamp: string;
}

export interface ErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
    };
    timestamp: string;
}

// Model Comparison Types
export interface GeminiModelInfo {
    id: string;
    name: string;
    description: string;
    speed: string;
    quality: string;
}

export interface ModelResult {
    success: boolean;
    data?: AnalysisResult;
    time_seconds?: number;
    error?: string;
    raw_response?: string;
}

export interface CompareResponse {
    success: boolean;
    measurements: GeometricMeasurements;
    model_results: Record<string, ModelResult>;
    timestamp: string;
}

// Available Gemini Models
export const GEMINI_MODELS: GeminiModelInfo[] = [
    {
        id: 'gemini-2.0-flash',
        name: 'Gemini 2.0 Flash',
        description: 'Fastest, cheapest option. Good for quick analysis.',
        speed: '⚡⚡⚡',
        quality: '★★★☆☆'
    },
    {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        description: 'Fast with good quality balance.',
        speed: '⚡⚡',
        quality: '★★★☆☆'
    },
    {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        description: 'Best quality-to-price ratio. Recommended.',
        speed: '⚡',
        quality: '★★★★☆'
    },
    {
        id: 'gemini-2.0-pro-exp',
        name: 'Gemini 2.0 Pro',
        description: 'Latest model, highest quality but experimental.',
        speed: '⚡',
        quality: '★★★★★'
    }
];

// Component Props Types
export interface CameraCaptureProps {
    onCapture: (frontImage: string, sideImage: string) => void;
    onCancel?: () => void;
}

export interface ResultCardProps {
    result: AnalysisResult;
    onAnalyzeAgain?: () => void;
}

export interface RadarChartProps {
    data: RadarData;
    size?: number;
}

// Tier Definitions
export const TIER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    'Sub 3': { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/50' },
    'Sub 5': { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/50' },
    'Normie': { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50' },
    'HTN': { bg: 'bg-lime-500/20', text: 'text-lime-400', border: 'border-lime-500/50' },
    'Chadlite': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/50' },
    'Chad': { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/50' },
    'Adam': { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/50' },
};

export const MEASUREMENT_LABELS: Record<string, { label: string; ideal: string; unit: string }> = {
    canthal_tilt: { label: 'Canthal Tilt', ideal: '+4° to +8°', unit: '°' },
    bigonial_bizygomatic_ratio: { label: 'Jaw/Cheekbone Ratio', ideal: '75-80%', unit: '%' },
    midface_ratio: { label: 'Midface Ratio', ideal: '43-44%', unit: '%' },
    gonial_angle: { label: 'Gonial Angle', ideal: '125-130°', unit: '°' },
    nasofrontal_angle: { label: 'Nasofrontal Angle', ideal: '130-135°', unit: '°' },
    symmetry_score: { label: 'Symmetry', ideal: '>95%', unit: '%' },
};
