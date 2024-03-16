from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.chat_routes import chatRouter
from config.config import APP_FRONTEND_URL

# Initialize FastAPI application
app = FastAPI()

# List of allowed origins for CORS
origins = [APP_FRONTEND_URL]

# Add CORS middleware to allow cross-origin requests from the specified origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include chat-related routes with '/api' prefix
app.include_router(chatRouter, prefix="/api")
