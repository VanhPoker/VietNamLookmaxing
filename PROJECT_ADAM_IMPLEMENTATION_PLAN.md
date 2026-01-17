# 🧬 Project Adam - AI Face Aesthetics Scorer
## Implementation Plan & Technical Documentation

---

## 📋 Mục lục

1. [Tổng quan dự án](#1-tổng-quan-dự-án)
2. [Tech Stack](#2-tech-stack)
3. [Kiến trúc hệ thống](#3-kiến-trúc-hệ-thống)
4. [Data Flow](#4-data-flow)
5. [Cấu trúc thư mục](#5-cấu-trúc-thư-mục)
6. [Chi tiết Implementation](#6-chi-tiết-implementation)
7. [API Design](#7-api-design)
8. [Deployment Strategy](#8-deployment-strategy)
9. [Roadmap](#9-roadmap)

---

## 1. Tổng quan dự án

**Project Adam** là một ứng dụng AI phân tích thẩm mỹ khuôn mặt dựa trên các nguyên tắc khoa học về tỷ lệ vàng và các tiêu chuẩn thẩm mỹ hiện đại (Orthotropics/PSL).

### Tính năng chính:
- 📸 Chụp/Upload ảnh chính diện và ảnh nghiêng
- 🔬 Phân tích 468 facial landmarks bằng MediaPipe
- 📐 Tính toán các chỉ số thẩm mỹ quan trọng
- 🤖 AI đánh giá và phân loại khuôn mặt theo thang đo "Sub 3 → Adam"
- 📊 Hiển thị kết quả dạng radar chart với lời khuyên chi tiết

---

## 2. Tech Stack

### 2.1 Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js 14** | React Framework với App Router | ^14.0.0 |
| **TypeScript** | Type Safety | ^5.0.0 |
| **Tailwind CSS** | Utility-first CSS | ^3.4.0 |
| **Shadcn/UI** | UI Component Library | latest |
| **React Webcam** | Camera Capture | ^7.0.0 |
| **Recharts** | Data Visualization (Radar Chart) | ^2.8.0 |
| **Framer Motion** | Animations | ^10.16.0 |

### 2.2 Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| **Python** | Core Language | ^3.11 |
| **FastAPI** | Web Framework | ^0.104.0 |
| **Uvicorn** | ASGI Server | ^0.24.0 |
| **MediaPipe** | Face Mesh Detection | ^0.10.0 |
| **NumPy** | Numerical Computation | ^1.24.0 |
| **OpenCV** | Image Processing | ^4.8.0 |
| **Pillow** | Image Manipulation | ^10.0.0 |

### 2.3 AI/LLM Integration
| Technology | Purpose |
|------------|---------|
| **LangChain** | LLM Orchestration |
| **Anthropic SDK** | Claude 3 Opus API |
| **Google Generative AI** | Gemini 1.5 Pro API |

### 2.4 Infrastructure
| Service | Purpose |
|---------|---------|
| **Google Cloud Run** | Containerized Backend Deployment |
| **Vercel** | Frontend Hosting |
| **Google Cloud Storage** | Temporary Image Storage |
| **Docker** | Containerization |

---

## 3. Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (Browser)                                │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         Next.js Frontend                               │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │   Camera    │  │   Upload    │  │   Result    │  │   Radar     │  │  │
│  │  │   Capture   │  │   Zone      │  │   Card      │  │   Chart     │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ HTTPS (REST API)
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        BACKEND (Google Cloud Run)                            │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         FastAPI Application                            │  │
│  │                                                                        │  │
│  │  ┌─────────────────┐         ┌─────────────────┐                      │  │
│  │  │   main.py       │─────────│   schemas.py    │                      │  │
│  │  │   (Endpoints)   │         │   (Pydantic)    │                      │  │
│  │  └────────┬────────┘         └─────────────────┘                      │  │
│  │           │                                                            │  │
│  │           ▼                                                            │  │
│  │  ┌─────────────────────────────────────────────────────────────┐      │  │
│  │  │                      SERVICES LAYER                          │      │  │
│  │  │                                                              │      │  │
│  │  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐   │      │  │
│  │  │  │ vision_engine │  │ geometry_calc │  │ llm_analyzer  │   │      │  │
│  │  │  │  (MediaPipe)  │──│   (NumPy)     │──│   (LangChain) │   │      │  │
│  │  │  └───────────────┘  └───────────────┘  └───────────────┘   │      │  │
│  │  │         │                    │                  │           │      │  │
│  │  │         ▼                    ▼                  ▼           │      │  │
│  │  │  468 Landmarks   →   Geometric Ratios   →   AI Analysis    │      │  │
│  │  └─────────────────────────────────────────────────────────────┘      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ API Calls
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           LLM PROVIDERS                                      │
│  ┌─────────────────────────┐    ┌─────────────────────────────┐            │
│  │   Claude 3 Opus         │    │   Gemini 1.5 Pro            │            │
│  │   (Anthropic)           │    │   (Google)                  │            │
│  └─────────────────────────┘    └─────────────────────────────┘            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Data Flow

### 4.1 User Journey Flow

```
┌─────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  START  │────▶│  Chụp ảnh   │────▶│  Chụp ảnh   │────▶│  Đợi xử lý  │
│         │     │  chính diện │     │  nghiêng    │     │  (Loading)  │
└─────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                               │
     ┌─────────────────────────────────────────────────────────┘
     ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Hiển thị   │────▶│  Chi tiết   │────▶│  Chia sẻ/   │
│  Kết quả    │     │  Analysis   │     │  Lưu kết quả│
└─────────────┘     └─────────────┘     └─────────────┘
```

### 4.2 Technical Data Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ STEP 1: Image Capture                                                         │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   [User Camera] ──▶ [Front Image (Base64)] ──▶ [Side Image (Base64)]        │
│                                                                               │
│   Output: { frontImage: string, sideImage: string }                          │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ STEP 2: Vision Engine Processing (MediaPipe)                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   Input: Raw Images                                                          │
│                                                                               │
│   Processing:                                                                │
│   ├── Face Detection                                                         │
│   ├── Face Mesh (468 landmarks)                                              │
│   └── Normalize coordinates                                                  │
│                                                                               │
│   Output: {                                                                  │
│     front_landmarks: [[x, y, z], ...],  // 468 points                       │
│     side_landmarks: [[x, y, z], ...],   // 468 points                       │
│     face_detected: true                                                      │
│   }                                                                          │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ STEP 3: Geometry Calculation                                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   Input: 468 Landmarks (front + side)                                        │
│                                                                               │
│   Calculations:                                                              │
│   ├── Canthal Tilt (Góc khóe mắt)                                           │
│   │   └── angle = atan2(outer_canthus.y - inner_canthus.y,                  │
│   │                     outer_canthus.x - inner_canthus.x)                   │
│   │                                                                          │
│   ├── Bigonial/Bizygomatic Ratio (Hàm/Gò má)                                │
│   │   └── ratio = bigonial_width / bizygomatic_width                        │
│   │                                                                          │
│   ├── Midface Ratio (Tỷ lệ mặt giữa)                                        │
│   │   └── ratio = pupil_to_lip / total_face_height                          │
│   │                                                                          │
│   ├── Gonial Angle (Góc hàm - từ ảnh nghiêng)                               │
│   │   └── angle between ramus and mandible body                             │
│   │                                                                          │
│   └── Nasofrontal Angle (Góc trán-mũi - từ ảnh nghiêng)                     │
│       └── angle at glabella point                                            │
│                                                                               │
│   Output: {                                                                  │
│     canthal_tilt: -2.5,           // degrees                                │
│     bigonial_bizygomatic_ratio: 0.78,                                       │
│     midface_ratio: 0.42,                                                    │
│     gonial_angle: 128.5,          // degrees                                │
│     nasofrontal_angle: 132.0,     // degrees                                │
│     facial_thirds: [0.33, 0.34, 0.33],                                      │
│     symmetry_score: 0.92                                                    │
│   }                                                                          │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ STEP 4: LLM Analysis                                                          │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   Input: Geometric measurements JSON                                         │
│                                                                               │
│   System Prompt (Expert Persona):                                            │
│   "You are a world-renowned aesthetic medicine expert specialized in         │
│    Orthotropics and facial development analysis. You evaluate faces          │
│    based on the PSL (Pretty Slay Looksmax) scale..."                         │
│                                                                               │
│   Analysis Criteria:                                                         │
│   ├── Canthal Tilt: Positive (+3°~+8°) = attractive                         │
│   ├── Bigonial Ratio: 75-80% optimal for masculine jaw                      │
│   ├── Gonial Angle: 125-130° ideal                                          │
│   ├── Midface: 43-44% golden ratio                                          │
│   └── Nasofrontal: 130-135° aesthetically pleasing                          │
│                                                                               │
│   Output: {                                                                  │
│     score: 7.5,                   // 1-10 scale                             │
│     tier: "Chadlite",             // Sub3 → Normie → HTN → Chadlite → Adam  │
│     analysis: "Detailed breakdown...",                                       │
│     strengths: ["Strong jaw", "Positive canthal tilt"],                     │
│     weaknesses: ["Slightly long midface"],                                  │
│     advice: "Consider mewing exercises...",                                 │
│     radar_data: {                                                           │
│       eyes: 8.0,                                                            │
│       jaw: 7.5,                                                             │
│       midface: 6.5,                                                         │
│       symmetry: 9.0,                                                        │
│       harmony: 7.0                                                          │
│     }                                                                        │
│   }                                                                          │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Cấu trúc thư mục

```
project-adam/
│
├── 📁 backend/                          # Python FastAPI Backend
│   │
│   ├── 📁 app/
│   │   │
│   │   ├── 📁 core/                     # Core configurations
│   │   │   ├── __init__.py
│   │   │   ├── config.py                # Environment variables, API keys
│   │   │   ├── prompts.py               # LLM system prompts
│   │   │   └── constants.py             # Facial landmark indices, thresholds
│   │   │
│   │   ├── 📁 models/                   # Pydantic schemas
│   │   │   ├── __init__.py
│   │   │   └── schemas.py               # Request/Response models
│   │   │
│   │   ├── 📁 services/                 # Business logic
│   │   │   ├── __init__.py
│   │   │   ├── vision_engine.py         # MediaPipe face mesh extraction
│   │   │   ├── geometry_calc.py         # Facial measurements calculation
│   │   │   └── llm_analyzer.py          # LLM integration (Claude/Gemini)
│   │   │
│   │   ├── 📁 api/                      # API routes
│   │   │   ├── __init__.py
│   │   │   ├── routes.py                # Endpoint definitions
│   │   │   └── deps.py                  # Dependencies (auth, etc.)
│   │   │
│   │   └── main.py                      # FastAPI app entry point
│   │
│   ├── 📁 tests/                        # Unit tests
│   │   ├── __init__.py
│   │   ├── test_vision.py
│   │   ├── test_geometry.py
│   │   └── test_api.py
│   │
│   ├── Dockerfile                       # Container configuration
│   ├── requirements.txt                 # Python dependencies
│   ├── .env.example                     # Environment variables template
│   └── README.md
│
├── 📁 frontend/                         # Next.js Frontend
│   │
│   ├── 📁 app/                          # Next.js App Router
│   │   ├── layout.tsx                   # Root layout
│   │   ├── page.tsx                     # Home page
│   │   ├── globals.css                  # Global styles
│   │   ├── 📁 analyze/
│   │   │   └── page.tsx                 # Analysis page (camera capture)
│   │   └── 📁 results/
│   │       └── page.tsx                 # Results display page
│   │
│   ├── 📁 components/                   # React components
│   │   ├── 📁 ui/                       # Shadcn UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   │
│   │   ├── 📁 camera/
│   │   │   ├── CameraCapture.tsx        # Main camera component
│   │   │   ├── FaceOverlay.tsx          # SVG face guide overlay
│   │   │   └── CaptureButton.tsx
│   │   │
│   │   ├── 📁 results/
│   │   │   ├── ResultCard.tsx           # Score display card
│   │   │   ├── RadarChart.tsx           # Facial metrics radar chart
│   │   │   ├── AnalysisDetails.tsx      # Detailed breakdown
│   │   │   └── AdviceSection.tsx        # Improvement suggestions
│   │   │
│   │   ├── 📁 upload/
│   │   │   ├── UploadZone.tsx           # Drag & drop upload
│   │   │   └── ImagePreview.tsx
│   │   │
│   │   └── 📁 shared/
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── LoadingSpinner.tsx
│   │
│   ├── 📁 lib/                          # Utilities
│   │   ├── api.ts                       # API client
│   │   ├── utils.ts                     # Helper functions
│   │   └── types.ts                     # TypeScript types
│   │
│   ├── 📁 hooks/                        # Custom React hooks
│   │   ├── useCamera.ts
│   │   └── useAnalysis.ts
│   │
│   ├── 📁 public/                       # Static assets
│   │   ├── 📁 images/
│   │   │   ├── face-overlay-front.svg
│   │   │   └── face-overlay-side.svg
│   │   └── favicon.ico
│   │
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── README.md
│
├── 📁 docs/                             # Documentation
│   ├── aesthetic_rules.md               # PSL/Orthotropics guidelines
│   ├── facial_landmarks_map.md          # MediaPipe landmark reference
│   ├── api_documentation.md
│   └── deployment_guide.md
│
├── 📁 scripts/                          # Utility scripts
│   ├── setup_dev.sh                     # Dev environment setup
│   └── deploy.sh                        # Deployment automation
│
├── docker-compose.yml                   # Local development setup
├── .gitignore
└── README.md                            # Project overview
```

---

## 6. Chi tiết Implementation

### Phase 1: Core Vision Engine (Ưu tiên cao nhất)

#### 6.1.1 `vision_engine.py` - MediaPipe Integration

```python
# Mục tiêu: Extract 468 facial landmarks từ ảnh

Key Functions:
├── initialize_face_mesh()
│   └── Setup MediaPipe Face Mesh với optimal settings
│
├── process_image(image_bytes: bytes) -> dict
│   ├── Decode base64/bytes to numpy array
│   ├── Convert BGR to RGB
│   ├── Run face mesh detection
│   └── Return normalized landmarks
│
├── extract_landmarks(results) -> List[List[float]]
│   ├── Extract 468 points
│   ├── Normalize to 0-1 range
│   └── Handle missing landmarks gracefully
│
└── validate_face_quality(landmarks) -> dict
    ├── Check face orientation
    ├── Verify landmark confidence
    └── Return quality score
```

#### 6.1.2 `geometry_calc.py` - Facial Measurements

```python
# Mục tiêu: Tính toán các chỉ số thẩm mỹ từ landmarks

Key Landmark Indices (MediaPipe):
├── Inner Canthus (Left): 133
├── Outer Canthus (Left): 33
├── Inner Canthus (Right): 362
├── Outer Canthus (Right): 263
├── Gonion (Left): 172
├── Gonion (Right): 397
├── Zygion (Left): 93
├── Zygion (Right): 323
├── Nasion: 168
├── Glabella: 9
├── Lip Center: 0
└── Chin: 152

Key Functions:
├── calculate_canthal_tilt(landmarks) -> float
│   └── angle = degrees(atan2(Δy, Δx))
│
├── calculate_bigonial_bizygomatic_ratio(landmarks) -> float
│   └── ratio = distance(gonion_L, gonion_R) / distance(zygion_L, zygion_R)
│
├── calculate_midface_ratio(landmarks) -> float
│   └── ratio = pupil_to_lip / face_height
│
├── calculate_gonial_angle(side_landmarks) -> float
│   └── 3-point angle calculation at gonion
│
├── calculate_nasofrontal_angle(side_landmarks) -> float
│   └── angle at nasion between forehead and nose bridge
│
├── calculate_facial_thirds(landmarks) -> List[float]
│   └── [upper, middle, lower] proportions
│
├── calculate_symmetry(landmarks) -> float
│   └── Compare left vs right side distances
│
└── get_all_measurements(front_landmarks, side_landmarks) -> dict
    └── Aggregate all calculations
```

### Phase 2: LLM Analyzer

#### 6.2.1 `prompts.py` - System Prompt Design

```python
AESTHETIC_EXPERT_PROMPT = """
You are Dr. Adam, a world-renowned aesthetic medicine expert...

CLASSIFICATION TIERS:
- Sub 3 (1-2.9): Severe facial underdevelopment
- Sub 5 (3-4.9): Below average, notable failos
- Normie (5-5.9): Average, unremarkable
- HTN (6-6.9): High-tier Normie, some good features
- Chadlite (7-7.9): Attractive, mostly positive features
- Chad (8-8.9): Very attractive, minimal failos
- Adam (9-10): Near-perfect facial harmony

IDEAL MEASUREMENTS:
- Canthal Tilt: +4° to +8° (hunter eyes)
- Bigonial/Bizygomatic: 75-80% (defined jaw)
- Gonial Angle: 125-130° (strong jaw)
- Midface Ratio: 43-44% (golden ratio)
- Nasofrontal: 130-135° (aesthetic nose)

Analyze with extreme precision and brutal honesty...
"""
```

#### 6.2.2 `llm_analyzer.py` - LLM Integration

```python
Key Functions:
├── initialize_llm_client(provider: str)
│   ├── "claude" -> Anthropic client
│   └── "gemini" -> Google GenerativeAI client
│
├── construct_analysis_prompt(measurements: dict) -> str
│   └── Format measurements into structured prompt
│
├── analyze_face(measurements: dict) -> AnalysisResult
│   ├── Build prompt with measurements
│   ├── Send to LLM
│   ├── Parse structured response
│   └── Return typed result
│
└── generate_radar_data(analysis: str) -> dict
    └── Extract numerical scores for visualization
```

### Phase 3: API Layer

#### 6.3.1 `schemas.py` - Pydantic Models

```python
class ImageInput(BaseModel):
    front_image: str  # Base64 encoded
    side_image: str   # Base64 encoded

class GeometricMeasurements(BaseModel):
    canthal_tilt: float
    bigonial_bizygomatic_ratio: float
    midface_ratio: float
    gonial_angle: float
    nasofrontal_angle: float
    facial_thirds: List[float]
    symmetry_score: float

class RadarData(BaseModel):
    eyes: float
    jaw: float
    midface: float
    symmetry: float
    harmony: float

class AnalysisResult(BaseModel):
    score: float
    tier: str
    analysis: str
    strengths: List[str]
    weaknesses: List[str]
    advice: str
    radar_data: RadarData
    measurements: GeometricMeasurements
```

#### 6.3.2 `main.py` - FastAPI Endpoints

```python
Endpoints:
├── POST /api/v1/analyze
│   ├── Input: ImageInput
│   ├── Process: vision_engine -> geometry_calc -> llm_analyzer
│   └── Output: AnalysisResult
│
├── POST /api/v1/analyze/quick
│   ├── Input: ImageInput (front only)
│   └── Output: QuickAnalysisResult (limited metrics)
│
├── GET /api/v1/health
│   └── Health check endpoint
│
└── GET /api/v1/landmarks-info
    └── Return landmark map documentation
```

### Phase 4: Frontend Components

#### 6.4.1 `CameraCapture.tsx`

```typescript
Features:
├── Two-step capture process
│   ├── Step 1: Front face with overlay guide
│   └── Step 2: Side profile with overlay guide
│
├── Face Overlay (SVG)
│   ├── Semi-transparent face outline
│   ├── Position guides (center crosshair)
│   └── Distance indicator
│
├── Camera Controls
│   ├── Switch camera (front/back)
│   ├── Capture button with countdown
│   └── Retake option
│
└── State Management
    ├── captureStep: 'front' | 'side' | 'complete'
    ├── frontImage: string | null
    └── sideImage: string | null
```

#### 6.4.2 `ResultCard.tsx`

```typescript
Features:
├── Score Display
│   ├── Large numerical score (animated counter)
│   ├── Tier badge with color coding
│   └── Comparison percentile
│
├── Radar Chart Integration
│   ├── 5-axis chart (eyes, jaw, midface, symmetry, harmony)
│   └── Animated reveal
│
├── Detailed Breakdown
│   ├── Strengths list (green checkmarks)
│   ├── Weaknesses list (improvement areas)
│   └── Expert analysis text
│
└── Action Buttons
    ├── Share result
    ├── Save to device
    └── Analyze again
```

---

## 7. API Design

### 7.1 Main Analysis Endpoint

```
POST /api/v1/analyze

Request:
{
  "front_image": "data:image/jpeg;base64,/9j/4AAQ...",
  "side_image": "data:image/jpeg;base64,/9j/4AAQ..."
}

Response (200 OK):
{
  "success": true,
  "data": {
    "score": 7.8,
    "tier": "Chadlite",
    "analysis": "Your facial structure demonstrates several positive aesthetic qualities...",
    "strengths": [
      "Positive canthal tilt (+5°) creating hunter eye appearance",
      "Well-defined gonial angle (127°)"
    ],
    "weaknesses": [
      "Slightly elongated midface ratio (46%)"
    ],
    "advice": "To further enhance your appearance, consider...",
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
      "midface_ratio": 0.46,
      "gonial_angle": 127.3,
      "nasofrontal_angle": 132.5,
      "facial_thirds": [0.32, 0.35, 0.33],
      "symmetry_score": 0.92
    }
  },
  "timestamp": "2026-01-14T22:30:00Z"
}

Response (400 - Bad Request):
{
  "success": false,
  "error": {
    "code": "FACE_NOT_DETECTED",
    "message": "Could not detect a face in the front image. Please ensure your face is clearly visible."
  }
}
```

---

## 8. Deployment Strategy

### 8.1 Local Development

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - GOOGLE_API_KEY=${GOOGLE_API_KEY}
    volumes:
      - ./backend:/app
    command: uvicorn app.main:app --reload --host 0.0.0.0

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    volumes:
      - ./frontend:/app
      - /app/node_modules
```

### 8.2 Production (Google Cloud)

```
┌─────────────────────────────────────────────────────────────────┐
│                    Google Cloud Platform                         │
│                                                                  │
│  ┌────────────────┐         ┌────────────────────────────────┐  │
│  │    Vercel      │         │      Google Cloud Run          │  │
│  │   (Frontend)   │────────▶│        (Backend)               │  │
│  │   Next.js      │         │       FastAPI + MediaPipe      │  │
│  └────────────────┘         └─────────────┬──────────────────┘  │
│                                           │                      │
│                                           ▼                      │
│                             ┌────────────────────────────────┐  │
│                             │   Cloud Storage (Temp Images)  │  │
│                             └────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Roadmap

### ✅ Phase 1: MVP (Week 1-2)
- [ ] Backend: vision_engine.py + geometry_calc.py
- [ ] Backend: Basic LLM integration
- [ ] Backend: FastAPI endpoints
- [ ] Frontend: Camera capture component
- [ ] Frontend: Basic result display

### 🔄 Phase 2: Enhancement (Week 3-4)
- [ ] Frontend: Radar chart visualization
- [ ] Frontend: Premium UI/UX polish
- [ ] Backend: Improve accuracy with more metrics
- [ ] Backend: Add caching layer

### 📅 Phase 3: Production (Week 5-6)
- [ ] Dockerize application
- [ ] Deploy to Cloud Run
- [ ] Performance optimization
- [ ] Error handling & monitoring

### 🚀 Phase 4: Advanced Features (Future)
- [ ] Historical analysis comparison
- [ ] Before/After simulation
- [ ] Mobile app (React Native)
- [ ] Multi-language support

---

## 📝 Ghi chú Implementation

### Critical Landmark Indices

| Landmark | MediaPipe Index | Purpose |
|----------|-----------------|---------|
| Left Inner Canthus | 133 | Canthal tilt calculation |
| Left Outer Canthus | 33 | Canthal tilt calculation |
| Right Inner Canthus | 362 | Canthal tilt calculation |
| Right Outer Canthus | 263 | Canthal tilt calculation |
| Left Gonion | 172 | Jaw width, gonial angle |
| Right Gonion | 397 | Jaw width, gonial angle |
| Left Zygion | 93 | Cheekbone width |
| Right Zygion | 323 | Cheekbone width |
| Nasion | 168 | Face height reference |
| Chin (Menton) | 152 | Face height reference |
| Upper Lip | 0 | Midface ratio |

### Ideal Aesthetic Values

| Metric | Ideal Range | Notes |
|--------|-------------|-------|
| Canthal Tilt | +4° to +8° | Positive = attractive "hunter eyes" |
| Bigonial/Bizygomatic | 75-80% | Lower = more tapered face |
| Gonial Angle | 125-130° | Lower = stronger jaw |
| Midface Ratio | 43-44% | Golden ratio zone |
| Nasofrontal Angle | 130-135° | For masculine aesthetics |

---

*Document Version: 1.0*  
*Last Updated: 2026-01-14*  
*Author: AI Implementation Planner*
