from openai import OpenAI
from ..services.context import Context
from typing import Generator
import os

class OpenAIService:
    def __init__(self):
        context = Context()
        self.context = context.text
        self.system_prompt = context.system_prompt
        self.model = 'openrouter/free'
        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=os.getenv("OPENROUTER_API_KEY"),
        )

    def get_response(self, message: str) -> Generator:
        completion = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    'role': 'system',
                    'content': f"{self.system_prompt}\n\n## Contexto\n{self.context}"
                },
                {'role': 'user', 'content': message}
            ],
            stream=True
        )

        def generate():
            for chunk in completion:
                delta = chunk.choices[0].delta.content
                if delta:
                    yield f"data: {delta}\n\n"

        return generate()