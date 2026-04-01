from typing import Optional, Literal
from beanie import Document


class UploadedDocument(Document):
    did: str
    name: str
    type: str
    size: int
    uploadedAt: str
    filePath: str = ""
    extractedText: Optional[str] = None
    structuredData: Optional[dict] = None
    embeddingStored: bool = False
    processingStatus: Literal["pending", "processing", "completed", "failed"] = "pending"

    class Settings:
        name = "uploaded_documents"
