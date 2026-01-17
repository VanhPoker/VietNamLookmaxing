"""
Pydantic models for request/response schemas
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime
from enum import Enum


# ============================================
# ENUMS
# ============================================

class GeminiModel(str, Enum):
    """Available Gemini models for comparison"""
    FLASH_2_0 = "gemini-2.0-flash"
    FLASH_1_5 = "gemini-1.5-flash"
    PRO_1_5 = "gemini-1.5-pro"
    PRO_2_0 = "gemini-2.0-pro-exp"  # Experimental


# ============================================
# INPUT MODELS
# ============================================

class ImageInput(BaseModel):
    """Input model for image analysis"""
    front_image: str = Field(
        ..., 
        description="Base64 encoded front-facing image"
    )
    side_image: str = Field(
        ..., 
        description="Base64 encoded side profile image"
    )
    model: GeminiModel = Field(
        default=GeminiModel.PRO_1_5,
        description="Gemini model to use for analysis"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "front_image": "data:image/jpeg;base64,/9j/4AAQ...",
                "side_image": "data:image/jpeg;base64,/9j/4AAQ...",
                "model": "gemini-1.5-pro"
            }
        }


class QuickAnalysisInput(BaseModel):
    """Input model for quick analysis (front only)"""
    front_image: str = Field(
        ..., 
        description="Base64 encoded front-facing image"
    )
    model: GeminiModel = Field(
        default=GeminiModel.FLASH_2_0,
        description="Gemini model to use (Flash recommended for quick)"
    )


class MultiModelInput(BaseModel):
    """Input for comparing all 4 models at once"""
    front_image: str = Field(
        ..., 
        description="Base64 encoded front-facing image"
    )
    side_image: Optional[str] = Field(
        None, 
        description="Base64 encoded side profile image (optional)"
    )


# ============================================
# MEASUREMENT MODELS
# ============================================

class GeometricMeasurements(BaseModel):
    """Facial geometric measurements"""
    canthal_tilt: float = Field(
        ..., 
        description="Canthal tilt angle in degrees (positive = hunter eyes)"
    )
    bigonial_bizygomatic_ratio: float = Field(
        ..., 
        description="Ratio of jaw width to cheekbone width (0.0-1.0)"
    )
    midface_ratio: float = Field(
        ..., 
        description="Midface proportion relative to face height (0.0-1.0)"
    )
    gonial_angle: float = Field(
        ..., 
        description="Gonial angle in degrees"
    )
    nasofrontal_angle: float = Field(
        ..., 
        description="Nasofrontal angle in degrees"
    )
    facial_thirds: List[float] = Field(
        ..., 
        description="Proportions of upper, middle, lower face"
    )
    symmetry_score: float = Field(
        ..., 
        description="Facial symmetry score (0.0-1.0)"
    )
    ipd_face_ratio: Optional[float] = Field(
        None, 
        description="Inter-pupillary distance to face width ratio"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "canthal_tilt": 5.2,
                "bigonial_bizygomatic_ratio": 0.77,
                "midface_ratio": 0.44,
                "gonial_angle": 127.3,
                "nasofrontal_angle": 132.5,
                "facial_thirds": [0.32, 0.35, 0.33],
                "symmetry_score": 0.92,
                "ipd_face_ratio": 0.44
            }
        }


# ============================================
# OUTPUT MODELS
# ============================================

class RadarData(BaseModel):
    """Data for radar chart visualization"""
    eyes: float = Field(..., ge=1.0, le=10.0, description="Eye aesthetics score")
    jaw: float = Field(..., ge=1.0, le=10.0, description="Jaw aesthetics score")
    midface: float = Field(..., ge=1.0, le=10.0, description="Midface proportion score")
    symmetry: float = Field(..., ge=1.0, le=10.0, description="Symmetry score")
    harmony: float = Field(..., ge=1.0, le=10.0, description="Overall harmony score")
    
    class Config:
        json_schema_extra = {
            "example": {
                "eyes": 8.5,
                "jaw": 7.5,
                "midface": 6.8,
                "symmetry": 8.2,
                "harmony": 7.8
            }
        }


class AnalysisResult(BaseModel):
    """Complete analysis result from LLM"""
    score: float = Field(
        ..., 
        ge=1.0, 
        le=10.0, 
        description="Overall aesthetic score (1-10)"
    )
    tier: str = Field(
        ..., 
        description="Classification tier (Sub 3, Normie, Chadlite, etc.)"
    )
    analysis: str = Field(
        ..., 
        description="Detailed analysis text"
    )
    strengths: List[str] = Field(
        ..., 
        description="List of facial strengths"
    )
    weaknesses: List[str] = Field(
        ..., 
        description="List of areas for improvement"
    )
    advice: str = Field(
        ..., 
        description="Recommendations for improvement"
    )
    radar_data: RadarData = Field(
        ..., 
        description="Data for radar chart"
    )
    measurements: GeometricMeasurements = Field(
        ..., 
        description="Raw geometric measurements"
    )


class AnalysisResponse(BaseModel):
    """API response wrapper for analysis"""
    success: bool = True
    data: AnalysisResult
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "data": {
                    "score": 7.5,
                    "tier": "Chadlite",
                    "analysis": "Your facial structure demonstrates...",
                    "strengths": ["Positive canthal tilt", "Well-defined jaw"],
                    "weaknesses": ["Slightly elongated midface"],
                    "advice": "Consider mewing exercises...",
                    "radar_data": {
                        "eyes": 8.5,
                        "jaw": 7.5,
                        "midface": 6.8,
                        "symmetry": 8.2,
                        "harmony": 7.8
                    },
                    "measurements": {
                        "canthal_tilt": 5.2,
                        "bigonial_bizygomatic_ratio": 0.77,
                        "midface_ratio": 0.44,
                        "gonial_angle": 127.3,
                        "nasofrontal_angle": 132.5,
                        "facial_thirds": [0.32, 0.35, 0.33],
                        "symmetry_score": 0.92
                    }
                },
                "timestamp": "2026-01-14T22:30:00Z"
            }
        }


# ============================================
# ERROR & STATUS MODELS
# ============================================

class ErrorDetail(BaseModel):
    """Error detail model"""
    code: str = Field(..., description="Error code")
    message: str = Field(..., description="Human-readable error message")


class ErrorResponse(BaseModel):
    """API error response"""
    success: bool = False
    error: ErrorDetail
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class HealthResponse(BaseModel):
    """Health check response"""
    status: str = "healthy"
    version: str = "1.0.0"
    services: dict = Field(
        default_factory=lambda: {
            "mediapipe": "ok",
            "llm": "ok"
        }
    )


# ============================================
# INTERNAL MODELS
# ============================================

class LandmarkData(BaseModel):
    """Extracted landmark data from MediaPipe"""
    front_landmarks: List[List[float]] = Field(
        ..., 
        description="468 landmark points from front image [[x,y,z], ...]"
    )
    side_landmarks: Optional[List[List[float]]] = Field(
        None, 
        description="468 landmark points from side image"
    )
    face_detected: bool = True
    confidence: float = Field(1.0, ge=0.0, le=1.0)
