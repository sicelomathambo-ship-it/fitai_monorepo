from app.schemas import PredictRequest, PredictResponse
from app.services.model_service import model_service

EXPERIENCE_LABELS = {1: "Beginner", 2: "Intermediate", 3: "Advanced"}


def fatigue_label(score: float) -> str:
    if score < 25:   return "Low"
    if score < 45:   return "Moderate"
    if score < 65:   return "High"
    return "Very High"


def build_summary(req: PredictRequest, calories: float) -> str:
    exp = EXPERIENCE_LABELS[int(req.experience_level)]
    effort_pct = round(req.avg_bpm / req.max_bpm * 100)
    return (
        f"Based on your {req.session_duration_hours:.2f}h {req.workout_type} session "
        f"at {req.avg_bpm} BPM avg ({effort_pct}% of max), the model predicts "
        f"{round(calories)} kcal burned. "
        f"As a {exp.lower()} athlete ({req.weight_kg}kg, BMI {req.bmi}) "
        f"training {req.workout_frequency_days_week}x/week for {req.goal.lower()}, "
        f"your fatigue index is {req.fatigue_score:.1f}/100 — "
        f"{fatigue_label(req.fatigue_score).lower()}. "
        f"HRV of {req.hrv_ms:.1f}ms and {req.sleep_hours:.1f}h sleep recorded."
    )


def build_nutrition_tip(calories: float, protein_g: int, goal: str) -> str:
    cal = round(calories)
    if cal > 700:
        return (
            f"High-output session ({cal} kcal). Hit {protein_g}g protein within 45 min — "
            f"grilled chicken + rice, whey shake + banana, or eggs + wholegrain toast. "
            f"Rehydrate with 700ml+ water and add electrolytes if you trained in heat."
        )
    if cal > 400:
        return (
            f"Solid session ({cal} kcal). Target {protein_g}g protein within 60 min. "
            f"Greek yoghurt with oats, a protein smoothie, or cottage cheese with fruit all work. "
            f"Drink at least 500ml water."
        )
    return (
        f"Lighter session ({cal} kcal). A snack with ~{protein_g}g protein — "
        f"mixed nuts, cottage cheese, or a small shake — will support recovery. "
        f"Drink 400ml water minimum."
    )


def build_recovery_tip(fatigue: float, recovery_ready: int, sleep_h: float) -> str:
    label = fatigue_label(fatigue)
    sleep_note = " Your sleep was below optimal — prioritise 7–9h tonight." if sleep_h < 6.5 else ""
    if fatigue >= 65:
        return (
            f"Very high fatigue ({fatigue:.1f}/100). Full rest day recommended. "
            f"Focus on sleep, light stretching, and nutrition. "
            f"Avoid back-to-back high-intensity sessions.{sleep_note}"
        )
    if fatigue >= 45:
        return (
            f"High fatigue ({fatigue:.1f}/100). Active recovery next session — "
            f"yoga, walking, or mobility work. Ensure 8h sleep.{sleep_note}"
        )
    if fatigue >= 25:
        return (
            f"Moderate fatigue ({fatigue:.1f}/100). Training load is manageable. "
            f"Consider a deload week every 4–6 weeks.{sleep_note}"
        )
    return (
        f"Low fatigue ({fatigue:.1f}/100). Body is handling load well. "
        f"You can safely increase intensity or add a training day.{sleep_note}"
    )


def run_prediction(req: PredictRequest) -> PredictResponse:
    data     = req.model_dump()
    calories = model_service.predict(data)

    return PredictResponse(
        calories_burned  = round(calories, 1),
        bmi              = req.bmi,
        fatigue_score    = req.fatigue_score,
        fatigue_label    = fatigue_label(req.fatigue_score),
        recovery_ready   = bool(req.recovery_ready),
        protein_target_g = req.protein_target_g,
        experience_label = EXPERIENCE_LABELS[int(req.experience_level)],
        workout_type     = req.workout_type,
        goal             = req.goal,
        summary          = build_summary(req, calories),
        nutrition_tip    = build_nutrition_tip(calories, req.protein_target_g, req.goal),
        recovery_tip     = build_recovery_tip(req.fatigue_score, req.recovery_ready, req.sleep_hours),
    )
