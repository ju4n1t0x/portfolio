import os
from typing import Literal

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr

from app.client.ollama_local import ask_ai

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En prod, especificar dominio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SectionType = Literal["about", "projects", "experience", "contact"] | None


class ChatRequest(BaseModel):
    message: str
    section: SectionType = None


class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    message: str


@app.post("/chat")
def chat_endpoint(payload: ChatRequest):
    answer = ask_ai(payload.message, section=payload.section)
    return {"response": answer}


@app.post("/contact")
async def contact_endpoint(payload: ContactRequest):
    """Send contact email via Resend API (server-side, key protected)."""
    api_key = os.getenv("RESEND_API_KEY")
    to_email = os.getenv("CONTACT_EMAIL", "juani@example.com")

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="Email service not configured"
        )

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.resend.com/emails",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}",
            },
            json={
                "from": "Portfolio Contact <onboarding@resend.dev>",
                "to": [to_email],
                "subject": f"Nuevo mensaje de {payload.name}",
                "html": f"""
                    <h1>Nuevo mensaje del portfolio</h1>
                    <p><strong>Nombre:</strong> {payload.name}</p>
                    <p><strong>Email:</strong> {payload.email}</p>
                    <p><strong>Mensaje:</strong></p>
                    <p>{payload.message}</p>
                """,
            },
        )

    if response.status_code >= 400:
        raise HTTPException(
            status_code=response.status_code,
            detail="Failed to send email"
        )

    return {"success": True}


