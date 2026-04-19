import joblib
import pandas as pd
from pathlib import Path
from app.config import settings
import logging

logger = logging.getLogger(__name__)

# Exact column order produced by pd.get_dummies(drop_first=True)
# on fittrack_ai_dataset.csv after dropping session_date, muscles_trained,
# cumulative_load_7d_kcal, and calories_burned.
FEATURE_COLUMNS = [
    "age",
    "weight_kg",
    "height_m",
    "bmi",
    "fat_percentage",
    "experience_level",
    "resting_bpm",
    "avg_bpm",
    "max_bpm",
    "hrv_ms",
    "hour_of_day",
    "session_duration_hours",
    "workout_frequency_days_week",
    "water_intake_liters",
    "time_in_gym_min",
    "idle_time_min",
    "completion_pct",
    "sleep_hours",
    "fatigue_score",
    "recovery_ready",
    "workout_completed",
    "protein_target_g",
    "gender_Male",
    "goal_Flexibility",
    "goal_General Fitness",
    "goal_Muscle Gain",
    "goal_Weight Loss",
    "workout_type_CrossFit",
    "workout_type_HIIT",
    "workout_type_Strength",
    "workout_type_Yoga",
]


class ModelService:
    def __init__(self):
        self.model = None
        self.model_path: Path = settings.MODEL_PATH
        self._load()

    def _load(self):
        if self.model_path.exists():
            try:
                self.model = joblib.load(self.model_path)
                logger.info(f"Model loaded from {self.model_path}")
            except Exception as e:
                logger.error(f"Failed to load model: {e}")
        else:
            logger.warning(
                f"Model not found at {self.model_path}. "
                "Run scripts/train.py to generate it."
            )

    def is_loaded(self) -> bool:
        return self.model is not None

    def build_features(self, data: dict) -> pd.DataFrame:
        row = {
            "age":                          data["age"],
            "weight_kg":                    data["weight_kg"],
            "height_m":                     data["height_m"],
            "bmi":                          data["bmi"],
            "fat_percentage":               data["fat_percentage"],
            "experience_level":             int(data["experience_level"]),
            "resting_bpm":                  data["resting_bpm"],
            "avg_bpm":                      data["avg_bpm"],
            "max_bpm":                      data["max_bpm"],
            "hrv_ms":                       data["hrv_ms"],
            "hour_of_day":                  data["hour_of_day"],
            "session_duration_hours":       data["session_duration_hours"],
            "workout_frequency_days_week":  data["workout_frequency_days_week"],
            "water_intake_liters":          data["water_intake_liters"],
            "time_in_gym_min":              data["time_in_gym_min"],
            "idle_time_min":                data["idle_time_min"],
            "completion_pct":               data["completion_pct"],
            "sleep_hours":                  data["sleep_hours"],
            "fatigue_score":                data["fatigue_score"],
            "recovery_ready":               data["recovery_ready"],
            "workout_completed":            data["workout_completed"],
            "protein_target_g":             data["protein_target_g"],
            # One-hot encoded
            "gender_Male":                  1 if data["gender"] == "Male" else 0,
            "goal_Flexibility":             1 if data["goal"] == "Flexibility" else 0,
            "goal_General Fitness":         1 if data["goal"] == "General Fitness" else 0,
            "goal_Muscle Gain":             1 if data["goal"] == "Muscle Gain" else 0,
            "goal_Weight Loss":             1 if data["goal"] == "Weight Loss" else 0,
            "workout_type_CrossFit":        1 if data["workout_type"] == "CrossFit" else 0,
            "workout_type_HIIT":            1 if data["workout_type"] == "HIIT" else 0,
            "workout_type_Strength":        1 if data["workout_type"] == "Strength" else 0,
            "workout_type_Yoga":            1 if data["workout_type"] == "Yoga" else 0,
        }
        return pd.DataFrame([row], columns=FEATURE_COLUMNS)

    def predict(self, data: dict) -> float:
        if not self.is_loaded():
            raise RuntimeError("Model not loaded")
        X = self.build_features(data)
        return float(self.model.predict(X)[0])


model_service = ModelService()
