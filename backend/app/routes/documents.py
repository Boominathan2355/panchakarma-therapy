import os
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, BackgroundTasks, Query
from typing import List, Optional
from app.models.document import UploadedDocument
from app.middleware.auth import get_current_user
from app.services.audit_service import log_action
from app.config import settings

router = APIRouter(prefix="/documents", tags=["Documents"])


async def process_document_background(doc_id: str):
    """Background task: extract text, process with LLM, generate embeddings."""
    from app.services.extraction_service import extract_text
    from app.services.llm_service import process_therapy_document
    from app.services.embedding_service import add_document

    doc = await UploadedDocument.find_one(UploadedDocument.did == doc_id)
    if not doc:
        return

    doc.processingStatus = "processing"
    await doc.save()

    try:
        # Step 1: Extract text
        extracted = await extract_text(doc.filePath, doc.type)
        doc.extractedText = extracted

        # Step 2: LLM processing
        structured = await process_therapy_document(extracted)
        doc.structuredData = structured

        # Step 3: Generate embeddings
        try:
            await add_document(doc_id, extracted)
            doc.embeddingStored = True
        except Exception as e:
            # Embeddings are optional - don't fail the whole pipeline
            doc.embeddingStored = False

        doc.processingStatus = "completed"
        await doc.save()

    except Exception as e:
        doc.processingStatus = "failed"
        doc.extractedText = f"Error: {str(e)}"
        await doc.save()


@router.post("/")
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    user=Depends(get_current_user),
):
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    doc_id = f"doc-{uuid.uuid4().hex[:8]}"
    file_ext = os.path.splitext(file.filename)[1]
    save_path = os.path.join(settings.UPLOAD_DIR, f"{doc_id}{file_ext}")

    content = await file.read()
    with open(save_path, "wb") as f:
        f.write(content)

    doc = UploadedDocument(
        did=doc_id,
        name=file.filename,
        type=file.content_type or "application/octet-stream",
        size=len(content),
        uploadedAt=datetime.now(timezone.utc).isoformat(),
        filePath=save_path,
        processingStatus="pending",
    )
    await doc.insert()

    background_tasks.add_task(process_document_background, doc_id)

    await log_action(
        user_name=user.name,
        action="UPLOAD",
        entity="Document",
        entity_id=doc_id,
        details=f"Uploaded {file.filename}",
    )

    return {
        "success": True,
        "id": doc_id,
        "extractedData": None,
    }


@router.get("/", response_model=List[dict])
async def list_documents(user=Depends(get_current_user)):
    docs = await UploadedDocument.find_all().to_list()
    return [
        {
            "id": d.did,
            "name": d.name,
            "type": d.type,
            "size": d.size,
            "uploadedAt": d.uploadedAt,
        }
        for d in docs
    ]


@router.get("/search")
async def search_documents(
    q: str = Query(..., min_length=1),
    top_k: int = Query(5, ge=1, le=20),
    user=Depends(get_current_user),
):
    from app.services.embedding_service import search
    results = await search(q, top_k)
    return {"query": q, "results": results}


@router.get("/{doc_id}")
async def get_document(doc_id: str, user=Depends(get_current_user)):
    doc = await UploadedDocument.find_one(UploadedDocument.did == doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return {
        "id": doc.did,
        "name": doc.name,
        "type": doc.type,
        "size": doc.size,
        "uploadedAt": doc.uploadedAt,
        "processingStatus": doc.processingStatus,
        "extractedText": doc.extractedText,
        "structuredData": doc.structuredData,
        "embeddingStored": doc.embeddingStored,
    }


@router.get("/{doc_id}/status")
async def get_document_status(doc_id: str, user=Depends(get_current_user)):
    doc = await UploadedDocument.find_one(UploadedDocument.did == doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return {
        "id": doc.did,
        "processingStatus": doc.processingStatus,
        "structuredData": doc.structuredData,
    }


@router.delete("/{doc_id}")
async def delete_document(doc_id: str, user=Depends(get_current_user)):
    doc = await UploadedDocument.find_one(UploadedDocument.did == doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if doc.filePath and os.path.exists(doc.filePath):
        os.remove(doc.filePath)

    await doc.delete()

    await log_action(
        user_name=user.name,
        action="DELETE",
        entity="Document",
        entity_id=doc_id,
        details=f"Deleted document: {doc.name}",
    )

    return {"success": True, "message": "Document deleted"}
