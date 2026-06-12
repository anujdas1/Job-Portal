# routes/resume.py

import os
import random
import uuid
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import requests

router = APIRouter()

# Environment configuration – where to send the webhook result
NODE_WEBHOOK_URL = os.getenv("NODE_WEBHOOK_URL", "http://localhost:5000/api/webhook/ai-score")

@router.post("/process-resume")
async def process_resume(
    file: UploadFile = File(...),
    applicationId: str = Form(...)
):
    """Accept a PDF resume, run (placeholder) AI analysis, and post results to the Node.js webhook.

    Returns a JSON payload mirroring what the Node webhook expects.
    """
    # Basic validation – ensure PDF
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    # Read the file content (in-memory – fine for placeholder)
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:  # 5 MB limit (same as upload middleware)
        raise HTTPException(status_code=400, detail="File size exceeds 5 MB limit")

    # ---- Placeholder AI logic ----
    # In a real implementation you would run an ML model here.
    # For now we simulate a score between 0‑100 and generate a fake interview link.
    ai_match_score = round(random.uniform(50, 100), 2)  # realistic range
    interview_id = uuid.uuid4().hex
    adaptive_interview_link = f"https://ai-interview.example.com/session/{interview_id}"

    # Prepare payload for the Node.js webhook
    payload = {
        "applicationId": applicationId,
        "aiMatchScore": ai_match_score,
        "adaptiveInterviewLink": adaptive_interview_link,
    }

    try:
        resp = requests.post(NODE_WEBHOOK_URL, json=payload, timeout=5)
        resp.raise_for_status()
    except Exception as exc:
        # If the webhook call fails we still return the computed data but flag the error.
        raise HTTPException(status_code=502, detail=f"Failed to notify backend: {exc}")

    return {"success": True, "data": payload}
