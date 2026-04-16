import os
import gdown

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

INDEX_PATH = os.path.join(BASE_DIR, "embeddings", "astrogeo.index")
CHUNKS_PATH = os.path.join(BASE_DIR, "embeddings", "chunks.json")


def download_if_needed():

    os.makedirs(os.path.dirname(INDEX_PATH), exist_ok=True)

    index_id = os.getenv("FAISS_INDEX_GDRIVE_ID")
    chunks_id = os.getenv("CHUNKS_GDRIVE_ID")

    # Download FAISS index
    if not os.path.exists(INDEX_PATH):
        if not index_id:
            raise ValueError("FAISS_INDEX_GDRIVE_ID environment variable not set")

        print("⬇ Downloading FAISS index from Google Drive...")

        gdown.download(
            id=index_id,
            output=INDEX_PATH,
            quiet=False
        )

        print("✅ FAISS index downloaded!")

    # Download chunks file
    if not os.path.exists(CHUNKS_PATH):
        if not chunks_id:
            raise ValueError("CHUNKS_GDRIVE_ID environment variable not set")

        print("⬇ Downloading chunks.json from Google Drive...")

        gdown.download(
            id=chunks_id,
            output=CHUNKS_PATH,
            quiet=False
        )

        print("✅ chunks.json downloaded!")