"""
API Routes for Project Adam
"""
from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime

from app.models.schemas import (
    ImageInput,
    QuickAnalysisInput,
    AnalysisResponse,
    HealthResponse,
    ErrorResponse,
    ErrorDetail
)
from app.services.vision_engine import VisionEngine
from app.services.geometry_calc import GeometryCalculator
from app.services.llm_analyzer import LLMAnalyzer
from app.api.deps import get_vision_engine, get_geometry_calculator, get_llm_analyzer

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint
    """
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        services={
            "mediapipe": "ok",
            "llm": "ok"
        }
    )


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_face(
    input_data: ImageInput,
    vision_engine: VisionEngine = Depends(get_vision_engine),
    geometry_calc: GeometryCalculator = Depends(get_geometry_calculator),
    llm_analyzer: LLMAnalyzer = Depends(get_llm_analyzer)
):
    """
    Analyze facial aesthetics from front and side images
    
    - **front_image**: Base64 encoded front-facing image
    - **side_image**: Base64 encoded side profile image
    
    Returns detailed analysis including:
    - Overall score (1-10)
    - Tier classification
    - Geometric measurements
    - AI-generated analysis and recommendations
    """
    try:
        # Step 1: Extract landmarks from images
        landmark_data = vision_engine.extract_landmarks_from_base64(
            front_image_base64=input_data.front_image,
            side_image_base64=input_data.side_image
        )
        
        if not landmark_data.face_detected:
            raise HTTPException(
                status_code=400,
                detail={
                    "code": "FACE_NOT_DETECTED",
                    "message": "Could not detect a face in the front image. Please ensure your face is clearly visible and well-lit."
                }
            )
        
        # Step 2: Calculate geometric measurements
        measurements = geometry_calc.calculate_all_measurements(
            front_landmarks=landmark_data.front_landmarks,
            side_landmarks=landmark_data.side_landmarks
        )
        
        # Step 3: Get LLM analysis
        analysis_result = llm_analyzer.analyze(measurements)
        
        # Step 4: Return response
        return AnalysisResponse(
            success=True,
            data=analysis_result,
            timestamp=datetime.utcnow()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "code": "ANALYSIS_ERROR",
                "message": f"An error occurred during analysis: {str(e)}"
            }
        )


@router.post("/analyze/quick", response_model=AnalysisResponse)
async def quick_analyze(
    input_data: QuickAnalysisInput,
    vision_engine: VisionEngine = Depends(get_vision_engine),
    geometry_calc: GeometryCalculator = Depends(get_geometry_calculator),
    llm_analyzer: LLMAnalyzer = Depends(get_llm_analyzer)
):
    """
    Quick analysis using only front-facing image
    
    Note: Some measurements (gonial angle, nasofrontal angle) will be estimated
    since side profile is not provided.
    """
    try:
        # Extract landmarks from front image only
        landmark_data = vision_engine.extract_landmarks_from_base64(
            front_image_base64=input_data.front_image,
            side_image_base64=None
        )
        
        if not landmark_data.face_detected:
            raise HTTPException(
                status_code=400,
                detail={
                    "code": "FACE_NOT_DETECTED",
                    "message": "Could not detect a face in the image."
                }
            )
        
        # Calculate measurements (side_landmarks will be None)
        measurements = geometry_calc.calculate_all_measurements(
            front_landmarks=landmark_data.front_landmarks,
            side_landmarks=None
        )
        
        # Get LLM analysis
        analysis_result = llm_analyzer.analyze(measurements)
        
        return AnalysisResponse(
            success=True,
            data=analysis_result,
            timestamp=datetime.utcnow()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "code": "ANALYSIS_ERROR",
                "message": f"An error occurred during analysis: {str(e)}"
            }
        )


@router.get("/landmarks-info")
async def get_landmarks_info():
    """
    Get information about facial landmarks used in analysis
    """
    from app.core.constants import LANDMARK_INDICES, IDEAL_VALUES
    
    return {
        "landmark_count": 478,
        "key_landmarks": LANDMARK_INDICES,
        "ideal_values": IDEAL_VALUES,
        "description": "MediaPipe Face Mesh provides 468 facial landmarks plus 10 iris landmarks."
    }


@router.get("/models")
async def get_available_models():
    """
    Get list of available Gemini models for comparison
    """
    from app.models.schemas import GeminiModel
    
    return {
        "models": [
            {
                "id": GeminiModel.FLASH_2_0.value,
                "name": "Gemini 2.0 Flash",
                "description": "Fastest, cheapest option. Good for quick analysis.",
                "speed": "⚡⚡⚡",
                "quality": "★★★☆☆"
            },
            {
                "id": GeminiModel.FLASH_1_5.value,
                "name": "Gemini 1.5 Flash",
                "description": "Fast with good quality balance.",
                "speed": "⚡⚡",
                "quality": "★★★☆☆"
            },
            {
                "id": GeminiModel.PRO_1_5.value,
                "name": "Gemini 1.5 Pro",
                "description": "Best quality-to-price ratio. Recommended.",
                "speed": "⚡",
                "quality": "★★★★☆"
            },
            {
                "id": GeminiModel.PRO_2_0.value,
                "name": "Gemini 2.0 Pro (Experimental)",
                "description": "Latest model, highest quality but experimental.",
                "speed": "⚡",
                "quality": "★★★★★"
            }
        ]
    }


@router.post("/analyze/compare")
async def compare_models(
    input_data: "MultiModelInput",
    vision_engine: VisionEngine = Depends(get_vision_engine),
    geometry_calc: GeometryCalculator = Depends(get_geometry_calculator),
):
    """
    Compare analysis results from all 4 Gemini models
    
    Returns results from each model for side-by-side comparison.
    """
    import asyncio
    from concurrent.futures import ThreadPoolExecutor
    from app.models.schemas import GeminiModel, MultiModelInput
    from app.core.prompts import AESTHETIC_EXPERT_PROMPT, format_analysis_prompt
    import google.generativeai as genai
    from app.core.config import settings
    
    try:
        # Step 1: Extract landmarks
        landmark_data = vision_engine.extract_landmarks_from_base64(
            front_image_base64=input_data.front_image,
            side_image_base64=input_data.side_image
        )
        
        if not landmark_data.face_detected:
            raise HTTPException(
                status_code=400,
                detail={
                    "code": "FACE_NOT_DETECTED",
                    "message": "Could not detect a face in the image."
                }
            )
        
        # Step 2: Calculate measurements (same for all models)
        measurements = geometry_calc.calculate_all_measurements(
            front_landmarks=landmark_data.front_landmarks,
            side_landmarks=landmark_data.side_landmarks
        )
        
        # Step 3: Prepare prompt
        user_prompt = format_analysis_prompt(measurements.model_dump())
        full_prompt = f"{AESTHETIC_EXPERT_PROMPT}\n\n{user_prompt}"
        
        # Step 4: Configure Gemini
        genai.configure(api_key=settings.google_api_key)
        
        # Step 5: Run all models in parallel
        models = [
            GeminiModel.FLASH_2_0.value,
            GeminiModel.FLASH_1_5.value,
            GeminiModel.PRO_1_5.value,
            GeminiModel.PRO_2_0.value,
        ]
        
        results = {}
        errors = {}
        
        def call_model(model_name: str):
            try:
                import time
                start = time.time()
                model = genai.GenerativeModel(model_name)
                response = model.generate_content(full_prompt)
                elapsed = time.time() - start
                return {
                    "model": model_name,
                    "response": response.text,
                    "time_seconds": round(elapsed, 2),
                    "success": True
                }
            except Exception as e:
                return {
                    "model": model_name,
                    "error": str(e),
                    "success": False
                }
        
        # Run in parallel using ThreadPoolExecutor
        with ThreadPoolExecutor(max_workers=4) as executor:
            futures = {executor.submit(call_model, m): m for m in models}
            for future in futures:
                result = future.result()
                model_name = result["model"]
                if result["success"]:
                    # Parse the response
                    try:
                        llm_analyzer = LLMAnalyzer()
                        analysis_data = llm_analyzer._parse_json_response(result["response"])
                        analysis_result = llm_analyzer._construct_result(analysis_data, measurements)
                        results[model_name] = {
                            "success": True,
                            "data": analysis_result.model_dump(),
                            "time_seconds": result["time_seconds"]
                        }
                    except Exception as e:
                        results[model_name] = {
                            "success": False,
                            "error": f"Failed to parse response: {e}",
                            "raw_response": result["response"][:500]
                        }
                else:
                    results[model_name] = {
                        "success": False,
                        "error": result["error"]
                    }
        
        return {
            "success": True,
            "measurements": measurements.model_dump(),
            "model_results": results,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "code": "COMPARISON_ERROR",
                "message": f"An error occurred during model comparison: {str(e)}"
            }
        )


# Import MultiModelInput at module level
from app.models.schemas import MultiModelInput
