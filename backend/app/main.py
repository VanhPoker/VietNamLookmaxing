"""
Project Adam - AI Face Aesthetics Scorer
FastAPI Application Entry Point
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routes import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup/shutdown events
    """
    # Startup
    print("🧬 Project Adam API starting up...")
    print(f"📡 LLM Provider: {settings.llm_provider}")
    print(f"🌐 Allowing CORS from: {settings.frontend_url}")
    
    yield
    
    # Shutdown
    print("👋 Project Adam API shutting down...")


# Create FastAPI app
app = FastAPI(
    title="Project Adam API",
    description="""
    ## 🧬 AI Face Aesthetics Scorer

    Project Adam uses advanced computer vision and AI to analyze facial aesthetics.
    
    ### Features:
    - **468 Landmark Detection**: Using Google MediaPipe Face Mesh
    - **Geometric Analysis**: Canthal tilt, gonial angle, facial thirds, and more
    - **AI-Powered Insights**: Expert-level analysis from Claude/Gemini LLMs
    - **Scientific Scoring**: Based on established aesthetic principles
    
    ### Endpoints:
    - `POST /api/v1/analyze` - Full analysis with front + side images
    - `POST /api/v1/analyze/quick` - Quick analysis with front image only
    - `GET /api/v1/health` - Health check
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api/v1", tags=["Analysis"])


@app.get("/")
async def root():
    """
    Root endpoint - API information
    """
    return {
        "name": "Project Adam API",
        "version": "1.0.0",
        "description": "AI Face Aesthetics Scorer",
        "docs": "/docs",
        "health": "/api/v1/health"
    }


# Run with: uvicorn app.main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug
    )
