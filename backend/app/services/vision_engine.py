"""
Vision Engine - MediaPipe Face Mesh Extraction
Processes images and extracts 468 facial landmarks
"""
import base64
import io
from typing import Optional, Tuple, List

import cv2
import numpy as np
import mediapipe as mp
from PIL import Image

from app.models.schemas import LandmarkData


class VisionEngine:
    """
    Vision engine for facial landmark detection using MediaPipe Face Mesh.
    Extracts 468 landmark points from facial images.
    """
    
    def __init__(self):
        """Initialize MediaPipe Face Mesh"""
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            static_image_mode=True,
            max_num_faces=1,
            refine_landmarks=True,  # Includes iris landmarks
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
    
    def decode_base64_image(self, base64_string: str) -> np.ndarray:
        """
        Decode base64 image string to numpy array
        
        Args:
            base64_string: Base64 encoded image (with or without data URL prefix)
            
        Returns:
            Numpy array of the image in RGB format
        """
        # Remove data URL prefix if present
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
        
        # Decode base64
        image_bytes = base64.b64decode(base64_string)
        
        # Convert to PIL Image
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Convert to numpy array
        return np.array(image)
    
    def process_image(self, image: np.ndarray) -> Optional[List[List[float]]]:
        """
        Process a single image and extract facial landmarks
        
        Args:
            image: Numpy array of the image in RGB format
            
        Returns:
            List of 478 landmarks (468 face + 10 iris), each as [x, y, z]
            Returns None if no face detected
        """
        # Process the image
        results = self.face_mesh.process(image)
        
        # Check if face was detected
        if not results.multi_face_landmarks:
            return None
        
        # Get the first face's landmarks
        face_landmarks = results.multi_face_landmarks[0]
        
        # Extract normalized coordinates
        landmarks = []
        for landmark in face_landmarks.landmark:
            landmarks.append([
                landmark.x,  # Normalized x (0-1)
                landmark.y,  # Normalized y (0-1)
                landmark.z   # Normalized z (depth)
            ])
        
        return landmarks
    
    def extract_landmarks_from_base64(
        self,
        front_image_base64: str,
        side_image_base64: Optional[str] = None
    ) -> LandmarkData:
        """
        Extract landmarks from base64 encoded images
        
        Args:
            front_image_base64: Base64 encoded front-facing image
            side_image_base64: Optional base64 encoded side profile image
            
        Returns:
            LandmarkData containing extracted landmarks
        """
        # Process front image
        front_image = self.decode_base64_image(front_image_base64)
        front_landmarks = self.process_image(front_image)
        
        if front_landmarks is None:
            return LandmarkData(
                front_landmarks=[],
                side_landmarks=None,
                face_detected=False,
                confidence=0.0
            )
        
        # Process side image if provided
        side_landmarks = None
        if side_image_base64:
            side_image = self.decode_base64_image(side_image_base64)
            side_landmarks = self.process_image(side_image)
        
        return LandmarkData(
            front_landmarks=front_landmarks,
            side_landmarks=side_landmarks,
            face_detected=True,
            confidence=self._calculate_confidence(front_landmarks)
        )
    
    def _calculate_confidence(self, landmarks: List[List[float]]) -> float:
        """
        Calculate detection confidence based on landmark visibility
        
        Args:
            landmarks: List of landmark coordinates
            
        Returns:
            Confidence score between 0 and 1
        """
        if not landmarks:
            return 0.0
        
        # Check for reasonable coordinate ranges
        valid_count = 0
        for x, y, z in landmarks:
            if 0 <= x <= 1 and 0 <= y <= 1:
                valid_count += 1
        
        return valid_count / len(landmarks)
    
    def get_landmark_pixel_coords(
        self,
        landmarks: List[List[float]],
        image_width: int,
        image_height: int
    ) -> List[Tuple[int, int]]:
        """
        Convert normalized landmarks to pixel coordinates
        
        Args:
            landmarks: Normalized landmark coordinates
            image_width: Width of the original image
            image_height: Height of the original image
            
        Returns:
            List of (x, y) pixel coordinates
        """
        return [
            (int(x * image_width), int(y * image_height))
            for x, y, z in landmarks
        ]
    
    def visualize_landmarks(
        self,
        image: np.ndarray,
        landmarks: List[List[float]],
        draw_mesh: bool = False
    ) -> np.ndarray:
        """
        Draw landmarks on an image for visualization
        
        Args:
            image: Original image
            landmarks: Landmark coordinates
            draw_mesh: Whether to draw the face mesh connections
            
        Returns:
            Image with landmarks drawn
        """
        output_image = image.copy()
        h, w = image.shape[:2]
        
        # Draw landmarks as points
        for x, y, z in landmarks:
            cx, cy = int(x * w), int(y * h)
            cv2.circle(output_image, (cx, cy), 1, (0, 255, 0), -1)
        
        if draw_mesh:
            # Draw face mesh connections
            mp_drawing = mp.solutions.drawing_utils
            mp_drawing_styles = mp.solutions.drawing_styles
            
            # This requires the original MediaPipe results object
            # For now, just draw the points
            pass
        
        return output_image
    
    def __del__(self):
        """Cleanup MediaPipe resources"""
        if hasattr(self, 'face_mesh'):
            self.face_mesh.close()
