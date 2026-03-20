from pathlib import Path

class Context():
    def __init__(self):
        self.text = Path(__file__).parent.parent /"db"/"context.md"
        self.text = self.text.read_text(encoding="utf-8")
        self.system_prompt = Path(__file__).parent.parent /"db"/"system_prompt.md"
        self.system_prompt = self.system_prompt.read_text(encoding="utf-8")


