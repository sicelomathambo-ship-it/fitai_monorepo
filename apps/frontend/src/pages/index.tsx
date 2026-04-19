import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import PredictForm from '@/components/PredictForm'
import ResultPanel from '@/components/ResultPanel'
import type { PredictRequest, PredictResponse } from '@/lib/types'
import { predictCalories } from '@/lib/api'
import styles from '@/styles/Home.module.css'

const SHOWCASE_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80',
    alt: 'Heavy lifting session',
    tag: 'Strength',
  },
  {
    src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=80',
    alt: 'High-intensity workout',
    tag: 'HIIT',
  },
  {
    src: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=80',
    alt: 'Yoga and mobility',
    tag: 'Recovery',
  },
]

const WHY_CARDS = [
  {
    title: 'Tailored workout plan',
    body: 'Prediction based on 31 features: your goal, experience, biometrics, HRV, sleep, and session data.',
    image:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Fatigue score',
    body: 'Real fatigue index from the dataset — not a heuristic. Visualised for quick training decisions.',
    image:
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Recovery nutrition',
    body: 'Protein targets and recovery tips calibrated to actual predicted kcal burned.',
    image:
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=700&q=80',
  },
]

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'profile'>('dashboard')
  const [result, setResult] = useState<PredictResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [heroGoal, setHeroGoal] = useState('Muscle Gain')
  const [heroLevel, setHeroLevel] = useState('Intermediate')
  const [heroAge, setHeroAge] = useState(28)
  const [heroWorkout, setHeroWorkout] = useState('Strength')

  function handleFormChange(field: string, value: string | number) {
    if (field === 'goal') setHeroGoal(String(value))
    if (field === 'experience_level') setHeroLevel(String(value))
    if (field === 'age') setHeroAge(Number(value))
    if (field === 'workout_type') setHeroWorkout(String(value))
  }

  async function handleSubmit(data: PredictRequest) {
    setLoading(true)
    setError(null)
    try {
      const res = await predictCalories(data)
      setResult(res)
    } catch (err: any) {
      setError(err.message || 'Prediction failed. Check backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>FitTrack AI — Coral Athletic</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <Hero
        goal={heroGoal}
        level={heroLevel}
        age={heroAge}
        workoutType={heroWorkout}
      />

      <main className={styles.main}>
        <div className={styles.container}>

          {/* Showcase strip */}
          <div className={styles.showcase}>
            {SHOWCASE_IMAGES.map((img) => (
              <div key={img.alt} className={styles.showcaseTile}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 760px) 100vw, 300px"
                  className={styles.showcaseImg}
                />
                <div className={styles.showcaseGradient} />
                <span className={styles.showcaseTag}>{img.tag}</span>
              </div>
            ))}
          </div>

          {error && (
            <div className={styles.errorBanner}>
              ⚠ {error}
            </div>
          )}

          <div className={styles.grid}>
            <div className={`${styles.formCol} fade-up`}>
              <PredictForm
                onSubmit={handleSubmit}
                loading={loading}
                onFormChange={handleFormChange}
              />
            </div>

            <div className={`${styles.resultCol} fade-up delay-2`}>
              <ResultPanel result={result} loading={loading} />
            </div>
          </div>

          {/* Why Section */}
          <div className={styles.why}>
            <h2 className={styles.whyTitle}>Why FitTrack AI?</h2>
            <p className={styles.whyIntro}>
              Stop guessing how hard to train. FitTrack AI reads 31 signals from your body
              and your session — goal, biometrics, heart rate, HRV, sleep, and recovery —
              and turns them into a plan that flexes with you. Train harder on the right days,
              back off on the wrong ones, and see exactly why every time.
            </p>

            <div className={styles.whyGrid}>
              {WHY_CARDS.map((card) => (
                <div key={card.title} className={styles.whyCard}>
                  <div className={styles.whyImageWrap}>
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(max-width: 760px) 100vw, 230px"
                      className={styles.whyImage}
                    />
                    <div className={styles.whyImageGradient} />
                  </div>
                  <div className={styles.whyCardBody}>
                    <h3>{card.title}</h3>
                    <p>{card.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </>
  )
}
