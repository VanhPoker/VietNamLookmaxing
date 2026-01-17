"""
Geometry Calculator - Facial Measurements
Calculates aesthetic metrics from facial landmarks
"""
import math
from typing import List, Tuple, Optional, Dict, Any

import numpy as np

from app.core.constants import LANDMARK_INDICES, IDEAL_VALUES
from app.models.schemas import GeometricMeasurements


class GeometryCalculator:
    """
    Calculator for facial geometric measurements.
    Uses landmark coordinates to compute aesthetic metrics.
    """
    
    def __init__(self):
        self.landmark_indices = LANDMARK_INDICES
        self.ideal_values = IDEAL_VALUES
    
    def get_landmark(
        self, 
        landmarks: List[List[float]], 
        name: str
    ) -> Optional[Tuple[float, float, float]]:
        """
        Get a specific landmark by name
        
        Args:
            landmarks: List of all landmarks
            name: Name of the landmark (from LANDMARK_INDICES)
            
        Returns:
            (x, y, z) coordinates or None if not found
        """
        index = self.landmark_indices.get(name)
        if index is None or index >= len(landmarks):
            return None
        return tuple(landmarks[index])
    
    def distance_2d(
        self, 
        p1: Tuple[float, float, float], 
        p2: Tuple[float, float, float]
    ) -> float:
        """Calculate 2D Euclidean distance between two points"""
        return math.sqrt((p2[0] - p1[0])**2 + (p2[1] - p1[1])**2)
    
    def distance_3d(
        self, 
        p1: Tuple[float, float, float], 
        p2: Tuple[float, float, float]
    ) -> float:
        """Calculate 3D Euclidean distance between two points"""
        return math.sqrt(
            (p2[0] - p1[0])**2 + 
            (p2[1] - p1[1])**2 + 
            (p2[2] - p1[2])**2
        )
    
    def angle_between_points(
        self,
        p1: Tuple[float, float, float],
        p2: Tuple[float, float, float],
        p3: Tuple[float, float, float]
    ) -> float:
        """
        Calculate angle at p2 formed by p1-p2-p3
        
        Args:
            p1, p2, p3: Three points forming an angle
            
        Returns:
            Angle in degrees
        """
        # Vectors from p2 to p1 and p2 to p3
        v1 = np.array([p1[0] - p2[0], p1[1] - p2[1]])
        v2 = np.array([p3[0] - p2[0], p3[1] - p2[1]])
        
        # Calculate angle using dot product
        cos_angle = np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2) + 1e-6)
        cos_angle = np.clip(cos_angle, -1, 1)  # Avoid numerical errors
        
        angle_rad = np.arccos(cos_angle)
        return math.degrees(angle_rad)
    
    def calculate_canthal_tilt(self, landmarks: List[List[float]]) -> float:
        """
        Calculate Canthal Tilt (angle of eye corners)
        
        Positive tilt = outer canthus higher than inner (hunter eyes)
        Negative tilt = outer canthus lower (tired appearance)
        
        Returns:
            Canthal tilt in degrees
        """
        # Get eye corner landmarks
        left_inner = self.get_landmark(landmarks, "left_inner_canthus")
        left_outer = self.get_landmark(landmarks, "left_outer_canthus")
        right_inner = self.get_landmark(landmarks, "right_inner_canthus")
        right_outer = self.get_landmark(landmarks, "right_outer_canthus")
        
        if not all([left_inner, left_outer, right_inner, right_outer]):
            return 0.0
        
        # Calculate angle for each eye
        # Positive angle means outer corner is higher
        left_angle = math.degrees(math.atan2(
            left_inner[1] - left_outer[1],  # Y difference (inverted because Y increases downward)
            left_outer[0] - left_inner[0]   # X difference
        ))
        
        right_angle = math.degrees(math.atan2(
            right_inner[1] - right_outer[1],
            right_inner[0] - right_outer[0]
        ))
        
        # Average both eyes
        return (left_angle + right_angle) / 2
    
    def calculate_bigonial_bizygomatic_ratio(
        self, 
        landmarks: List[List[float]]
    ) -> float:
        """
        Calculate Bigonial Width / Bizygomatic Width Ratio
        
        Bigonial = jaw width at gonion points
        Bizygomatic = cheekbone width at zygion points
        
        Returns:
            Ratio (0.0 to 1.0+)
        """
        left_gonion = self.get_landmark(landmarks, "left_gonion")
        right_gonion = self.get_landmark(landmarks, "right_gonion")
        left_zygion = self.get_landmark(landmarks, "left_zygion")
        right_zygion = self.get_landmark(landmarks, "right_zygion")
        
        if not all([left_gonion, right_gonion, left_zygion, right_zygion]):
            return 0.77  # Default to average
        
        bigonial_width = self.distance_2d(left_gonion, right_gonion)
        bizygomatic_width = self.distance_2d(left_zygion, right_zygion)
        
        if bizygomatic_width == 0:
            return 0.77
        
        return bigonial_width / bizygomatic_width
    
    def calculate_midface_ratio(self, landmarks: List[List[float]]) -> float:
        """
        Calculate Midface Ratio
        
        Distance from pupil center to upper lip / total face height
        
        Returns:
            Ratio (typically 0.40 to 0.50)
        """
        # Get vertical reference points
        nasion = self.get_landmark(landmarks, "nasion")
        upper_lip = self.get_landmark(landmarks, "upper_lip")
        chin = self.get_landmark(landmarks, "chin_menton")
        forehead = self.get_landmark(landmarks, "forehead_top")
        
        # Get eye reference for pupil level
        left_inner = self.get_landmark(landmarks, "left_inner_canthus")
        left_outer = self.get_landmark(landmarks, "left_outer_canthus")
        
        if not all([nasion, upper_lip, chin, left_inner, left_outer]):
            return 0.44  # Default to ideal
        
        # Approximate pupil level (between inner and outer canthus)
        pupil_y = (left_inner[1] + left_outer[1]) / 2
        
        # Calculate distances
        pupil_to_lip = abs(upper_lip[1] - pupil_y)
        
        # Total face height (use nasion to chin as reference)
        if forehead:
            total_height = abs(chin[1] - forehead[1])
        else:
            # Estimate forehead position
            total_height = abs(chin[1] - nasion[1]) * 1.5
        
        if total_height == 0:
            return 0.44
        
        return pupil_to_lip / total_height
    
    def calculate_gonial_angle(
        self, 
        landmarks: List[List[float]],
        is_side_view: bool = False
    ) -> float:
        """
        Calculate Gonial Angle (jaw angle)
        
        The angle at the gonion between the ramus and mandible body.
        Best measured from side profile.
        
        Returns:
            Angle in degrees (typically 115-145)
        """
        if is_side_view:
            # For side view, we need different landmarks
            # This is an approximation using available landmarks
            gonion = self.get_landmark(landmarks, "left_gonion")
            chin = self.get_landmark(landmarks, "chin_menton")
            
            # Approximate ramus direction using ear position if available
            # For now, use a geometric approximation
            if gonion and chin:
                # Estimate angle based on profile shape
                # This is simplified - real measurement needs side-specific landmarks
                angle = 128.0  # Default estimate
                
                # Adjust based on relative positions
                dx = abs(chin[0] - gonion[0])
                dy = abs(chin[1] - gonion[1])
                
                if dy > 0:
                    profile_angle = math.degrees(math.atan(dx / dy))
                    angle = 130 - profile_angle  # Approximate adjustment
                
                return max(115, min(145, angle))
        
        # For front view, estimate using jaw contour angles
        left_gonion = self.get_landmark(landmarks, "left_gonion")
        right_gonion = self.get_landmark(landmarks, "right_gonion")
        chin = self.get_landmark(landmarks, "chin_menton")
        
        # Get points above gonion for ramus direction
        left_jaw_upper = self.get_landmark(landmarks, "left_jaw_1")
        right_jaw_upper = self.get_landmark(landmarks, "right_jaw_1")
        
        if not all([left_gonion, right_gonion, chin, left_jaw_upper]):
            return 128.0  # Default
        
        # Calculate angle at left gonion
        left_angle = self.angle_between_points(left_jaw_upper, left_gonion, chin)
        
        return left_angle
    
    def calculate_nasofrontal_angle(
        self, 
        landmarks: List[List[float]],
        is_side_view: bool = True
    ) -> float:
        """
        Calculate Nasofrontal Angle
        
        Angle at nasion between glabella and nose bridge.
        Best measured from side profile.
        
        Returns:
            Angle in degrees (typically 120-145)
        """
        glabella = self.get_landmark(landmarks, "glabella")
        nasion = self.get_landmark(landmarks, "nasion")
        nose_bridge = self.get_landmark(landmarks, "nose_bridge_1")
        
        if not all([glabella, nasion, nose_bridge]):
            return 132.0  # Default to ideal range
        
        angle = self.angle_between_points(glabella, nasion, nose_bridge)
        
        return angle
    
    def calculate_facial_thirds(
        self, 
        landmarks: List[List[float]]
    ) -> Tuple[float, float, float]:
        """
        Calculate Facial Thirds proportions
        
        Upper: Hairline to Glabella
        Middle: Glabella to Subnasale
        Lower: Subnasale to Menton
        
        Returns:
            Tuple of (upper, middle, lower) proportions
        """
        forehead = self.get_landmark(landmarks, "forehead_top")
        glabella = self.get_landmark(landmarks, "glabella")
        subnasale = self.get_landmark(landmarks, "subnasale")
        chin = self.get_landmark(landmarks, "chin_menton")
        
        if not all([glabella, subnasale, chin]):
            return (0.33, 0.34, 0.33)  # Default
        
        # Calculate distances
        if forehead:
            upper = abs(glabella[1] - forehead[1])
        else:
            # Estimate upper third
            upper = abs(glabella[1] - chin[1]) * 0.3
        
        middle = abs(subnasale[1] - glabella[1])
        lower = abs(chin[1] - subnasale[1])
        
        total = upper + middle + lower
        
        if total == 0:
            return (0.33, 0.34, 0.33)
        
        return (
            upper / total,
            middle / total,
            lower / total
        )
    
    def calculate_symmetry_score(self, landmarks: List[List[float]]) -> float:
        """
        Calculate facial symmetry score
        
        Compares distances of corresponding left/right landmarks from midline.
        
        Returns:
            Symmetry score (0.0 to 1.0, higher is more symmetric)
        """
        # Define pairs of left/right landmarks to compare
        pairs = [
            ("left_inner_canthus", "right_inner_canthus"),
            ("left_outer_canthus", "right_outer_canthus"),
            ("left_gonion", "right_gonion"),
            ("left_zygion", "right_zygion"),
            ("left_eyebrow_inner", "right_eyebrow_inner"),
            ("left_eyebrow_outer", "right_eyebrow_outer"),
        ]
        
        # Calculate midline x position
        nose_tip = self.get_landmark(landmarks, "nose_tip")
        chin = self.get_landmark(landmarks, "chin_menton")
        
        if not nose_tip or not chin:
            return 0.9  # Default
        
        midline_x = (nose_tip[0] + chin[0]) / 2
        
        # Calculate symmetry for each pair
        symmetry_scores = []
        
        for left_name, right_name in pairs:
            left_point = self.get_landmark(landmarks, left_name)
            right_point = self.get_landmark(landmarks, right_name)
            
            if left_point and right_point:
                # Distance from midline
                left_dist = abs(left_point[0] - midline_x)
                right_dist = abs(right_point[0] - midline_x)
                
                # Symmetry ratio (1.0 = perfect)
                if max(left_dist, right_dist) > 0:
                    ratio = min(left_dist, right_dist) / max(left_dist, right_dist)
                    symmetry_scores.append(ratio)
        
        if not symmetry_scores:
            return 0.9
        
        return sum(symmetry_scores) / len(symmetry_scores)
    
    def calculate_ipd_face_ratio(self, landmarks: List[List[float]]) -> float:
        """
        Calculate Inter-Pupillary Distance to Face Width Ratio
        
        Returns:
            Ratio (typically 0.40 to 0.48)
        """
        left_inner = self.get_landmark(landmarks, "left_inner_canthus")
        right_inner = self.get_landmark(landmarks, "right_inner_canthus")
        left_outer = self.get_landmark(landmarks, "left_outer_canthus")
        right_outer = self.get_landmark(landmarks, "right_outer_canthus")
        left_zygion = self.get_landmark(landmarks, "left_zygion")
        right_zygion = self.get_landmark(landmarks, "right_zygion")
        
        if not all([left_inner, right_inner, left_outer, right_outer, left_zygion, right_zygion]):
            return 0.44  # Default
        
        # Approximate pupil positions (center of eye)
        left_pupil_x = (left_inner[0] + left_outer[0]) / 2
        right_pupil_x = (right_inner[0] + right_outer[0]) / 2
        
        ipd = abs(right_pupil_x - left_pupil_x)
        face_width = self.distance_2d(left_zygion, right_zygion)
        
        if face_width == 0:
            return 0.44
        
        return ipd / face_width
    
    def calculate_all_measurements(
        self,
        front_landmarks: List[List[float]],
        side_landmarks: Optional[List[List[float]]] = None
    ) -> GeometricMeasurements:
        """
        Calculate all facial measurements
        
        Args:
            front_landmarks: Landmarks from front-facing image
            side_landmarks: Optional landmarks from side profile
            
        Returns:
            GeometricMeasurements with all calculated values
        """
        # Calculate measurements from front view
        canthal_tilt = self.calculate_canthal_tilt(front_landmarks)
        bigonial_ratio = self.calculate_bigonial_bizygomatic_ratio(front_landmarks)
        midface_ratio = self.calculate_midface_ratio(front_landmarks)
        facial_thirds = self.calculate_facial_thirds(front_landmarks)
        symmetry = self.calculate_symmetry_score(front_landmarks)
        ipd_ratio = self.calculate_ipd_face_ratio(front_landmarks)
        
        # Calculate angle measurements
        # Prefer side view if available
        if side_landmarks:
            gonial_angle = self.calculate_gonial_angle(side_landmarks, is_side_view=True)
            nasofrontal_angle = self.calculate_nasofrontal_angle(side_landmarks, is_side_view=True)
        else:
            gonial_angle = self.calculate_gonial_angle(front_landmarks, is_side_view=False)
            nasofrontal_angle = self.calculate_nasofrontal_angle(front_landmarks, is_side_view=False)
        
        return GeometricMeasurements(
            canthal_tilt=round(canthal_tilt, 2),
            bigonial_bizygomatic_ratio=round(bigonial_ratio, 3),
            midface_ratio=round(midface_ratio, 3),
            gonial_angle=round(gonial_angle, 1),
            nasofrontal_angle=round(nasofrontal_angle, 1),
            facial_thirds=list(round(x, 3) for x in facial_thirds),
            symmetry_score=round(symmetry, 3),
            ipd_face_ratio=round(ipd_ratio, 3)
        )
