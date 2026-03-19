from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
CONTEXT_FILE = BASE_DIR / "curriculum.md"

def load_context() -> str:
    return CONTEXT_FILE.read_text(encoding="utf-8")