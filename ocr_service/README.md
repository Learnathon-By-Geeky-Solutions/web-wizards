# OCR Model API

This API provides optical character recognition (OCR) capabilities to extract text from images and PDFs.

## Features

- Extract text from images using OCR
- Process PDFs directly for text extraction
- Handle both URL-based and local file uploads
- Optimized for large file processing

## API Endpoints

### Extract Text from Image URL

```
POST /extract-text/
```

Request body:
```json
{
  "image_url": "https://example.com/image.jpg"
}
```

### Extract Text from PDF URL

```
POST /extract-text-from-pdf/
```

Request body:
```json
{
  "pdf_url": "https://example.com/document.pdf"
}
```

### Extract Text from Uploaded PDF File

```
POST /extract-text-from-uploaded-pdf/
```

This endpoint accepts multipart form data with a PDF file.

## Running the Application

### Prerequisites

- Python 3.9+
- Tesseract OCR
- Poppler utilities (for PDF processing)

### Installation

```bash
# Install dependencies
pip install -r requirements.txt

# Run the FastAPI application
uvicorn main:app --reload
```

### Using Docker

```bash
# Build the Docker image
docker build -t ocr-api .

# Run the container
docker run -p 80:80 ocr-api
```

## Example: Uploading a Local PDF for Processing

Using curl:
```bash
curl -X POST \
  -F "file=@/path/to/your/document.pdf" \
  http://localhost:8000/extract-text-from-uploaded-pdf/
```

Using Python requests:
```python
import requests

url = "http://localhost:8000/extract-text-from-uploaded-pdf/"
files = {"file": open("document.pdf", "rb")}
response = requests.post(url, files=files)
print(response.json())
```

## Troubleshooting

If you encounter timeout issues when processing large PDFs from URLs, try:
1. Use the local file upload endpoint instead
2. Split large PDFs into smaller files before processing
3. Increase client timeout settings in your API client
