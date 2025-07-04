from datetime import datetime, timedelta
from collections import defaultdict
from utils.rescheduler import reschedule_plan

@app.post("/rebalance-plan")
def rebalance_endpoint(payload: dict):
    """
    Expects payload = { "plan": [ {date, subjects, status}, ... ] }
    """
    new_plan = reschedule_plan(payload["plan"])
    return {"plan": new_plan}

def reschedule_plan(plan: list, revision_interval=6):
    """
    :param plan: list of dicts [{date, subjects: [name, hours], status}]
    :return: new_plan
    """
    subject_queue = []
    date_map = defaultdict(list)

    for item in plan:
        date_map[item["date"]].extend(item["subjects"])
        if item["status"] == "Skipped":
            subject_queue.extend(item["subjects"])

    sorted_dates = sorted(date_map.keys())
    new_plan = []

    for i, date_str in enumerate(sorted_dates):
        subjects_today = date_map[date_str]

        # Insert revision every nth day
        if (i + 1) % revision_interval == 0:
            new_plan.append({
                "date": date_str,
                "subjects": [{"name": "Revision", "hours": 1.5}],
                "status": "Pending"
            })
        else:
            # Fill skipped ones first
            fill_today = []
            while subject_queue and len(fill_today) < len(subjects_today):
                fill_today.append(subject_queue.pop(0))
            remaining = subjects_today[len(fill_today):]
            final_subjects = fill_today + remaining

            new_plan.append({
                "date": date_str,
                "subjects": final_subjects,
                "status": "Pending"
            })

    return new_plan
