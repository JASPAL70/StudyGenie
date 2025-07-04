from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
import pandas as pd
import random

app = FastAPI()

# Enable CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class PlanRequest(BaseModel):
    goal: str
    subjects: list[str]
    hoursPerDay: int
    targetDate: str
    planMode: str  # 'hours' or 'day'

@app.post("/generate-plan")
def generate_plan(data: PlanRequest):
    subjects = data.subjects
    hours_per_day = data.hoursPerDay
    end_date = datetime.strptime(data.targetDate, "%Y-%m-%d")
    start_date = datetime.today()
    days = (end_date - start_date).days

    if days <= 0 or not subjects:
        return {"error": "❌ Invalid target date or subject list."}

    plan = []
    all_subjects = []

    for i in range(days):
        today = start_date + timedelta(days=i)
        selected = random.sample(subjects, k=min(len(subjects), 2))
        day_plan = {
            "date": today.strftime("%Y-%m-%d"),
            "subjects": [{"name": s, "hours": round(hours_per_day / len(selected), 2)} for s in selected],
            "status": "Pending",
        }
        plan.append(day_plan)
        for s in selected:
            all_subjects.append({"date": today, "subject": s, "hours": round(hours_per_day / len(selected), 2)})

    # 🔍 Visualization using pandas
    df = pd.DataFrame(all_subjects)
    df_summary = df.groupby("subject")["hours"].sum().reset_index()

    # Return both plan and visualization
    return {
        "plan": plan,
        "visualization": {
            "subject_hours": df_summary.to_dict(orient="records")
        }
    }
