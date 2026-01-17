import { AnalysisResponse, ErrorResponse, CompareResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface AnalyzeImagesParams {
    frontImage: string;
    sideImage: string;
    model?: string;
}

export async function analyzeImages(params: AnalyzeImagesParams): Promise<AnalysisResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/analyze`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            front_image: params.frontImage,
            side_image: params.sideImage,
            model: params.model || 'gemini-1.5-pro',
        }),
    });

    if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(errorData.error?.message || 'Analysis failed');
    }

    return response.json();
}

export async function compareModels(
    frontImage: string,
    sideImage?: string
): Promise<CompareResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/analyze/compare`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            front_image: frontImage,
            side_image: sideImage || null,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail?.message || 'Comparison failed');
    }

    return response.json();
}

export async function healthCheck(): Promise<{ status: string; version: string }> {
    const response = await fetch(`${API_BASE_URL}/api/v1/health`);

    if (!response.ok) {
        throw new Error('Backend service unavailable');
    }

    return response.json();
}

// Demo/Mock data for testing UI without backend
export const MOCK_ANALYSIS_RESULT: AnalysisResponse = {
    success: true,
    data: {
        score: 7.5,
        tier: 'Chadlite',
        analysis: 'Your facial structure demonstrates several positive aesthetic qualities. The positive canthal tilt (+5.2°) creates an attractive "hunter eyes" appearance, while the well-defined gonial angle (127°) indicates good jaw development. The facial thirds are reasonably balanced, though the midface is slightly elongated at 46%.',
        strengths: [
            'Positive canthal tilt (+5.2°) creating hunter eye appearance',
            'Well-defined gonial angle (127°) showing strong jaw',
            'Good facial symmetry (92%)',
            'Balanced jaw-to-cheekbone ratio (77%)'
        ],
        weaknesses: [
            'Slightly elongated midface ratio (46% vs ideal 43-44%)',
            'Nasofrontal angle slightly above ideal range'
        ],
        advice: 'To further enhance your appearance, consider maintaining low body fat to maximize facial definition. Mewing exercises can help improve tongue posture for better facial development over time. Your strong features are already well-developed.',
        radar_data: {
            eyes: 8.5,
            jaw: 7.5,
            midface: 6.8,
            symmetry: 8.2,
            harmony: 7.5
        },
        measurements: {
            canthal_tilt: 5.2,
            bigonial_bizygomatic_ratio: 0.77,
            midface_ratio: 0.46,
            gonial_angle: 127.3,
            nasofrontal_angle: 136.5,
            facial_thirds: [0.32, 0.35, 0.33],
            symmetry_score: 0.92
        }
    },
    timestamp: new Date().toISOString()
};

// Mock comparison data
export const MOCK_COMPARE_RESULT: CompareResponse = {
    success: true,
    measurements: {
        canthal_tilt: 5.2,
        bigonial_bizygomatic_ratio: 0.77,
        midface_ratio: 0.46,
        gonial_angle: 127.3,
        nasofrontal_angle: 136.5,
        facial_thirds: [0.32, 0.35, 0.33],
        symmetry_score: 0.92
    },
    model_results: {
        'gemini-2.0-flash': {
            success: true,
            time_seconds: 1.2,
            data: { ...MOCK_ANALYSIS_RESULT.data, score: 7.3 }
        },
        'gemini-1.5-flash': {
            success: true,
            time_seconds: 1.8,
            data: { ...MOCK_ANALYSIS_RESULT.data, score: 7.4 }
        },
        'gemini-1.5-pro': {
            success: true,
            time_seconds: 3.5,
            data: { ...MOCK_ANALYSIS_RESULT.data, score: 7.5 }
        },
        'gemini-2.0-pro-exp': {
            success: true,
            time_seconds: 4.2,
            data: { ...MOCK_ANALYSIS_RESULT.data, score: 7.6 }
        }
    },
    timestamp: new Date().toISOString()
};
