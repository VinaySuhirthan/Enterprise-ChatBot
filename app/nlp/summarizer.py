from app.nlp.llm import LocalLLM
from app.nlp.prompt import build_summary_prompt

def summarize_chunks(chunks: list[str]) -> str:
    summaries = []

    for chunk in chunks:
        prompt = build_summary_prompt(chunk)
        summary = LocalLLM.generate(prompt)
        summaries.append(summary.strip())

    # Final consolidation
    final_prompt = build_summary_prompt("\n".join(summaries))
    return LocalLLM.generate(final_prompt).strip()
