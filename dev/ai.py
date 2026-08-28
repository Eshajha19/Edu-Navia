import os
import random
import warnings
warnings.filterwarnings("ignore")

import pandas as pd
import numpy as np
import pickle

from sklearn.preprocessing import OneHotEncoder, LabelEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score
from xgboost import XGBClassifier

# ------------------- Configuration -------------------
random_seed = 42
random.seed(random_seed)
np.random.seed(random_seed)

dataset_path = "admission_prediction_full_dataset.csv"   # Your dataset
out_path = "cleaned_university_dataset.csv"
model_path = "models.pkl"
encoder_path = "encoders.pkl"

# ------------------- Load Dataset -------------------
if not os.path.exists(dataset_path):
    raise FileNotFoundError("❌ Dataset not found: admission_prediction_full_dataset.csv")

df = pd.read_csv(dataset_path)
print(f"Loaded dataset with shape: {df.shape}")

# ------------------- Validate Required Columns -------------------
required = ["university", "course"]

missing = [c for c in required if c not in df.columns]
if missing:
    raise ValueError(f"❌ Missing required columns: {missing}")

# ------------------- Save Cleaned Dataset -------------------
df.to_csv(out_path, index=False)
print(f"✔ Cleaned dataset saved to {out_path}")

# ------------------- Prepare Features & Targets -------------------
target_columns = ["university", "course"]
feature_cols = [c for c in df.columns if c not in target_columns]

numeric_feats = df[feature_cols].select_dtypes(include=[np.number]).columns.tolist()
cat_feats = [c for c in feature_cols if c not in numeric_feats]

# ------------------- Preprocessing -------------------
numeric_transformer = Pipeline([
    ("imputer", SimpleImputer(strategy="mean")),
    ("scaler", StandardScaler())
])

categorical_transformer = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("onehot", OneHotEncoder(handle_unknown="ignore"))
])

preprocessor = ColumnTransformer([
    ("num", numeric_transformer, numeric_feats),
    ("cat", categorical_transformer, cat_feats)
])

# ------------------- Train Models -------------------
models = {}
label_encoders = {}

for target in target_columns:
    print(f"\n🚀 Training model for: {target}")

    X = df[feature_cols]
    y = df[target].astype(str)

    le = LabelEncoder()
    y_enc = le.fit_transform(y)
    label_encoders[target] = le

    clf = Pipeline([
        ("preprocessor", preprocessor),
        ("xgb", XGBClassifier(
            n_estimators=250,
            max_depth=6,
            learning_rate=0.1,
            eval_metric="mlogloss",
            random_state=random_seed
        ))
    ])

    clf.fit(X, y_enc)
    models[target] = clf

    y_pred = clf.predict(X)
    print(f"✔ Accuracy: {accuracy_score(y_enc, y_pred):.4f}")

# ------------------- Save Models -------------------
with open(model_path, "wb") as f: pickle.dump(models, f)

with open(encoder_path, "wb") as f: pickle.dump(label_encoders, f)

print("\n📁 Models saved to:", model_path)
print("📁 Encoders saved to:", encoder_path)

# ------------------- Recommendation Function -------------------
def recommend(user_input: dict, top_k=5):
    row = {c: user_input.get(c, np.nan) for c in feature_cols}
    X_row = pd.DataFrame([row])
    results = {}

    for target in target_columns:
        clf = models[target]
        le = label_encoders[target]
        proba = clf.predict_proba(X_row)[0]
        top_idx = np.argsort(proba)[::-1][:top_k]
        results[target] = [(le.inverse_transform([i])[0], float(proba[i])) for i in top_idx]
    
    return results

# ------------------- Test Sample -------------------
example = {c: df.iloc[0][c] for c in feature_cols}
print("\n📌 Example prediction:\n")
rec = recommend(example)

for target, values in rec.items():
    print(f"\n🎯 Top predicted {target}:")
    for name, prob in values:
        print(f"  → {name} ({prob:.3f})")
