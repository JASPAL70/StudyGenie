from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from datetime import datetime, timedelta

app = FastAPI()

# Allow all origins (React & Node)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PlanRequest(BaseModel):
    goal: str
    subjects: List[str]
    hoursPerDay: int
    targetDate: str  # YYYY-MM-DD

@app.post("/ml/generate-plan")
def generate_plan(req: PlanRequest):
    start_date = datetime.now().date()
    end_date = datetime.strptime(req.targetDate, "%Y-%m-%d").date()
    total_days = (end_date - start_date).days

    if total_days < len(req.subjects):
        return {"error": "Not enough days to cover all subjects"}

    daily_plan = []
    days_per_subject = total_days // len(req.subjects)
    current_day = start_date

    for subject in req.subjects:
        for _ in range(days_per_subject):
            daily_plan.append({
                "date": str(current_day),
                "subject": subject,
                "topic": f"Topic of {subject}",
                "hours": req.hoursPerDay,
                "status": "Pending"
            })
            current_day += timedelta(days=1)

    return {
        "goal": req.goal,
        "totalDays": total_days,
        "plan": daily_plan
    }
