# 🧬 Project Adam - AI Face Aesthetics Scorer

<div align="center">

![Project Adam](https://img.shields.io/badge/Project-Adam-blueviolet?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.11+-blue?style=for-the-badge&logo=python)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi)

**AI-powered facial aesthetics analysis using MediaPipe and advanced LLMs**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [API](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## ✨ Features

- 📸 **Dual Image Analysis** - Analyze both front-facing and side profile images
- 🔬 **468 Landmark Detection** - Precise facial mapping using Google MediaPipe
- 📐 **Scientific Measurements** - Calculate canthal tilt, gonial angle, midface ratio, and more
- 🤖 **AI-Powered Analysis** - Claude/Gemini provides detailed aesthetic assessments
- 📊 **Visual Results** - Radar charts and score breakdowns
- 🎯 **PSL Classification** - Tier system from "Sub 3" to "Adam"

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + Shadcn/UI
- **Camera**: React Webcam
- **Charts**: Recharts
- **Animations**: Framer Motion

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Computer Vision**: MediaPipe Face Mesh
- **Math**: NumPy, OpenCV
- **LLM**: LangChain + Anthropic/Google SDKs

### Infrastructure
- **Backend Hosting**: Google Cloud Run
- **Frontend Hosting**: Vercel
- **Containerization**: Docker

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Docker (optional)

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env with your API keys

# Run server
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

### Using Docker

```bash
# Build and run all services
docker-compose up --build
```

---

## 📚 API Documentation

### Analyze Endpoint

```http
POST /api/v1/analyze
Content-Type: application/json

{
  "front_image": "data:image/jpeg;base64,...",
  "side_image": "data:image/jpeg;base64,..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "score": 7.5,
    "tier": "Chadlite",
    "analysis": "Detailed facial analysis...",
    "strengths": ["Positive canthal tilt", "Strong jawline"],
    "weaknesses": ["Slightly long midface"],
    "advice": "Recommendations...",
    "radar_data": {
      "eyes": 8.5,
      "jaw": 7.5,
      "midface": 6.8,
      "symmetry": 8.2,
      "harmony": 7.8
    },
    "measurements": { ... }
  }
}
```

For full API documentation, run the backend and visit: `http://localhost:8000/docs`

---

## 📊 Measurement Reference

| Metric | Ideal Range | Description |
|--------|-------------|-------------|
| Canthal Tilt | +4° to +8° | Eye corner angle (hunter eyes) |
| Bigonial/Bizygomatic | 75-80% | Jaw to cheekbone ratio |
| Gonial Angle | 125-130° | Jaw angle strength |
| Midface Ratio | 43-44% | Golden ratio zone |
| Nasofrontal Angle | 130-135° | Forehead-nose profile |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ⚠️ Disclaimer

This tool is for educational and entertainment purposes only. Facial aesthetics are subjective and vary across cultures. The scores and analyses provided should not be taken as medical advice or absolute truth.

---

<div align="center">

**Made with ❤️ by the Project Adam Team**

</div>
