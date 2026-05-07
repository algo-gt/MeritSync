import os
import google.generativeai as genai
from pinecone import Pinecone, ServerlessSpec

# Configure API keys
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

pc = None
PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")
if PINECONE_API_KEY:
    pc = Pinecone(api_key=PINECONE_API_KEY)

INDEX_NAME = "meritsync-vectors"

def init_pinecone():
    """Initializes the Pinecone index if it doesn't exist."""
    if not pc:
        return
    if INDEX_NAME not in pc.list_indexes().names():
        pc.create_index(
            name=INDEX_NAME,
            dimension=768, # Dimension for text-embedding-004
            metric='cosine',
            spec=ServerlessSpec(
                cloud='aws',
                region='us-east-1'
            )
        )

def get_embedding(text: str) -> list[float]:
    """Generates an embedding vector for the given text using Gemini."""
    result = genai.embed_content(
        model="models/text-embedding-004",
        content=text,
        task_type="retrieval_document"
    )
    return result['embedding']

def upsert_vector(entity_id: str, text: str, metadata: dict):
    """Generates an embedding and upserts it to Pinecone."""
    if not pc:
        return {"error": "Pinecone not configured"}
    
    vector = get_embedding(text)
    index = pc.Index(INDEX_NAME)
    index.upsert(
        vectors=[
            {"id": entity_id, "values": vector, "metadata": metadata}
        ]
    )
    return {"status": "success", "id": entity_id}
