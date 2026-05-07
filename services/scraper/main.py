import os
from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="MeritSync Intelligence Engine", description="Core scraping and AI scoring service")

class ScrapeRequest(BaseModel):
    query: str
    platforms: list[str] = ["workday", "sap", "linkedin"]

class ScoreRequest(BaseModel):
    job_id: str
    candidate_id: str
    resume_text: str
    job_description: str

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "meritsync-intelligence"}

@app.post("/api/scrape")
async def trigger_scrape(request: ScrapeRequest, background_tasks: BackgroundTasks):
    """
    Triggers an asynchronous scraping job across the web.
    """
    # background_tasks.add_task(run_scraper_pipeline, request.query, request.platforms)
    return {"status": "queued", "query": request.query, "message": "Scraping job queued in background."}

@app.post("/api/score")
async def trigger_score(request: ScoreRequest, background_tasks: BackgroundTasks):
    """
    Triggers the AI Gatekeeper to score a candidate against a job.
    """
    # background_tasks.add_task(run_scoring_pipeline, request)
    return {"status": "queued", "job_id": request.job_id, "candidate_id": request.candidate_id}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
