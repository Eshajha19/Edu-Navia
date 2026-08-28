import pandas as pd
import numpy as np
import random

random.seed(42)
np.random.seed(42)

# Lists (IITs and AIIMS from datasets)
iits = [
    "IIT Madras", "IIT Bombay", "IIT Delhi", "IIT Kanpur", "IIT Kharagpur", "IIT Roorkee",
    "IIT Guwahati", "IIT BHU Varanasi", "IIT Hyderabad", "IIT Indore", "IIT Gandhinagar",
    "IIT Ropar", "IIT Bhubaneswar", "IIT Patna", "IIT Jodhpur", "IIT Mandi",
    "IIT Jammu", "IIT Tirupati", "IIT Palakkad", "IIT Dharwad", "IIT Bhilai", "IIT Goa", "IIT (ISM) Dhanbad"
]

aiims = [
    "AIIMS New Delhi", "AIIMS Bhopal", "AIIMS Bhubaneswar", "AIIMS Jodhpur", "AIIMS Patna",
    "AIIMS Raipur", "AIIMS Rishikesh", "AIIMS Raebareli", "AIIMS Mangalagiri", "AIIMS Bibinagar",
    "AIIMS Gorakhpur", "AIIMS Kalyani", "AIIMS Nagpur", "AIIMS Bathinda", "AIIMS Deoghar",
    "AIIMS Guwahati", "AIIMS Rewari", "AIIMS Bilaspur", "AIIMS Madurai", "AIIMS Rajkot",
    "AIIMS Kottayam", "AIIMS Manipur", "AIIMS, Karnataka", "AIIMS Kerala"
]

while len(aiims) < 50:
    aiims.append(f"AIIMS Satellite Campus {len(aiims)+1}")

additional_colleges = []
states = ["Delhi","Maharashtra","Tamil Nadu","Karnataka","West Bengal","Uttar Pradesh","Gujarat","Rajasthan","Punjab","Kerala","Telangana","Odisha","Bihar","Haryana","Jharkhand"]

for i in range(1,101):
    typ = random.choice(["NIT","Government Engineering College","State University","Private University","Deemed University","Institute of Technology"])
    name = f"{typ} {i}"
    additional_colleges.append(name)

university_pool = iits + aiims + additional_colleges

entrance_exams = ["JEE Main", "JEE Advanced", "NEET UG", "CUET", "MHT-CET", "KCET", "COMEDK", "CLAT", "NID", "NIFT", "State CET"]
streams = ["Engineering", "Medical", "Commerce", "Arts", "Science", "Design", "Law"]

courses_by_stream = {
    "Engineering": ["B.Tech CSE", "B.Tech ECE", "B.Tech Mechanical", "B.Tech Civil", "B.Tech Chemical"],
    "Medical": ["MBBS", "BDS", "BSc Nursing"],
    "Commerce": ["B.Com", "BBA", "BMS"],
    "Arts": ["BA English", "BA Economics", "BA History"],
    "Science": ["BSc Physics", "BSc Chemistry", "BSc Biology", "BSc Mathematics"],
    "Design": ["B.Des", "BFA"],
    "Law": ["LLB", "BA LLB"]
}

categories = ["General", "OBC", "SC", "ST", "EWS", "PwD"]
quotas = ["Home State", "Other State", "Institute Quota", "Management Quota", "EWS"]

rows = 3000
data = {
    "student_id": [f"S{100000+i}" for i in range(rows)],
    "year": np.random.choice([2021,2022,2023,2024,2025], size=rows, p=[0.15,0.2,0.25,0.25,0.15]),
    "entrance_exam": np.random.choice(entrance_exams, size=rows),
    "stream": np.random.choice(streams, size=rows),
    "university": np.random.choice(university_pool, size=rows),
    "category": np.random.choice(categories, size=rows, p=[0.5,0.2,0.12,0.08,0.08,0.02]),
    "quota": np.random.choice(quotas, size=rows),
    "state": np.random.choice(states, size=rows),
    "class12_marks": np.random.normal(loc=78, scale=8, size=rows).clip(50,100).round(2),
    "entrance_score": np.random.normal(loc=72, scale=15, size=rows).clip(0,100).round(2),
    "rank": np.random.randint(1,200000, size=rows),
    "fees_per_year": np.random.choice([5000,10000,20000,50000,100000,200000], size=rows, p=[0.15,0.2,0.25,0.2,0.15,0.05])
}

df = pd.DataFrame(data)

def choose_course(row):
    s = row["stream"]
    return random.choice(courses_by_stream[s])

df["course"] = df.apply(choose_course, axis=1)

unique_keys = df[["university","course","year","category"]].drop_duplicates().reset_index(drop=True)
unique_keys["closing_rank"] = np.random.randint(50,150000, size=len(unique_keys))
df = df.merge(unique_keys, on=["university","course","year","category"], how="left")

df["admitted"] = ((df["rank"] <= df["closing_rank"]) & (df["entrance_score"] >= 30)).astype(int)

df = df.sample(frac=1, random_state=42).reset_index(drop=True)

# FIXED SAVE PATH
file_path = r"C:\Users\Eshita Jha\OneDrive\Documents\edunavigator\admission_prediction_full_dataset.csv"
df.to_csv(file_path, index=False)

print("\n📁 File successfully saved at:", file_path)
print("\n🔍 Preview:\n", df.head())