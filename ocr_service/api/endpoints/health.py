from fastapi import APIRouter, Depends

router = APIRouter(tags=["health"])

@router.get("/health")
async def health_check():
    """
    Health check endpoint for the OCR service
    """
    return {"status": "healthy", "service": "OCR"}