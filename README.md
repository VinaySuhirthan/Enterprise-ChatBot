#  Enterprise AI Chatbot  
**A Secure, Document-Aware Intelligent Assistant for Organizations**

---

## 📌 Overview

The **Enterprise AI Chatbot** is a secure, AI-powered assistant designed to help employees of large organizations quickly access information from internal documents such as HR policies, IT manuals, and organizational guidelines.

The system supports **document upload**, **semantic search**, **context-aware question answering**, and **document summarization**, all through a web-based interface secured with **JWT authentication and email-based OTP (Two-Factor Authentication)**.

This project demonstrates a real-world **enterprise-ready AI chatbot** using modern NLP techniques and a scalable full-stack architecture.

---

## 🚀 Key Features

- 🔐 **Secure Authentication**
  - Email & password login
  - Email-based OTP (2FA)
  - JWT-based session management

- 📄 **Document Upload from UI**
  - Upload PDF documents directly from the chat interface
  - Automatic text extraction, chunking, and embedding

- 💬 **Context-Aware Chat (RAG)**
  - Answers strictly based on uploaded documents
  - Semantic search + LLM (Retrieval-Augmented Generation)
  - Prevents hallucinations outside document scope

- 📝 **Document Summarization**
  - One-click summarization of uploaded documents

- 🛡️ **Content Safety**
  - Profanity filtering middleware
  - Blocks inappropriate language at API level

- 💾 **Session Persistence**
  - Chat history preserved on refresh
  - OTP and login state handled gracefully

- 🌐 **Scalable Design**
  - Stateless APIs
  - Supports multiple concurrent users
  - Response time under 5 seconds

---

## 🏗️ System Architecture
```
Frontend (React)
   │
   │  HTTPS (JWT Auth)
   ▼
Backend (FastAPI)
   │
   ├── Authentication & OTP
   ├── Profanity Filter Middleware
   ├── Document Processing (PDF → Text → Chunks)
   ├── Embedding Model (MiniLM)
   ├── Vector Store (Semantic Search)
   └── LLM (Local / Open-Source)
```

## Technology Stack (100% Free & Open Source)

### Frontend
```
React (Vite)

Axios

Plain CSS
```
### Backend
```
FastAPI

Pydantic

Uvicorn

Python 3.x
```
### AI / NLP
```
Sentence Transformers (MiniLM)

Vector similarity search

Local LLM (open-source)

Retrieval-Augmented Generation (RAG)
```
### Security
```
JWT Authentication

Email OTP (SMTP)

Profanity filtering middleware
```

## Project Structure
```
Enterprise-ChatBot/
│
├── app/
│   ├── auth/              # Authentication, OTP, JWT
│   ├── docs/              # PDF loading & chunking
│   ├── nlp/               # Embeddings, LLM, prompts
│   ├── security/          # Profanity filter
│   ├── utils/             # Email sender, helpers
│   └── main.py            # FastAPI entry point
│
├── data/
│   └── uploads/           # Uploaded documents
│
└── enterprise-chatbot-ui/ # React frontend
```

## Setup Instructions

### Clone the Repository
```
git clone https://github.com/keerthivasan-k-s/enterprise-ai-chatbot.git
cd enterprise-ai-chatbot
```
### Backend Setup
```
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```
  Create a .env file:
  ```
  EMAIL_HOST=smtp.gmail.com
  EMAIL_PORT=465
  EMAIL_USER=your_email@gmail.com
  EMAIL_PASSWORD=your_app_password
  JWT_SECRET_KEY=your_secret_key
  ```
  Run backend:
  ```
  uvicorn app.main:app --reload
  ```
  Backend runs at:
  ```
  http://127.0.0.1:8000
  ```
### Frontend Setup
```
cd enterprise-chatbot-ui
npm install
npm run dev
```
  Frontend runs at:
    ```
    http://localhost:5173
    ```
    
## Demo Workflow
1. Login using pre-configured user credentials

2. Receive OTP via email and verify

3. Upload a PDF document from the chat UI

4. Ask questions related to the document

5. Generate a document summary

6. Logout securely

### User Management (Demo Note) :
  1. For demonstration purposes, users are pre-configured in the backend .
  2. In a production environment, this system can be easily extended to support:
```
User registration
Database-backed user storage
Enterprise SSO / LDAP integration
```

## AI Design Philosophy
The chatbot does not hallucinate

All responses are grounded in uploaded documents

Semantic similarity ensures relevant context retrieval

The LLM is used only for generation, not knowledge storage

## Scalability & Performance
Stateless API design

Lightweight embeddings

Efficient vector search

Suitable for handling multiple concurrent users

Average response time under 5 seconds

## Security Considerations
JWT-secured endpoints

OTP-based second-factor authentication

Profanity filtering at middleware level

No sensitive data exposed to frontend

## Conclusion
This project demonstrates a production-inspired enterprise AI chatbot combining secure authentication, document intelligence, and modern NLP techniques.

It is suitable for:

 . Hackathon submissions
  
 . Academic demonstrations
  
 . Enterprise proof-of-concepts
  
 . Resume and portfolio showcase
  
## License
This project is intended for educational and demonstration purposes.
