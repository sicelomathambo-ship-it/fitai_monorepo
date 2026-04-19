// Matches apps/backend/app/schemas.py exactly

export type Gender        = 'Male' | 'Female'
export type WorkoutType   = 'Cardio' | 'CrossFit' | 'HIIT' | 'Strength' | 'Yoga'
export type Goal          = 'Muscle Gain' | 'Weight Loss' | 'General Fitness' | 'Endurance' | 'Flexibility'
export type ExperienceLevel = 1 | 2 | 3
export type FatigueLabel  = 'Low' | 'Moderate' | 'High' | 'Very High'

export interface PredictRequest {
  // Biometrics
  age:              number
  gender:           Gender
  weight_kg:        number
  height_m:         number
  bmi:              number
  fat_percentage:   number
  experience_level: ExperienceLevel
  // Goal & Heart Rate
  goal:             Goal
  resting_bpm:      number
  avg_bpm:          number
  max_bpm:          number
  hrv_ms:           number
  // Session
  hour_of_day:                  number
  workout_type:                 WorkoutType
  session_duration_hours:       number
  workout_frequency_days_week:  number
  water_intake_liters:          number
  time_in_gym_min:              number
  idle_time_min:                number
  completion_pct:               number
  // Recovery
  sleep_hours:       number
  fatigue_score:     number
  recovery_ready:    0 | 1
  workout_completed: 0 | 1
  protein_target_g:  number
}

export interface PredictResponse {
  calories_burned:   number
  bmi:               number
  fatigue_score:     number
  fatigue_label:     FatigueLabel
  recovery_ready:    boolean
  protein_target_g:  number
  experience_label:  string
  workout_type:      string
  goal:              string
  summary:           string
  nutrition_tip:     string
  recovery_tip:      string
}

export interface ApiError {
  detail: string
}
