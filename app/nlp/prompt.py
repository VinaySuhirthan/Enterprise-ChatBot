def build_prompt(context_chunks: list[str], question: str) -> str:
    context = "\n\n".join(context_chunks)

    return f"""
You are an internal enterprise assistant.

Answer the question strictly using the context below.
If the answer is not present, say:
"Information not available in the provided documents."

Context:
{context}

Question:
{question}

Answer:
"""


def build_summary_prompt(text: str) -> str:
    return f"""
You are an enterprise assistant.

Summarize the following document content clearly and concisely.
Do not add information that is not present.
Focus on key ideas and purpose.

Document:
{text}

Summary:
"""
