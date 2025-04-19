from PIL import Image, ImageFilter, ImageEnhance

def preprocess_image(image: Image.Image) -> Image.Image:
    """
    Preprocess the image for better OCR accuracy
    
    Args:
        image: PIL Image object
    
    Returns:
        Processed PIL Image object
    """
    # Convert to grayscale
    gray_image = image.convert('L')
    
    # Increase contrast
    enhancer = ImageEnhance.Contrast(gray_image)
    high_contrast = enhancer.enhance(2.0)
    
    # Apply thresholding
    binary_image = high_contrast.point(lambda p: p > 128 and 255)
    
    # Apply noise reduction
    filtered_image = binary_image.filter(ImageFilter.MedianFilter())
    
    return filtered_image