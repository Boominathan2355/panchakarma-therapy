from PIL import Image, ImageFilter
import pytesseract


def preprocess_image(image: Image.Image) -> Image.Image:
    """Preprocess image for better OCR accuracy."""
    # Convert to grayscale
    img = image.convert("L")
    # Apply slight sharpening
    img = img.filter(ImageFilter.SHARPEN)
    # Increase contrast via thresholding
    threshold = 140
    img = img.point(lambda x: 255 if x > threshold else 0, "1")
    return img


def ocr_image(file_path: str) -> str:
    """Perform OCR on an image file with preprocessing."""
    img = Image.open(file_path)
    processed = preprocess_image(img)
    text = pytesseract.image_to_string(processed)
    return text.strip()


def ocr_image_bytes(image_bytes: bytes) -> str:
    """Perform OCR on image bytes."""
    import io
    img = Image.open(io.BytesIO(image_bytes))
    processed = preprocess_image(img)
    text = pytesseract.image_to_string(processed)
    return text.strip()
