from fastapi import FastAPI
import logging
import os

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Debug: Print environment variables to help diagnose issues
logger.info("==== DEBUG: Environment Variables ====")
logger.info(f"GEMINI_API_KEY exists: {'Yes' if 'GEMINI_API_KEY' in os.environ else 'No'}")
logger.info(f"GEMINI_MODEL: {os.environ.get('GEMINI_MODEL', 'Not found')}")
logger.info(f"DEBUG setting: {os.environ.get('DEBUG', 'Not found')}")
logger.info("==== End Environment Debug ====")

# Import API endpoints
from api.endpoints.ocr import router as ocr_router
from api.endpoints.extraction import router as extraction_router
from core.config import settings

# Debug: Print settings values
logger.info("==== DEBUG: Settings Values ====")
logger.info(f"settings.GEMINI_API_KEY exists: {'Yes' if settings.GEMINI_API_KEY else 'No'}")
logger.info(f"settings.GEMINI_MODEL: {settings.GEMINI_MODEL}")
logger.info(f"settings.DEBUG: {settings.DEBUG}")
logger.info("==== End Settings Debug ====")

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="Medical document OCR and data extraction service",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Include routers with API prefix
app.include_router(ocr_router, prefix=settings.API_PREFIX)
app.include_router(extraction_router, prefix=settings.API_PREFIX)

@app.get("/")
async def root():
    return {"status": "online", "service": settings.APP_NAME}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

