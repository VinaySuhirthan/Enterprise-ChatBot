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

