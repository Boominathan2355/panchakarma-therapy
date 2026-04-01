import os
from PyPDF2 import PdfReader
from docx import Document as DocxDocument
from PIL import Image
import pytesseract
import io


async def extract_text(file_path: str, mime_type: str) -> str:
    """Extract text from PDF, DOCX, or image files."""
    if mime_type == "application/pdf":
        return extract_from_pdf(file_path)
    elif mime_type in [
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]:
        return extract_from_docx(file_path)
    elif mime_type.startswith("image/"):
        return extract_from_image(file_path)
    else:
        raise ValueError(f"Unsupported file type: {mime_type}")


def extract_from_pdf(file_path: str) -> str:
    """Extract text from PDF. Falls back to OCR if text extraction yields nothing."""
    reader = PdfReader(file_path)
    text_parts = []
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text_parts.append(page_text)

    full_text = "\n".join(text_parts).strip()

    # If no text extracted (scanned PDF), try OCR
    if not full_text:
        try:
            from pdf2image import convert_from_path
            images = convert_from_path(file_path)
            ocr_parts = []
            for img in images:
                ocr_parts.append(pytesseract.image_to_string(img))
            full_text = "\n".join(ocr_parts).strip()
        except ImportError:
            # pdf2image not installed, try basic OCR approach
            full_text = "[Scanned PDF - OCR requires pdf2image library]"

    return full_text


def extract_from_docx(file_path: str) -> str:
    """Extract text from DOCX files."""
    doc = DocxDocument(file_path)
    paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
    return "\n".join(paragraphs)


def extract_from_image(file_path: str) -> str:
    """Extract text from images using Tesseract OCR with preprocessing."""
    img = Image.open(file_path)

    # Preprocess: convert to grayscale for better OCR accuracy
    img = img.convert("L")

    text = pytesseract.image_to_string(img)
    return text.strip()
