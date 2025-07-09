from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
import pandas as pd
import random

app = FastAPI()

# Enable CORS for frontend
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
    start_date = datetime.today().replace(hour=0, minute=0, second=0, microsecond=0)
    total_days = (end_date - start_date).days + 1

    if total_days <= 0 or not subjects:
        return {"error": "❌ Invalid target date or subject list."}

    plan = []
    all_subjects = []

    if data.planMode == "day":
        # 👉 Day-wise mode: assign one subject per day (rotating)
        for i in range(total_days):
            date = start_date + timedelta(days=i)
            subject_today = subjects[i % len(subjects)]
            day_plan = {
                "date": date.strftime("%Y-%m-%d"),
                "subjects": [{"name": subject_today, "hours": 1}],
                "status": "Pending",
            }
            plan.append(day_plan)
            all_subjects.append({
                "date": date,
                "subject": subject_today,
                "hours": 1
            })

    else:
        # 👉 Hours-wise mode: assign 2 subjects per day with time split
        for i in range(total_days):
            date = start_date + timedelta(days=i)
            selected = random.sample(subjects, k=min(len(subjects), 2))
            hours_split = round(hours_per_day / len(selected), 2)
            day_plan = {
                "date": date.strftime("%Y-%m-%d"),
                "subjects": [{"name": s, "hours": hours_split} for s in selected],
                "status": "Pending",
            }
            plan.append(day_plan)
            for s in selected:
                all_subjects.append({
                    "date": date,
                    "subject": s,
                    "hours": hours_split
                })

    # 📊 Summary for chart
    df = pd.DataFrame(all_subjects)
    df_summary = df.groupby("subject")["hours"].sum().reset_index()

    return {
        "plan": plan,
        "visualization": {
            "subject_hours": df_summary.to_dict(orient="records")
        }
    }
