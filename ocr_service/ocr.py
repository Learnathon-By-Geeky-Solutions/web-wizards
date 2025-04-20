import pytesseract
from PIL import Image, ImageFilter
import requests
from io import BytesIO

def preprocess_image(image: Image) -> Image:
    """Preprocess the image for better OCR accuracy."""
    gray_image = image.convert('L')  # Convert to grayscale
    binary_image = gray_image.point(lambda p: p > 128 and 255)  # Thresholding
    filtered_image = binary_image.filter(ImageFilter.MedianFilter())  # Noise removal
    return filtered_image

def extract_text_from_url(image_url: str) -> str:
    """Fetch image from URL and extract text using Tesseract OCR."""
    try:
        response = requests.get(image_url)
        if response.status_code != 200:
            return None
        image = Image.open(BytesIO(response.content))
        preprocessed_image = preprocess_image(image)
        custom_config = r'--oem 3 --psm 6'  # Experiment with `psm` values
        text = pytesseract.image_to_string(preprocessed_image, config=custom_config)
        print(f"Extracted text: {text}")
        return text
    except Exception as e:
        print(f"Error processing image: {e}")
        return None