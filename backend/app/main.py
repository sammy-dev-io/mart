from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Create the FastAPI application instance
app = FastAPI(
    title  = "Mart API",
    description = "Backend API for Mart e-commerce platform",
    version = "1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["https://localhost:5173"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)\

# Root endpoint - just to confirm the API is running
@app.get("/")
def root():
    return{"message": "Mart APi is running"}