from dotenv import load_dotenv
load_dotenv()
from pydantic import BaseModel

from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI
from fastapi import Depends
from fastapi import Request
from fastapi import UploadFile, File
from pathlib import Path
from app.docs.loader import load_pdf_text
from app.docs.chunker import chunk_text

from fastapi.responses import JSONResponse
from app.security.profanity import contains_profanity

from app.auth.routes import router as auth_router
from app.auth.dependencies import get_current_user

from app.nlp.embeddings import EmbeddingModel
from app.nlp.vector_store import VectorStore

from app.nlp.llm import LocalLLM
from app.nlp.prompt import build_prompt

from app.nlp.summarizer import summarize_chunks




app = FastAPI(title="Enterprise AI Chatbot")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

embedding_model = EmbeddingModel.load()
vector_store = VectorStore(dimension=384)  # MiniLM output size


@app.get("/")
def health_check():
    return {"status": "ok"}

@app.get("/protected")
def protected_route(current_user: str = Depends(get_current_user)):
    return {"message": f"Hello {current_user}, you are authorized"}

@app.middleware("http")
async def profanity_filter(request: Request, call_next):
    if request.method in ("POST", "PUT"):
        body = await request.body()
        if body:
            body_text = body.decode("utf-8", errors="ignore")
            if contains_profanity(body_text):
                return JSONResponse(
                    status_code=400,
                    content={"detail": "Inappropriate language detected"},
                )
    response = await call_next(request)
    return response

UPLOAD_DIR = Path("data/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@app.post("/documents/upload")
async def upload_document(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        return {"detail": "Only PDF files are supported"}

    file_path = UPLOAD_DIR / file.filename

    with open(file_path, "wb") as f:
        f.write(await file.read())

    text = load_pdf_text(file_path)
    chunks = chunk_text(text)
    embeddings = EmbeddingModel.embed_texts(chunks)
    vector_store.add(embeddings, chunks)

    return {
        "filename": file.filename,
        "total_chunks": len(chunks),
        "sample_chunk": chunks[0][:300] if chunks else ""
    }

@app.post("/search")
def semantic_search(query: str):
    query_embedding = EmbeddingModel.embed_texts([query])[0]
    results = vector_store.search(query_embedding)
    return {
        "query": query,
        "results": results
    }

class ChatRequest(BaseModel):
    question: str

@app.post("/chat")
def chat(req: ChatRequest):
    query = req.question
    query_embedding = EmbeddingModel.embed_texts([query])[0]
    context_chunks = vector_store.search(query_embedding, top_k=3)

    prompt = build_prompt(context_chunks, query)
    answer = LocalLLM.generate(prompt)

    return {
        "question": query,
        "answer": answer,
        "sources": context_chunks
    }

@app.post("/documents/summarize")
def summarize_document():
    if not vector_store.text_chunks:
        return {"detail": "No documents uploaded"}

    summary = summarize_chunks(vector_store.text_chunks)

    return {
        "summary": summary
    }

