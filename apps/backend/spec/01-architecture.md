# Arquitectura del Proyecto

```
backend/
├── db/
│   └── context.md                # Archivo markdown de contexto
├── models/
│   └── agentJuani.py             # Definición del modelo AgentJuani
├── services/
│   ├── ollama_conexion.py        # Conexión con la API de Ollama
│   └── context.py                # Archivo de contexto
├── controllers/
│   └── agentJuani_controller.py  # Controlador para AgentJuani
├── middleware/
│   └── auth.py                   # Autenticación para frontend con token services que autentican contra publicKey.md
├── route/
│    └── api_route.py              # Definición de rutas API
├── certs/
    └── privateKey.md              # clave privara con ssh245 algorithm
    └── publicKey.md               # clave publica a partir de clave privada

```

## Descripción de carpetas y archivos

- **db/context.md**: Archivo markdown de contexto.
- **models/agentJuani.py**: Definición del modelo AgentJuani.
- **services/ollama_conexion.py**: Conexión con la API de Ollama.
- **services/context.py**: Archivo de contexto.
- **controllers/agentJuani_controller.py**: Controlador para AgentJuani.
- **middleware/auth.py**: Autenticación para la app frontend usando web token.
- **route/api_route.py**: Definición de rutas API.

---------

main.py:
from fastapi import FastAPI 
from dotenv import load_dotenv
from .routes.api_rout import api_route

load_dotenv()

app = FastAPI()

app.include_router(api_route)


api_route.py:
from fastapi import APIRouter, Depends
from ..controler import AgentJuaniController

api_route = APIRouter()

def get_controller():
    return AgentJuaniController()

@api_route.post("/agentJuani")
def agent_juani(data: Answer, controller: AgentJuaniController = Depends(get_controller)):
    return controller.post_agent_juani(data)

agentJuani_controller.py:
from ..services.ollama_conexion import OllamaService
from ..models.answer import Answer

class AgentJuaniController:
    def __init__(self):
        self.service = OllamaService()

    def post_agent_juani(self, data: Answer) -> dict:
        try:
            return self.service.get_response(data.message)
        except Exception as e:
            return {"error": str(e), "status": "failed"}

context.py:
from pathlb import Path

class Context():
    def __init__(self):
        self.text = Path("__file__").parent.parent /"db"/"context.md"
        self.text = self.text.read_text(encoding="utf-8")
        self.system_prompt = (base / "system_prompt.md").read_text(encoding="utf-8")


openai_conexion.py:
from pathlb import Path

class Context():
    def __init__(self):
        self.text = Path("__file__").parent.parent /"db"/"context.md"
        self.text = self.text.read_text(encoding="utf-8")
        self.system_prompt = (base / "system_prompt.md").read_text(encoding="utf-8")

Answer.py:
from pydantic import BaseModel

class Answer (BaseModel):
    message: str   
