import os
import requests
import json
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct

# Qdrant setup
QDRANT_URL = "http://localhost:6333"
COLLECTION_NAME = "project_embeddings"

client = QdrantClient(url=QDRANT_URL)

# Create collection if not exists
if COLLECTION_NAME not in [c.name for c in client.get_collections().collections]:
    client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(size=768, distance=Distance.COSINE)  # size matches nomic-embed-text output
    )

# Function to get embeddings from Ollama
def get_embedding(text: str):
    url = "http://localhost:11434/api/embeddings"
    payload = {
        "model": "nomic-embed-text",
        "prompt": text
    }
    response = requests.post(url, json=payload)
    response.raise_for_status()
    return response.json()["embedding"]

# Walk project directory and embed files
project_dir = "/Users/sohamkshirsagar/Projects/Local LLM/fake_data_populated"  # change to your project root
points = []
point_id = 1

for root, _, files in os.walk(project_dir):
    for file in files:
        if file.startswith('.') or file.endswith(('.png', '.jpg', '.jpeg', '.gif', '.exe', '.zip', '.pyc', '.lock', '.db')):
            continue
        
        file_path = os.path.join(root, file)
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            if content.strip():
                embedding = get_embedding(content)
                points.append(
                    PointStruct(
                        id=point_id,
                        vector=embedding,
                        payload={
                            "file_path": file_path,
                            "content": content
                        }
                    )
                )
                point_id += 1
        except Exception as e:
            print(f"Skipping {file_path}: {e}")

# Upload in batches
if points:
    client.upsert(collection_name=COLLECTION_NAME, points=points)
    print(f"✅ Uploaded {len(points)} files to Qdrant collection '{COLLECTION_NAME}'")
else:
    print(" No valid files found for embedding ")
