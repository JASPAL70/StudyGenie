import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

# Sample CSV from exported plan
df = pd.read_csv("study_plan_log.csv")

# ✅ Completion chart
sns.countplot(data=df, x="Status", palette="Set2")
plt.title("Study Status Overview")
plt.savefig("status_overview.png")

# ✅ Subject frequency
subject_counts = df["Subjects"].str.split(" / ").explode().str.extract(r"(.*?) \(")
subject_counts.columns = ["Subject"]
sns.countplot(data=subject_counts, y="Subject", palette="coolwarm")
plt.title("Subjects Covered")
plt.tight_layout()
plt.savefig("subject_distribution.png")
