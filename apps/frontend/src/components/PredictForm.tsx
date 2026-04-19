import React, { useState } from 'react'
import type { PredictRequest, WorkoutType, Goal, ExperienceLevel } from '@/lib/types'
import styles from './PredictForm.module.css'

interface PredictFormProps {
  onSubmit: (data: PredictRequest) => void
  loading: boolean
  onFormChange: (field: string, value: string | number) => void
}

const GOALS: Goal[] = ['Muscle Gain', 'Weight Loss', 'General Fitness', 'Endurance', 'Flexibility']
const WORKOUT_TYPES: WorkoutType[] = ['Strength', 'Cardio', 'HIIT', 'CrossFit', 'Yoga']
const EXP_LABELS: Record<ExperienceLevel, string> = { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced' }

export default function PredictForm({ onSubmit, loading, onFormChange }: PredictFormProps) {
  const [form, setForm] = useState<PredictRequest>({
    age: 28, gender: 'Male', weight_kg: 78.0, height_m: 1.78, bmi: 24.6,
    fat_percentage: 18.5, experience_level: 2, goal: 'Muscle Gain',
    resting_bpm: 62, avg_bpm: 148, max_bpm: 182, hrv_ms: 58.3,
    hour_of_day: 7, workout_type: 'Strength', session_duration_hours: 1.25,
    workout_frequency_days_week: 4, water_intake_liters: 2.8,
    time_in_gym_min: 85, idle_time_min: 18, completion_pct: 95.0,
    sleep_hours: 7.5, fatigue_score: 28.4, recovery_ready: 1,
    workout_completed: 1, protein_target_g: 30,
  })

  function set<K extends keyof PredictRequest>(key: K, value: PredictRequest[K]) {
    const updated = { ...form, [key]: value }
    // Auto-compute BMI when weight/height changes
    if (key === 'weight_kg' || key === 'height_m') {
      const w = key === 'weight_kg' ? (value as number) : form.weight_kg
      const h = key === 'height_m'  ? (value as number) : form.height_m
      updated.bmi = parseFloat((w / (h * h)).toFixed(1))
    }
    setForm(updated)
    onFormChange(key, value as string | number)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(form)
  }

  const Seg = ({ keys, labels, active, onChange }: {
    keys: (string | number)[], labels?: string[], active: string | number, onChange: (v: any) => void
  }) => (
    <div className={styles.seg}>
      {keys.map((k, i) => (
        <button key={k} type="button"
          className={`${styles.segBtn} ${active === k ? styles.segActive : ''}`}
          onClick={() => onChange(k)}>
          {labels ? labels[i] : k}
        </button>
      ))}
    </div>
  )

  const Slider = ({ label, id, min, max, step = 1, value, onChange, unit = '' }: {
    label: string; id: string; min: number; max: number; step?: number;
    value: number; onChange: (v: number) => void; unit?: string
  }) => (
    <div className={styles.sliderBlock}>
      <div className={styles.sliderHead}>
        <span>{label}</span>
        <span className={styles.sliderVal}>{typeof value === 'number' ? (step < 1 ? value.toFixed(2) : Math.round(value)) : value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className={styles.slider} />
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formHeader}>
        <div className={styles.formIcon} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6.5 6.5L17.5 17.5" />
            <rect x="2" y="9.5" width="3.5" height="5" rx="1" />
            <rect x="18.5" y="9.5" width="3.5" height="5" rx="1" />
            <rect x="5.5" y="7" width="3" height="10" rx="1" />
            <rect x="15.5" y="7" width="3" height="10" rx="1" />
          </svg>
        </div>
        <div>
          <div className={styles.formTitle}>Build your training plan</div>
          <div className={styles.formSub}>Enter your details for a personalised AI prediction</div>
        </div>
      </div>

      <div className={styles.body}>
        {/* GOAL */}
        <div className={styles.field}>
          <label className={styles.label}>Fitness Goal</label>
          <div className={styles.seg}>
            {GOALS.map(g => (
              <button key={g} type="button"
                className={`${styles.segBtn} ${form.goal === g ? styles.segActive : ''}`}
                onClick={() => { set('goal', g); onFormChange('goal', g) }}>
                {g.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* WORKOUT TYPE */}
        <div className={styles.field}>
          <label className={styles.label}>Workout Type</label>
          <Seg keys={WORKOUT_TYPES} active={form.workout_type}
            onChange={v => { set('workout_type', v); onFormChange('workout_type', v) }} />
        </div>

        {/* EXPERIENCE */}
        <div className={styles.field}>
          <label className={styles.label}>Experience Level</label>
          <Seg keys={[1, 2, 3]} labels={['Beginner', 'Inter.', 'Advanced']}
            active={form.experience_level}
            onChange={v => { set('experience_level', v); onFormChange('experience_level', EXP_LABELS[v as ExperienceLevel]) }} />
        </div>

        {/* GENDER */}
        <div className={styles.field}>
          <label className={styles.label}>Gender</label>
          <Seg keys={['Male', 'Female']} active={form.gender}
            onChange={v => set('gender', v)} />
        </div>

        <div className={styles.divider} />

        {/* SLIDERS - Biometrics */}
        <Slider label="Age" id="age" min={18} max={70} value={form.age}
          onChange={v => { set('age', Math.round(v)); onFormChange('age', Math.round(v)) }} />
        <Slider label="Weight (kg)" id="weight" min={45} max={126} value={form.weight_kg}
          onChange={v => set('weight_kg', Math.round(v))} />
        <Slider label="Height (m)" id="height" min={1.5} max={2.0} step={0.01} value={form.height_m}
          onChange={v => set('height_m', parseFloat(v.toFixed(2)))} />
        <Slider label="Body Fat %" id="fat" min={8} max={40} value={form.fat_percentage}
          onChange={v => set('fat_percentage', parseFloat(v.toFixed(1)))} />

        <div className={styles.divider} />

        {/* SLIDERS - Session */}
        <Slider label="Session Duration (hrs)" id="session" min={0.3} max={2.15} step={0.05} value={form.session_duration_hours}
          onChange={v => set('session_duration_hours', parseFloat(v.toFixed(2)))} />
        <Slider label="Time in Gym (min)" id="gymtime" min={21} max={141} value={form.time_in_gym_min}
          onChange={v => set('time_in_gym_min', Math.round(v))} />
        <Slider label="Idle Time (min)" id="idle" min={0} max={54} value={form.idle_time_min}
          onChange={v => set('idle_time_min', Math.round(v))} />
        <Slider label="Completion %" id="completion" min={60} max={100} step={0.5} value={form.completion_pct}
          onChange={v => set('completion_pct', parseFloat(v.toFixed(1)))} />
        <Slider label="Days/Week" id="freq" min={2} max={6} value={form.workout_frequency_days_week}
          onChange={v => set('workout_frequency_days_week', Math.round(v))} />

        <div className={styles.divider} />

        {/* HEART RATE */}
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.label}>Max BPM</label>
            <input type="number" className={styles.input} value={form.max_bpm} min={116} max={202}
              onChange={e => set('max_bpm', parseInt(e.target.value))} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Avg BPM</label>
            <input type="number" className={styles.input} value={form.avg_bpm} min={106} max={185}
              onChange={e => set('avg_bpm', parseInt(e.target.value))} />
          </div>
        </div>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.label}>Resting BPM</label>
            <input type="number" className={styles.input} value={form.resting_bpm} min={45} max={90}
              onChange={e => set('resting_bpm', parseInt(e.target.value))} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>HRV (ms)</label>
            <input type="number" className={styles.input} value={form.hrv_ms} min={20} max={100} step={0.1}
              onChange={e => set('hrv_ms', parseFloat(e.target.value))} />
          </div>
        </div>

        <div className={styles.divider} />

        {/* RECOVERY */}
        <Slider label="Sleep Hours" id="sleep" min={4} max={10} step={0.25} value={form.sleep_hours}
          onChange={v => set('sleep_hours', parseFloat(v.toFixed(2)))} />
        <Slider label="Fatigue Score" id="fatigue" min={0} max={85.9} step={0.1} value={form.fatigue_score}
          onChange={v => set('fatigue_score', parseFloat(v.toFixed(1)))} />
        <Slider label="Water Intake (L)" id="water" min={0.5} max={5} step={0.5} value={form.water_intake_liters}
          onChange={v => set('water_intake_liters', parseFloat(v.toFixed(1)))} />
        <Slider label="Protein Target (g)" id="protein" min={6} max={55} value={form.protein_target_g}
          onChange={v => set('protein_target_g', Math.round(v))} />

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.label}>Recovery Ready?</label>
            <Seg keys={[1, 0]} labels={['Yes', 'No']} active={form.recovery_ready}
              onChange={v => set('recovery_ready', v)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Workout Completed?</label>
            <Seg keys={[1, 0]} labels={['Yes', 'No']} active={form.workout_completed}
              onChange={v => set('workout_completed', v)} />
          </div>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? (
            <><span className={styles.spinner} /> Generating Plan...</>
          ) : (
            <> Generate Plan →</>
          )}
        </button>
      </div>
    </form>
  )
}
