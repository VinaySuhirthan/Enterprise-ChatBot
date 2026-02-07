from fastapi import FastAPI

app = FastAPI(title="Enterprise AI Chatbot")

@app.get("/")
def health_check():
    return {"status": "ok"}

