from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

# Import routes
from api.endpoints.ocr import router as ocr_router
from api.endpoints.health import router as health_router
from core.config import settings

# Create FastAPI app
app = FastAPI(title="Medical Document OCR Service")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Include routers
app.include_router(health_router)
app.include_router(ocr_router, prefix="/api/v1")

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Medical Document OCR Service is online"}

