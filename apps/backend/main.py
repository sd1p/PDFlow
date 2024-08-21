from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.chat_routes import chatRouter
from config.config import APP_FRONTEND_URL

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chatRouter, prefix="/api")

@app.get("/")
async def test_route():
    return {"message": "backend is running"}
