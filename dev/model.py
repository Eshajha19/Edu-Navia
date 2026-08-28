import os
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from preprocessing import load_and_preprocess_data

def train_and_save_models(csv_path):
    print("Starting ML Pipeline...")
    print("1. Cleaning and preparing data...")
    # Use load_and_preprocess_data which also handles missing data, mapping, and saving encoders
    X, y_course, y_univ, le_stream, le_course, le_univ = load_and_preprocess_data(csv_path)

    # 2. Train/Test split for evaluation (80/20 as requested)
    print("2. Splitting database (80% Train, 20% Evaluate)...")
    X_train, X_test, y_train_course, y_test_course, y_train_univ, y_test_univ = train_test_split(
        X, y_course, y_univ, test_size=0.2, random_state=42
    )

    # 3. Build artificial intelligence - two independent outputs
    # Model 1: Course Predictor
    print("3. Training Course Model (Random Forest)...")
    course_model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced')
    course_model.fit(X_train, y_train_course)

    course_preds = course_model.predict(X_test)
    print(f"   -> Course Predictor Accuracy: {accuracy_score(y_test_course, course_preds) * 100:.2f}%")

    # Model 2: University Predictor
    print("4. Training University Model (Random Forest)...")
    univ_model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced')
    univ_model.fit(X_train, y_train_univ)

    univ_preds = univ_model.predict(X_test)
    print(f"   -> University Predictor Accuracy: {accuracy_score(y_test_univ, univ_preds) * 100:.2f}%")

    # 4. Model Saving
    # Ensures the models load instantly without re-training in production
    print("5. Saving core models to disk...")
    os.makedirs('models', exist_ok=True)
    joblib.dump(course_model, 'models/course_model.pkl')
    joblib.dump(univ_model, 'models/univ_model.pkl')
    print("✅ Models successfully serialized in 'models/' directory. Ready for production.")


if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    csv_location = os.path.join(current_dir, 'cleaned_university_dataset.csv')
    train_and_save_models(csv_location)
