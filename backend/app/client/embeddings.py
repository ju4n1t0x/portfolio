import json
import os
from pathlib import Path
from typing import List, Dict, Any
import ollama
from app.context.context import load_context

DEFAULT_EMBEDDINGS_PATH = "/app/data/embeddings.json"
def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    chunks = []
    start = 0
    while start < len(text):
        end = min(start + chunk_size, len(text))
        chunks.append(text[start:end].strip())
        start = end - overlap
        if start < 0:
            start = 0
    return [c for c in chunks if c]

def generate_embedding(text: str, model: str = "nomic-embed-text") -> List[float]:
    response = ollama.embeddings(model=model, prompt=text)
    return response["embedding"]

def embeddings_path() -> Path:
    path = os.getenv("EMBEDDINGS_PATH", DEFAULT_EMBEDDINGS_PATH)
    return Path(path)

def build_knowledge_base(model: str = "nomic-embed-text") -> List[Dict[str, Any]]:
    context = load_context()
    chunks = chunk_text(context)
    knowledge_base = []
    for chunk in chunks:
        embedding = generate_embedding(chunk, model=model)
        knowledge_base.append({
            "text": chunk,
            "embedding": embedding,
        })
    path = embeddings_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(knowledge_base, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )
    return knowledge_base
    
def load_knowledge_base() -> List[Dict[str, Any]]:
    path = embeddings_path()
    if not path.exists():
        return build_knowledge_base()
    data = json.loads(path.read_text(encoding="utf-8"))
    return data