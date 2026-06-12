# main.py – FastAPI entry point for AI microservice

import os
from fastapi import FastAPI

# Import the router that contains the resume processing endpoint
from .routes import resume

app = FastAPI(title="AI Resume Scoring Service")

# Include the router under the root path (the router itself defines the full path)
app.include_router(resume.router)

# Optional: expose a simple health endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok"}
