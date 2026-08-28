import firebase_admin
from firebase_admin import credentials, firestore
import json
from google.cloud.firestore import DocumentReference
from datetime import datetime

print("🔥 Connecting to Firestore...")

cred = credentials.Certificate("serviceAccount.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

def clean_data(data):
    if isinstance(data, dict):
        return {k: clean_data(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [clean_data(item) for item in data]
    elif hasattr(data, "timestamp"):  # Firestore timestamp
        return data.isoformat()
    elif isinstance(data, datetime):
        return data.isoformat()
    elif isinstance(data, DocumentReference):
        return str(data.path)  # convert reference to string
    return data

def export_firestore():
    output = {}
    
    for collection in db.collections():
        print(f"📁 Exporting collection: {collection.id}")
        docs = collection.stream()
        output[collection.id] = {}
        
        for doc in docs:
            cleaned_doc = clean_data(doc.to_dict())
            output[collection.id][doc.id] = cleaned_doc

    with open("firestore_backup.json", "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print("\n✅ Backup Completed! File saved as: firestore_backup.json")

export_firestore()
