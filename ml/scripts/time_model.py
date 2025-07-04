import pandas as pd
import pickle
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

# 📊 Sample dataset (replace this with real training data later)
data = pd.DataFrame({
    "difficulty": [1, 2, 3, 4, 5, 2, 4],
    "target_score": [70, 75, 80, 85, 90, 70, 88],
    "past_avg_time": [1.0, 1.5, 2.0, 2.8, 3.5, 1.2, 3.0],
    "hours_needed": [1.5, 2, 3, 4.5, 5.5, 2, 5]
})

X = data[["difficulty", "target_score", "past_avg_time"]]
y = data["hours_needed"]

# ✅ Train linear regression
model = LinearRegression()
model.fit(X, y)

# 💾 Save model
with open("../models/time_predictor.pkl", "wb") as f:
    pickle.dump(model, f)

print("✅ Model trained and saved to time_predictor.pkl")
