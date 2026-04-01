import os
import logging
import numpy as np
from typing import List, Tuple, Optional

logger = logging.getLogger(__name__)

# Lazy-loaded globals
_model = None
_index = None
_metadata = []  # List of (doc_id, chunk_text) tuples

FAISS_INDEX_PATH = os.path.join(os.path.dirname(__file__), "../../faiss_index/index.faiss")
METADATA_PATH = os.path.join(os.path.dirname(__file__), "../../faiss_index/metadata.npy")
EMBEDDING_DIM = 384  # all-MiniLM-L6-v2 dimension


def _get_model():
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
            _model = SentenceTransformer("all-MiniLM-L6-v2")
            logger.info("Sentence-Transformers model loaded")
        except Exception as e:
            logger.error(f"Failed to load embedding model: {e}")
            raise
    return _model


def _get_index():
    global _index
    if _index is None:
        try:
            import faiss
            if os.path.exists(FAISS_INDEX_PATH):
                _index = faiss.read_index(FAISS_INDEX_PATH)
                logger.info(f"FAISS index loaded with {_index.ntotal} vectors")
                # Load metadata
                if os.path.exists(METADATA_PATH):
                    global _metadata
                    _metadata = np.load(METADATA_PATH, allow_pickle=True).tolist()
            else:
                _index = faiss.IndexFlatL2(EMBEDDING_DIM)
                logger.info("Created new FAISS index")
        except Exception as e:
            logger.error(f"Failed to initialize FAISS: {e}")
            raise
    return _index


def _save_index():
    import faiss
    os.makedirs(os.path.dirname(FAISS_INDEX_PATH), exist_ok=True)
    faiss.write_index(_index, FAISS_INDEX_PATH)
    np.save(METADATA_PATH, np.array(_metadata, dtype=object))


def chunk_text(text: str, chunk_size: int = 500) -> List[str]:
    """Split text into chunks of approximately chunk_size characters."""
    words = text.split()
    chunks = []
    current_chunk = []
    current_length = 0

    for word in words:
        if current_length + len(word) + 1 > chunk_size and current_chunk:
            chunks.append(" ".join(current_chunk))
            current_chunk = []
            current_length = 0
        current_chunk.append(word)
        current_length += len(word) + 1

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks


async def add_document(doc_id: str, text: str):
    """Generate embeddings for document text and add to FAISS index."""
    model = _get_model()
    index = _get_index()
    global _metadata

    chunks = chunk_text(text)
    if not chunks:
        return

    embeddings = model.encode(chunks, convert_to_numpy=True)
    index.add(embeddings.astype("float32"))

    for chunk in chunks:
        _metadata.append((doc_id, chunk))

    _save_index()
    logger.info(f"Added {len(chunks)} chunks for document {doc_id}")


async def search(query: str, top_k: int = 5) -> List[dict]:
    """Search FAISS index for similar documents."""
    model = _get_model()
    index = _get_index()

    if index.ntotal == 0:
        return []

    query_embedding = model.encode([query], convert_to_numpy=True).astype("float32")
    distances, indices = index.search(query_embedding, min(top_k, index.ntotal))

    results = []
    for dist, idx in zip(distances[0], indices[0]):
        if idx < len(_metadata) and idx >= 0:
            doc_id, chunk_text_content = _metadata[idx]
            results.append({
                "docId": doc_id,
                "text": chunk_text_content,
                "score": float(1 / (1 + dist)),
            })

    return results
