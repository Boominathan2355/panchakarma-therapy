# System Architecture

## 4-Layer Architecture (from IEEE paper)

```
+--------------------------------------------------+
|              Application Layer                     |
|    React SPA + Redux State Management             |
+--------------------------------------------------+
|           Workflow Automation Layer                 |
|    Hybrid Scheduling (GA + PSO + Rules)           |
|    Conflict Detection, Rescheduling               |
+--------------------------------------------------+
|            AI Intelligence Layer                   |
|    LLM Processing (HuggingFace)                   |
|    OCR (Tesseract), Embeddings (FAISS)            |
+--------------------------------------------------+
|          Document Processing Layer                 |
|    PDF/DOC/Image Text Extraction                  |
|    Structured JSON Generation                      |
+--------------------------------------------------+
|               Data Layer                           |
|    MongoDB Atlas (Beanie ODM)                     |
+--------------------------------------------------+
```

## Data Flow

1. Admin uploads therapy protocol document (PDF/DOC/image)
2. Server extracts text (PyPDF2/python-docx/Tesseract OCR)
3. LLM (HuggingFace) converts text to structured JSON workflow
4. Embeddings generated (Sentence-Transformers) and stored in FAISS
5. Physician selects therapy for patient
6. Hybrid scheduler generates optimized session plan
7. Staff manages sessions via dashboard with real-time conflict detection
