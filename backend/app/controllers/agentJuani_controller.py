from ..services.openai_conexion import OpenAIService
from ..models.answer import Answer
from typing import Generator

class AgentJuaniController:
    def __init__(self):
        self.service = OpenAIService()

    def post_agent_juani(self, data: Answer) -> Generator:
        try:
            return self.service.get_response(data.message)
        except Exception as e:
            error_msg = "Lo siento, estoy teniendo problemas técnicos. Por favor, intentá de nuevo en un momento."
            return iter([f"data: {error_msg}\n\n"])