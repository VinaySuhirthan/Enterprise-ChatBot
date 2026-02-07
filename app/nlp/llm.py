import subprocess

class LocalLLM:
    MODEL_NAME = "llama3"

    @staticmethod
    def generate(prompt: str) -> str:
        result = subprocess.run(
            ["ollama", "run", LocalLLM.MODEL_NAME],
            input=prompt,
            capture_output=True,
            text=True
        )
        return result.stdout.strip()
