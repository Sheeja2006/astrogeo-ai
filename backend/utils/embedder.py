from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import json
import os

# Base directory (backend folder)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Correct paths
INDEX_PATH = os.path.join(BASE_DIR, "embeddings", "astrogeo.index")
CHUNKS_PATH = os.path.join(BASE_DIR, "embeddings", "chunks.json")

# Always try to download if files are missing
if not os.path.exists(INDEX_PATH) or not os.path.exists(CHUNKS_PATH):
    print("⬇ Index files missing, downloading from Google Drive...")
    try:
        from utils.download_index import download_if_needed
        download_if_needed()
    except Exception as e:
        print(f"❌ Download failed: {e}")
        raise

print("Loading embedding model...")
model = SentenceTransformer("all-MiniLM-L6-v2")

print("Loading FAISS index...")
if not os.path.exists(INDEX_PATH):
    raise FileNotFoundError(f"FAISS index not found at {INDEX_PATH}")

index = faiss.read_index(INDEX_PATH)

print("Loading chunks...")
with open(CHUNKS_PATH, "r", encoding="utf-8") as f:
    chunks = json.load(f)

print(f"✅ Ready — {index.ntotal} vectors loaded")


def search(query: str, top_k: int = 5):
    query_vec = model.encode([query]).astype("float32")
    distances, indices = index.search(query_vec, top_k)

    results = []
    for dist, idx in zip(distances[0], indices[0]):
        if idx < len(chunks):
            results.append({
                "text": chunks[idx],
                "score": float(dist)
            })

    return results