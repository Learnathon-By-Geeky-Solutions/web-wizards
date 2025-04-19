import logging
import sys
from typing import Optional

def setup_logging(
    logger_name: str = "ocr_service", 
    log_level: Optional[int] = logging.INFO
):
    """Configure logging for the application"""
    logger = logging.getLogger(logger_name)
    logger.setLevel(log_level)
    
    # Create console handler
    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(log_level)
    
    # Create formatter
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    handler.setFormatter(formatter)
    
    # Add handler to logger
    logger.addHandler(handler)
    
    return logger