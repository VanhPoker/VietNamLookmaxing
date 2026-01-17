"""
Constants for facial landmark indices and ideal aesthetic values
Based on MediaPipe Face Mesh (468 landmarks)
"""

# ============================================
# MEDIAPIPE LANDMARK INDICES
# ============================================

LANDMARK_INDICES = {
    # Eye landmarks (for canthal tilt)
    "left_inner_canthus": 133,
    "left_outer_canthus": 33,
    "right_inner_canthus": 362,
    "right_outer_canthus": 263,
    
    # Pupil centers (approximation)
    "left_pupil": 468,  # Note: MediaPipe has iris landmarks 468-472
    "right_pupil": 473,
    
    # Jaw landmarks (for bigonial width & gonial angle)
    "left_gonion": 172,
    "right_gonion": 397,
    "left_jaw_1": 132,
    "right_jaw_1": 361,
    "left_jaw_2": 58,
    "right_jaw_2": 288,
    
    # Cheekbone landmarks (for bizygomatic width)
    "left_zygion": 93,
    "right_zygion": 323,
    "left_cheekbone": 116,
    "right_cheekbone": 345,
    
    # Vertical face landmarks
    "forehead_top": 10,
    "glabella": 9,
    "nasion": 168,
    "nose_tip": 4,
    "subnasale": 94,
    "upper_lip": 0,
    "lower_lip": 17,
    "chin_menton": 152,
    "chin_pogonion": 199,
    
    # Nose bridge (for nasofrontal angle - side view)
    "nose_bridge_1": 6,
    "nose_bridge_2": 197,
    "nose_bridge_3": 195,
    
    # Eyebrow landmarks
    "left_eyebrow_inner": 107,
    "left_eyebrow_outer": 70,
    "right_eyebrow_inner": 336,
    "right_eyebrow_outer": 300,
    
    # Lip landmarks
    "lip_left_corner": 61,
    "lip_right_corner": 291,
    "upper_lip_center": 13,
    "lower_lip_center": 14,
    
    # Face contour
    "face_left_1": 234,
    "face_right_1": 454,
}

# ============================================
# IDEAL AESTHETIC VALUES
# Based on PSL/Orthotropics research
# ============================================

IDEAL_VALUES = {
    # Canthal Tilt (degrees)
    # Positive = outer canthus higher than inner (hunter eyes)
    "canthal_tilt": {
        "ideal_min": 4.0,
        "ideal_max": 8.0,
        "neutral": 0.0,
        "description": "Angle between inner and outer corners of the eye"
    },
    
    # Bigonial to Bizygomatic Width Ratio
    # Lower ratio = more V-shaped/tapered face
    "bigonial_bizygomatic_ratio": {
        "ideal_min": 0.75,
        "ideal_max": 0.80,
        "description": "Jaw width relative to cheekbone width"
    },
    
    # Gonial Angle (degrees)
    # Lower = stronger, more defined jaw
    "gonial_angle": {
        "ideal_min": 125.0,
        "ideal_max": 130.0,
        "description": "Angle of the jaw bone at the gonion"
    },
    
    # Midface Ratio
    # Distance from pupil to lip / total face height
    "midface_ratio": {
        "ideal_min": 0.43,
        "ideal_max": 0.44,
        "description": "Proportion of midface to total face height"
    },
    
    # Nasofrontal Angle (degrees)
    # Angle at the nasion between forehead and nose bridge
    "nasofrontal_angle": {
        "ideal_min": 130.0,
        "ideal_max": 135.0,
        "description": "Angle between forehead and nose bridge"
    },
    
    # Facial Thirds
    # Ideal: each third should be ~33.3%
    "facial_thirds": {
        "ideal": [0.333, 0.333, 0.333],
        "tolerance": 0.03,
        "description": "Upper, middle, lower face proportions"
    },
    
    # Facial Symmetry Score (0-1)
    "symmetry": {
        "ideal_min": 0.95,
        "description": "How symmetrical the face is (1.0 = perfect)"
    },
    
    # Inter-pupillary distance to face width ratio
    "ipd_face_ratio": {
        "ideal_min": 0.42,
        "ideal_max": 0.46,
        "description": "Eye spacing relative to face width"
    },
}

# ============================================
# SCORING TIERS
# ============================================

TIER_DEFINITIONS = {
    "sub3": {
        "range": (1.0, 2.9),
        "label": "Sub 3",
        "description": "Severe facial underdevelopment, multiple failos"
    },
    "sub5": {
        "range": (3.0, 4.9),
        "label": "Sub 5", 
        "description": "Below average, notable failos present"
    },
    "normie": {
        "range": (5.0, 5.9),
        "label": "Normie",
        "description": "Average appearance, unremarkable features"
    },
    "htn": {
        "range": (6.0, 6.9),
        "label": "HTN",
        "description": "High-tier Normie, some attractive features"
    },
    "chadlite": {
        "range": (7.0, 7.9),
        "label": "Chadlite",
        "description": "Attractive, mostly positive features"
    },
    "chad": {
        "range": (8.0, 8.9),
        "label": "Chad",
        "description": "Very attractive, minimal failos"
    },
    "adam": {
        "range": (9.0, 10.0),
        "label": "Adam",
        "description": "Near-perfect facial harmony and aesthetics"
    }
}


def get_tier_from_score(score: float) -> dict:
    """Get tier information from a numeric score"""
    for tier_key, tier_info in TIER_DEFINITIONS.items():
        min_score, max_score = tier_info["range"]
        if min_score <= score <= max_score:
            return {
                "key": tier_key,
                "label": tier_info["label"],
                "description": tier_info["description"]
            }
    return {
        "key": "unknown",
        "label": "Unknown",
        "description": "Score out of range"
    }
