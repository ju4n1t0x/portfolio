from typing import List, Dict, Any
import numpy as np
from app.client.embeddings import generate_embedding, load_knowledge_base

def cosine_similarity(a: List[float], b: List[float]) -> float:
    a_vec = np.array(a)
    b_vec = np.array(b)
    return float(np.dot(a_vec, b_vec) / (np.linalg.norm(a_vec) * np.linalg.norm(b_vec)))

def retrieve_relevant_context(query: str, top_k: int = 3) -> str:
    knowledge_base = load_knowledge_base()
    query_embedding = generate_embedding(query)
    scored = []

    for item in knowledge_base:
        score = cosine_similarity(query_embedding, item["embedding"])
        scored.append((score, item["text"]))
        
    scored.sort(key=lambda x: x[0], reverse=True)
    top_chunks = [text for _, text in scored[:top_k]]
    return "\n\n".join(top_chunks)