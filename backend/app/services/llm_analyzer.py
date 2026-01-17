"""
LLM Analyzer - AI-Powered Facial Analysis
Uses Claude/Gemini to provide expert aesthetic analysis
"""
import json
import re
from typing import Optional

from app.core.config import settings
from app.core.prompts import AESTHETIC_EXPERT_PROMPT, format_analysis_prompt
from app.core.constants import get_tier_from_score
from app.models.schemas import GeometricMeasurements, AnalysisResult, RadarData


class LLMAnalyzer:
    """
    LLM-based analyzer for facial aesthetics.
    Sends measurements to Claude/Gemini for expert analysis.
    """
    
    def __init__(self, provider: Optional[str] = None):
        """
        Initialize LLM client
        
        Args:
            provider: 'claude' or 'gemini', defaults to settings
        """
        self.provider = provider or settings.llm_provider
        self._client = None
    
    @property
    def client(self):
        """Lazy initialization of LLM client"""
        if self._client is None:
            if self.provider == "claude":
                self._client = self._init_claude()
            else:
                self._client = self._init_gemini()
        return self._client
    
    def _init_claude(self):
        """Initialize Anthropic Claude client"""
        try:
            from anthropic import Anthropic
            return Anthropic(api_key=settings.anthropic_api_key)
        except ImportError:
            raise ImportError("anthropic package not installed. Run: pip install anthropic")
        except Exception as e:
            raise RuntimeError(f"Failed to initialize Claude client: {e}")
    
    def _init_gemini(self, model_name: str = None):
        """Initialize Google Gemini client with specific model"""
        try:
            import google.generativeai as genai
            genai.configure(api_key=settings.google_api_key)
            model = model_name or settings.gemini_model
            return genai.GenerativeModel(model)
        except ImportError:
            raise ImportError("google-generativeai package not installed. Run: pip install google-generativeai")
        except Exception as e:
            raise RuntimeError(f"Failed to initialize Gemini client: {e}")
    
    def get_gemini_model(self, model_name: str):
        """Get a Gemini client for a specific model"""
        import google.generativeai as genai
        genai.configure(api_key=settings.google_api_key)
        return genai.GenerativeModel(model_name)
    
    def _parse_json_response(self, text: str) -> dict:
        """
        Parse JSON from LLM response, handling markdown code blocks
        
        Args:
            text: Raw LLM response text
            
        Returns:
            Parsed JSON dictionary
        """
        # Try to extract JSON from markdown code block
        json_match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', text)
        if json_match:
            text = json_match.group(1)
        
        # Try to find JSON object directly
        json_match = re.search(r'\{[\s\S]*\}', text)
        if json_match:
            text = json_match.group(0)
        
        try:
            return json.loads(text)
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse LLM response as JSON: {e}")
    
    def _call_claude(self, user_prompt: str) -> str:
        """
        Make API call to Claude
        
        Args:
            user_prompt: User message with measurements
            
        Returns:
            Response text
        """
        response = self.client.messages.create(
            model=settings.claude_model,
            max_tokens=2000,
            system=AESTHETIC_EXPERT_PROMPT,
            messages=[
                {"role": "user", "content": user_prompt}
            ]
        )
        return response.content[0].text
    
    def _call_gemini(self, user_prompt: str) -> str:
        """
        Make API call to Gemini
        
        Args:
            user_prompt: User message with measurements
            
        Returns:
            Response text
        """
        full_prompt = f"{AESTHETIC_EXPERT_PROMPT}\n\n{user_prompt}"
        response = self.client.generate_content(full_prompt)
        return response.text
    
    def analyze(self, measurements: GeometricMeasurements) -> AnalysisResult:
        """
        Perform LLM analysis of facial measurements
        
        Args:
            measurements: Calculated geometric measurements
            
        Returns:
            Complete analysis result with score, tier, and recommendations
        """
        # Format the prompt with actual measurements
        user_prompt = format_analysis_prompt(measurements.model_dump())
        
        # Call the appropriate LLM
        try:
            if self.provider == "claude":
                response_text = self._call_claude(user_prompt)
            else:
                response_text = self._call_gemini(user_prompt)
        except Exception as e:
            # Fallback to rule-based analysis if LLM fails
            return self._fallback_analysis(measurements)
        
        # Parse the response
        try:
            analysis_data = self._parse_json_response(response_text)
        except ValueError:
            return self._fallback_analysis(measurements)
        
        # Validate and construct result
        return self._construct_result(analysis_data, measurements)
    
    def _construct_result(
        self, 
        analysis_data: dict,
        measurements: GeometricMeasurements
    ) -> AnalysisResult:
        """
        Construct AnalysisResult from parsed LLM response
        
        Args:
            analysis_data: Parsed JSON from LLM
            measurements: Original measurements
            
        Returns:
            Validated AnalysisResult
        """
        # Extract radar data
        radar_raw = analysis_data.get("radar_data", {})
        radar_data = RadarData(
            eyes=min(10, max(1, float(radar_raw.get("eyes", 5)))),
            jaw=min(10, max(1, float(radar_raw.get("jaw", 5)))),
            midface=min(10, max(1, float(radar_raw.get("midface", 5)))),
            symmetry=min(10, max(1, float(radar_raw.get("symmetry", 5)))),
            harmony=min(10, max(1, float(radar_raw.get("harmony", 5))))
        )
        
        # Validate score range
        score = min(10.0, max(1.0, float(analysis_data.get("score", 5.0))))
        
        # Get tier (use LLM's tier or derive from score)
        tier = analysis_data.get("tier")
        if not tier:
            tier_info = get_tier_from_score(score)
            tier = tier_info["label"]
        
        return AnalysisResult(
            score=score,
            tier=tier,
            analysis=str(analysis_data.get("analysis", "Analysis not available.")),
            strengths=list(analysis_data.get("strengths", [])),
            weaknesses=list(analysis_data.get("weaknesses", [])),
            advice=str(analysis_data.get("advice", "No specific recommendations.")),
            radar_data=radar_data,
            measurements=measurements
        )
    
    def _fallback_analysis(self, measurements: GeometricMeasurements) -> AnalysisResult:
        """
        Generate rule-based analysis when LLM is unavailable
        
        Args:
            measurements: Calculated measurements
            
        Returns:
            Basic analysis result
        """
        # Calculate basic score from measurements
        scores = []
        strengths = []
        weaknesses = []
        
        # Canthal tilt scoring
        ct = measurements.canthal_tilt
        if 4 <= ct <= 8:
            scores.append(9)
            strengths.append(f"Positive canthal tilt ({ct:.1f}°) creating hunter eye appearance")
        elif 0 <= ct < 4:
            scores.append(7)
            strengths.append(f"Neutral to slightly positive canthal tilt ({ct:.1f}°)")
        elif ct < 0:
            scores.append(5)
            weaknesses.append(f"Negative canthal tilt ({ct:.1f}°) may appear tired")
        else:
            scores.append(7)
        
        # Bigonial ratio scoring
        ratio = measurements.bigonial_bizygomatic_ratio
        if 0.75 <= ratio <= 0.80:
            scores.append(9)
            strengths.append(f"Ideal jaw-to-cheekbone ratio ({ratio*100:.0f}%)")
        elif 0.70 <= ratio < 0.75 or 0.80 < ratio <= 0.85:
            scores.append(7)
        else:
            scores.append(5)
            weaknesses.append(f"Jaw-to-cheekbone ratio ({ratio*100:.0f}%) outside ideal range")
        
        # Gonial angle scoring
        ga = measurements.gonial_angle
        if 125 <= ga <= 130:
            scores.append(9)
            strengths.append(f"Well-defined gonial angle ({ga:.0f}°)")
        elif 120 <= ga < 125 or 130 < ga <= 135:
            scores.append(7)
        else:
            scores.append(5)
            weaknesses.append(f"Gonial angle ({ga:.0f}°) outside ideal range")
        
        # Midface ratio scoring
        mf = measurements.midface_ratio
        if 0.43 <= mf <= 0.44:
            scores.append(9)
            strengths.append("Golden ratio midface proportions")
        elif 0.40 <= mf < 0.43 or 0.44 < mf <= 0.47:
            scores.append(7)
        else:
            scores.append(5)
            weaknesses.append(f"Midface ratio ({mf*100:.0f}%) deviates from ideal")
        
        # Symmetry scoring
        sym = measurements.symmetry_score
        if sym >= 0.95:
            scores.append(9)
            strengths.append(f"Excellent facial symmetry ({sym*100:.0f}%)")
        elif sym >= 0.90:
            scores.append(7)
            strengths.append(f"Good facial symmetry ({sym*100:.0f}%)")
        else:
            scores.append(5)
            weaknesses.append(f"Facial asymmetry detected ({sym*100:.0f}%)")
        
        # Calculate final score
        final_score = sum(scores) / len(scores) if scores else 5.0
        final_score = round(final_score, 1)
        
        # Get tier
        tier_info = get_tier_from_score(final_score)
        
        # Generate radar data from individual scores
        radar_data = RadarData(
            eyes=min(10, max(1, scores[0] if len(scores) > 0 else 5)),
            jaw=min(10, max(1, (scores[1] + scores[2]) / 2 if len(scores) > 2 else 5)),
            midface=min(10, max(1, scores[3] if len(scores) > 3 else 5)),
            symmetry=min(10, max(1, scores[4] if len(scores) > 4 else 5)),
            harmony=final_score
        )
        
        analysis = (
            f"Based on the geometric analysis of your facial features, "
            f"you have achieved an overall score of {final_score}/10, "
            f"placing you in the {tier_info['label']} tier. "
            f"{tier_info['description']}. "
            f"Your face shows {len(strengths)} notable strengths and "
            f"{len(weaknesses)} areas that could be improved."
        )
        
        advice = (
            "Consider maintaining good posture and practicing proper tongue posture (mewing) "
            "for long-term facial development. A lower body fat percentage can help "
            "maximize facial definition. These scores are based on geometric measurements "
            "and should be taken as informational rather than definitive."
        )
        
        return AnalysisResult(
            score=final_score,
            tier=tier_info["label"],
            analysis=analysis,
            strengths=strengths if strengths else ["Analysis in progress"],
            weaknesses=weaknesses if weaknesses else ["No major issues detected"],
            advice=advice,
            radar_data=radar_data,
            measurements=measurements
        )
