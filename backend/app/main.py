from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from .routes.api_route import api_route
from .routes.auth import auth_router


load_dotenv()

app = FastAPI()

# CORS middleware for frontend (Vite dev server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:4173",  # Vite preview
        "http://127.0.0.1:4173",
        "https://juansasia.com",
        "https://www.juansasia.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_route)
app.include_router(auth_router)
