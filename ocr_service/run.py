import uvicorn

if __name__ == "__main__":
    # Specify only the directories/files to watch for changes
    # (this avoids scanning .git directories)
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        reload_dirs=[".", "./main.py", "./pdf_validator.py", "./table_extractor.py"]
    )
