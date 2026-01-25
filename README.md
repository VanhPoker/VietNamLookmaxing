# 🧬 Project Adam - AI Face Aesthetics Scorer

<div align="center">

![Project Adam](https://img.shields.io/badge/Project-Adam-blueviolet?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.11+-blue?style=for-the-badge&logo=python)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi)

**AI-powered facial aesthetics analysis using MediaPipe and advanced LLMs**

[Tính năng](#-tính-năng) • [Tech Stack](#-tech-stack) • [Cài đặt](#-cài-đặt-local) • [API](#-api-documentation) • [Đóng góp](#-đóng-góp)

</div>

---

## ✨ Tính năng

- 📸 **Phân tích 2 góc chụp** - Phân tích cả ảnh chính diện và góc nghiêng
- 🔬 **468 điểm landmark** - Nhận diện chính xác khuôn mặt bằng Google MediaPipe
- 📐 **Đo lường khoa học** - Tính toán canthal tilt, gonial angle, midface ratio, và nhiều hơn nữa
- 🤖 **Phân tích bằng AI** - Claude/Gemini cung cấp đánh giá thẩm mỹ chi tiết
- 📊 **Kết quả trực quan** - Biểu đồ radar và phân tích điểm số
- 🎯 **Phân loại PSL** - Hệ thống tier từ "Sub 3" đến "Adam"

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16 với App Router
- **Styling**: Tailwind CSS 4 + Shadcn/UI
- **Camera**: React Webcam
- **Charts**: Recharts
- **Animations**: Framer Motion

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Computer Vision**: MediaPipe Face Mesh
- **Math**: NumPy, OpenCV
- **LLM**: Anthropic Claude / Google Gemini

### Infrastructure
- **Backend Hosting**: Google Cloud Run / Railway
- **Frontend Hosting**: Vercel
- **Containerization**: Docker

---

## � Cấu trúc thư mục

```
VietNamLookmaxing/
├── backend/                 # FastAPI Backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Config, constants
│   │   ├── models/         # Pydantic models
│   │   └── services/       # Business logic
│   ├── tests/              # Unit tests
│   ├── .env.example        # Environment template
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile
│
├── frontend/               # Next.js Frontend
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # React components
│   │   └── lib/           # Utilities
│   ├── public/            # Static assets
│   ├── .env.example       # Environment template
│   └── package.json
│
├── docs/                   # Documentation
├── docker-compose.yml      # Docker orchestration
└── README.md
```

---

## 🚀 Cài đặt Local

### 📋 Yêu cầu hệ thống

| Công cụ | Phiên bản | Kiểm tra | Link tải |
|---------|-----------|----------|----------|
| **Python** | 3.11+ | `python --version` | [python.org](https://python.org) |
| **Node.js** | 18+ | `node --version` | [nodejs.org](https://nodejs.org) |
| **Git** | Any | `git --version` | [git-scm.com](https://git-scm.com) |
| **Docker** *(optional)* | Latest | `docker --version` | [docker.com](https://docker.com) |

### 🔑 API Keys (Bắt buộc)

Bạn cần **ít nhất 1** trong 2 API key sau:

| Provider | Link lấy key | Ghi chú |
|----------|-------------|---------|
| **Google AI (Gemini)** | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) | ✅ Khuyến nghị - Free tier có sẵn |
| **Anthropic (Claude)** | [console.anthropic.com](https://console.anthropic.com/) | Chất lượng cao hơn, tốn phí |

---

### 🔧 Cách 1: Cài đặt thủ công

#### Bước 1: Clone repository

```bash
git clone https://github.com/your-username/VietNamLookmaxing.git
cd VietNamLookmaxing
```

#### Bước 2: Cài đặt Backend

```powershell
# Di chuyển vào thư mục backend
cd backend

# Tạo virtual environment
python -m venv venv

# Kích hoạt virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1

# Windows (CMD):
venv\Scripts\activate.bat

# Linux/macOS:
source venv/bin/activate

# Cài đặt dependencies
pip install -r requirements.txt

# Copy file environment
copy .env.example .env
# Hoặc trên Linux/macOS:
cp .env.example .env
```

#### Bước 3: Cấu hình Backend Environment

Mở file `backend/.env` và điền API key của bạn:

```env
# REQUIRED: Điền ít nhất 1 API key
GOOGLE_API_KEY=your_google_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Chọn provider: "gemini" hoặc "claude"
LLM_PROVIDER=gemini

# Model Gemini (khuyến nghị gemini-1.5-pro)
GEMINI_MODEL=gemini-1.5-pro
```

#### Bước 4: Chạy Backend

```bash
# Đảm bảo đang ở thư mục backend và venv đã được kích hoạt
uvicorn app.main:app --reload

# Backend sẽ chạy tại: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

#### Bước 5: Cài đặt Frontend (Terminal mới)

Mở **terminal mới** và chạy:

```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Copy file environment
copy .env.example .env.local
# Hoặc trên Linux/macOS:
cp .env.example .env.local
```

#### Bước 6: Cấu hình Frontend Environment

File `frontend/.env.local` mặc định đã được cấu hình cho local development:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Bước 7: Chạy Frontend

```bash
# Chạy development server
npm run dev

# Frontend sẽ chạy tại: http://localhost:3000
```

#### ✅ Xác nhận cài đặt thành công

1. Mở browser tại: **http://localhost:3000**
2. Backend health check: **http://localhost:8000/api/v1/health**
3. API Docs: **http://localhost:8000/docs**

---

### 🐳 Cách 2: Sử dụng Docker (Đơn giản hơn)

```bash
# Clone repository
git clone https://github.com/your-username/VietNamLookmaxing.git
cd VietNamLookmaxing

# Tạo file .env ở thư mục gốc với API keys
echo "GOOGLE_API_KEY=your_key_here" > .env
echo "LLM_PROVIDER=gemini" >> .env

# Build và chạy tất cả services
docker-compose up --build

# Truy cập:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:8000
```

Để dừng containers:

```bash
docker-compose down
```

---

## 📚 API Documentation

### Health Check

```http
GET /api/v1/health
```

**Response:**
```json
{
  "status": "healthy",
  "provider": "gemini"
}
```

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
    "analysis": "Phân tích chi tiết khuôn mặt...",
    "strengths": ["Positive canthal tilt", "Góc hàm mạnh"],
    "weaknesses": ["Midface hơi dài"],
    "advice": "Các khuyến nghị...",
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

Xem full API docs tại: `http://localhost:8000/docs`

---

## 📊 Bảng tham chiếu chỉ số

| Chỉ số | Phạm vi lý tưởng | Mô tả |
|--------|------------------|-------|
| Canthal Tilt | +4° đến +8° | Góc đuôi mắt (hunter eyes) |
| Bigonial/Bizygomatic | 75-80% | Tỷ lệ hàm/gò má |
| Gonial Angle | 125-130° | Độ mạnh của góc hàm |
| Midface Ratio | 43-44% | Vùng tỷ lệ vàng |
| Nasofrontal Angle | 130-135° | Góc trán-mũi nhìn nghiêng |

---

## ❓ Troubleshooting

### Lỗi thường gặp

<details>
<summary><b>❌ ModuleNotFoundError: No module named 'xxx'</b></summary>

Đảm bảo bạn đã kích hoạt virtual environment:

```powershell
# Windows PowerShell
.\venv\Scripts\Activate.ps1

# Sau đó cài lại dependencies
pip install -r requirements.txt
```
</details>

<details>
<summary><b>❌ CORS Error khi gọi API từ Frontend</b></summary>

Kiểm tra file `backend/.env`:
```env
FRONTEND_URL=http://localhost:3000
```

Và đảm bảo frontend đang chạy đúng port 3000.
</details>

<details>
<summary><b>❌ API Key Invalid / Rate Limit</b></summary>

- Kiểm tra API key trong `backend/.env` đã đúng chưa
- Google AI: Xác nhận key tại [aistudio.google.com](https://aistudio.google.com)
- Nếu bị rate limit, chờ vài phút hoặc đổi sang provider khác
</details>

<details>
<summary><b>❌ Camera không hoạt động</b></summary>

- Đảm bảo truy cập qua `localhost` (không phải IP)
- Cho phép browser access camera
- Thử với Chrome hoặc Edge (Firefox có thể có vấn đề)
</details>

<details>
<summary><b>❌ Lỗi "execution of scripts is disabled" trên PowerShell</b></summary>

Chạy PowerShell với quyền Admin và thực hiện:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
</details>

---

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng tham khảo các bước sau:

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/TinhNangMoi`)
3. Commit changes (`git commit -m 'Thêm tính năng mới'`)
4. Push to branch (`git push origin feature/TinhNangMoi`)
5. Mở Pull Request

---

## 📄 License

Project này được phát hành dưới giấy phép MIT - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

## ⚠️ Lưu ý

> Công cụ này chỉ dành cho mục đích giải trí và giáo dục. Tiêu chuẩn thẩm mỹ khuôn mặt mang tính chủ quan và khác biệt giữa các nền văn hóa. Điểm số và phân tích được cung cấp không nên được coi là lời khuyên y tế hoặc sự thật tuyệt đối.

---

<div align="center">

**Made with ❤️ by the Project Adam Team**

</div>
