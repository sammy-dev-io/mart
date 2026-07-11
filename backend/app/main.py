from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables FIRST before anything else
load_dotenv()

# Now import database-dependent things AFTER load_dotenv
from app.database import engine, Base
from app import models

# Create all database tables
Base.metadata.create_all(bind=engine)

# Create the FastAPI application instance
app = FastAPI(
    title="Mart API",
    description="Backend API for Mart e-commerce platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
)

# Root endpoint
@app.get("/")
def root():
    return {"message": "Mart API is running"}