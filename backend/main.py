from fastapi import FastAPI
from  routes.chat_routes import chatRouter

app = FastAPI()

app.include_router(chatRouter, prefix="/api")