"""
API Dependencies
"""
from functools import lru_cache
from app.services.vision_engine import VisionEngine
from app.services.geometry_calc import GeometryCalculator
from app.services.llm_analyzer import LLMAnalyzer


@lru_cache()
def get_vision_engine() -> VisionEngine:
    """Get cached VisionEngine instance"""
    return VisionEngine()


@lru_cache()
def get_geometry_calculator() -> GeometryCalculator:
    """Get cached GeometryCalculator instance"""
    return GeometryCalculator()


@lru_cache()
def get_llm_analyzer() -> LLMAnalyzer:
    """Get cached LLMAnalyzer instance"""
    return LLMAnalyzer()
