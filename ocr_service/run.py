import uvicorn
from core.logging import setup_logging

# Set up logging
logger = setup_logging("ocr_service")

if __name__ == "__main__":
    logger.info("Starting OCR service...")
    
    # Specify only the directories/files to watch for changes
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        reload_dirs=[".", "./api", "./core", "./services", "./utils"]
    )
    
    logger.info("OCR service stopped")
