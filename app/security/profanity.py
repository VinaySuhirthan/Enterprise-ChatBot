import re
from pathlib import Path

BAD_WORDS_FILE = Path(__file__).parent / "bad_words.txt"

def load_bad_words():
    with open(BAD_WORDS_FILE, "r") as f:
        return set(word.strip().lower() for word in f if word.strip())

BAD_WORDS = load_bad_words()

def contains_profanity(text: str) -> bool:
    text = text.lower()
    for bad_word in BAD_WORDS:
        pattern = r"\b" + re.escape(bad_word) + r"\b"
        if re.search(pattern, text):
            return True
    return False
