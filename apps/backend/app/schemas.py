from pydantic import BaseModel, Field, field_validator
from typing import Literal
from enum import IntEnum


class ExperienceLevel(IntEnum):
    BEGINNER     = 1
    INTERMEDIATE = 2
    ADVANCED     = 3


class PredictRequest(BaseModel):
    # ── Biometrics ──────────────────────────────────────────────
    age:             int   = Field(..., ge=18, le=70,   example=28)
    gender:          Literal["Male", "Female"]          = Field(..., example="Male")
    weight_kg:       float = Field(..., ge=40, le=130,  example=78.0)
    height_m:        float = Field(..., ge=1.5, le=2.0, example=1.78)
    bmi:             float = Field(..., ge=10, le=50,   example=24.6)
    fat_percentage:  float = Field(..., ge=8, le=40,    example=18.5)
    experience_level: ExperienceLevel = Field(..., example=2)

    # ── Goal & Heart Rate ────────────────────────────────────────
    goal: Literal[
        "Muscle Gain", "Weight Loss", "General Fitness",
        "Endurance", "Flexibility"
    ] = Field(..., example="Muscle Gain")
    resting_bpm: int   = Field(..., ge=45, le=90,   example=62)
    avg_bpm:     int   = Field(..., ge=106, le=185, example=148)
    max_bpm:     int   = Field(..., ge=116, le=202, example=182)
    hrv_ms:      float = Field(..., ge=20, le=100,  example=58.3)

    # ── Session details ──────────────────────────────────────────
    hour_of_day:                int   = Field(..., ge=6, le=21,   example=7)
    workout_type: Literal["Cardio", "CrossFit", "HIIT", "Strength", "Yoga"] = Field(..., example="Strength")
    session_duration_hours:     float = Field(..., ge=0.3, le=2.15, example=1.25)
    workout_frequency_days_week: int  = Field(..., ge=2, le=6,    example=4)
    water_intake_liters:        float = Field(..., ge=0.5, le=5.0, example=2.8)
    time_in_gym_min:            int   = Field(..., ge=21, le=141,  example=85)
    idle_time_min:              int   = Field(..., ge=0, le=54,    example=18)
    completion_pct:             float = Field(..., ge=59.7, le=100, example=95.0)

    # ── Recovery & lifestyle ─────────────────────────────────────
    sleep_hours:      float = Field(..., ge=4.0, le=10.0, example=7.5)
    fatigue_score:    float = Field(..., ge=0.0, le=85.9, example=28.4)
    recovery_ready:   int   = Field(..., ge=0, le=1,      example=1)
    workout_completed: int  = Field(..., ge=0, le=1,      example=1)
    protein_target_g: int   = Field(..., ge=6, le=55,     example=30)

    @field_validator("avg_bpm")
    @classmethod
    def avg_below_max(cls, v, info):
        if "max_bpm" in info.data and v >= info.data["max_bpm"]:
            raise ValueError("avg_bpm must be less than max_bpm")
        return v

    @field_validator("resting_bpm")
    @classmethod
    def resting_below_avg(cls, v, info):
        if "avg_bpm" in info.data and v >= info.data["avg_bpm"]:
            raise ValueError("resting_bpm must be less than avg_bpm")
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "age": 28, "gender": "Male", "weight_kg": 78.0, "height_m": 1.78,
                "bmi": 24.6, "fat_percentage": 18.5, "experience_level": 2,
                "goal": "Muscle Gain", "resting_bpm": 62, "avg_bpm": 148,
                "max_bpm": 182, "hrv_ms": 58.3, "hour_of_day": 7,
                "workout_type": "Strength", "session_duration_hours": 1.25,
                "workout_frequency_days_week": 4, "water_intake_liters": 2.8,
                "time_in_gym_min": 85, "idle_time_min": 18, "completion_pct": 95.0,
                "sleep_hours": 7.5, "fatigue_score": 28.4, "recovery_ready": 1,
                "workout_completed": 1, "protein_target_g": 30,
            }
        }


class PredictResponse(BaseModel):
    calories_burned:   float  = Field(..., description="Predicted kcal burned")
    bmi:               float  = Field(..., description="Calculated BMI")
    fatigue_score:     float  = Field(..., description="Fatigue index 0–100")
    fatigue_label:     Literal["Low", "Moderate", "High", "Very High"]
    recovery_ready:    bool   = Field(..., description="Ready to train again?")
    protein_target_g:  int    = Field(..., description="Recommended protein (g)")
    experience_label:  str
    workout_type:      str
    goal:              str
    summary:           str    = Field(..., description="AI explanation")
    nutrition_tip:     str
    recovery_tip:      str
