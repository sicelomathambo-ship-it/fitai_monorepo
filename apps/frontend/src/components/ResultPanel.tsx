import React from 'react'
import Image from 'next/image'
import type { PredictResponse } from '@/lib/types'
import styles from './ResultPanel.module.css'

interface ResultPanelProps {
  result: PredictResponse | null
  loading: boolean
}

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1100&q=80'

const IconFlame = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2s4 4.5 4 9a4 4 0 1 1-8 0c0-2 1-3 1-3s-2 1-2 4a6 6 0 0 0 12 0c0-5.5-7-10-7-10z" />
  </svg>
)

const IconChip = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="6" y="6" width="12" height="12" rx="2" />
    <rect x="9" y="9" width="6" height="6" rx="1" />
    <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
  </svg>
)

const IconLeaf = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 4C12 4 4 9 4 17c0 2 1 3 3 3 8 0 13-5 13-13V4z" />
    <path d="M4 20c4-6 9-9 15-11" />
  </svg>
)

export default function ResultPanel({ result, loading }: ResultPanelProps) {
  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingSpinner} />
        <p>Analysing your workout data...</p>
      </div>
    )
  }

  if (!result) {
    return (
      <div className={styles.placeholder}>
        <div className={styles.placeholderPhotoWrap}>
          <Image
            src={PLACEHOLDER_IMAGE}
            alt="Athlete planning workout"
            fill
            sizes="(max-width: 760px) 100vw, 560px"
            className={styles.placeholderPhoto}
          />
          <div className={styles.placeholderGradient} />
        </div>
        <div className={styles.placeholderBody}>
          <h3>Your plan will appear here</h3>
          <p>
            Choose your goal, experience level, and workout details — then generate
            a personalised plan with calorie prediction, fatigue scoring, AI explanation,
            and recovery nutrition.
          </p>
        </div>
      </div>
    )
  }

  const fatiguePct = Math.min(result.fatigue_score, 100)
  const fatigueColor =
    fatiguePct < 25 ? '#16a34a' :
    fatiguePct < 45 ? '#ca8a04' :
    fatiguePct < 65 ? '#ea580c' : '#dc2626'

  return (
    <div className={styles.results}>
      {/* ── Metrics ── */}
      <div className={`${styles.card} ${styles.metricsCard}`}>
        <div className={styles.cardHeader}>
          <div className={`${styles.cardIcon} ${styles.iconCoral}`}><IconFlame /></div>
          <div>
            <div className={styles.cardTitle}>Predicted Output</div>
            <div className={styles.cardSub}>Powered by Random Forest · R² 0.936</div>
          </div>
        </div>
        <div className={styles.metricsGrid}>
          <div className={styles.metric}>
            <div className={styles.metricLabel}>Calories Burned</div>
            <div className={`${styles.metricValue} ${styles.coral}`}>
              {Math.round(result.calories_burned)}
            </div>
            <div className={styles.metricUnit}>kcal</div>
          </div>
          <div className={styles.metric}>
            <div className={styles.metricLabel}>BMI</div>
            <div className={`${styles.metricValue} ${styles.blue}`}>{result.bmi}</div>
            <div className={styles.metricUnit}>body mass index</div>
          </div>
          <div className={styles.metric}>
            <div className={styles.metricLabel}>Protein Target</div>
            <div className={`${styles.metricValue} ${styles.green}`}>{result.protein_target_g}</div>
            <div className={styles.metricUnit}>grams</div>
          </div>
        </div>

        {/* Fatigue bar */}
        <div className={styles.fatigueWrap}>
          <div className={styles.fatigueHead}>
            <span>Fatigue Score — <strong>{result.fatigue_label}</strong></span>
            <span className={styles.fatigueNum}>{result.fatigue_score.toFixed(1)} / 100</span>
          </div>
          <div className={styles.fatigueTrack}>
            <div
              className={styles.fatigueFill}
              style={{
                width: `${fatiguePct}%`,
                background: `linear-gradient(90deg, #4ade80, ${fatigueColor})`,
              }}
            />
          </div>
          <div className={styles.fatigueMeta}>
            <span style={{ color: result.recovery_ready ? 'var(--success)' : '#dc2626' }}>
              {result.recovery_ready ? '✓ Recovery ready' : '✗ Rest recommended'}
            </span>
            <span>{result.experience_label} · {result.workout_type}</span>
          </div>
        </div>
      </div>

      {/* ── AI Explanation ── */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={`${styles.cardIcon} ${styles.iconBlue}`}><IconChip /></div>
          <div>
            <div className={styles.cardTitle}>AI Explanation</div>
            <div className={styles.cardSub}>LLM explanation layer — Phase C governance</div>
          </div>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.explainBox}>
            <span className={styles.boxTag}>Model Reasoning</span>
            <p>{result.summary}</p>
          </div>
        </div>
      </div>

      {/* ── Recovery ── */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={`${styles.cardIcon} ${styles.iconAmber}`}><IconLeaf /></div>
          <div>
            <div className={styles.cardTitle}>Recovery & Nutrition</div>
            <div className={styles.cardSub}>Post-session recommendations</div>
          </div>
        </div>
        <div className={styles.cardBody}>
          <div className={`${styles.explainBox} ${styles.amberBox}`}>
            <span className={styles.boxTag}>Nutrition Guidance</span>
            <p>{result.nutrition_tip}</p>
          </div>
          <div className={`${styles.explainBox} ${styles.greenBox}`}>
            <span className={styles.boxTag}>Recovery Tip</span>
            <p>{result.recovery_tip}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
