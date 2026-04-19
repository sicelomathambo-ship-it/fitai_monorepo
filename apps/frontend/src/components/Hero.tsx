import React from 'react'
import Image from 'next/image'
import styles from './Hero.module.css'

interface HeroProps {
  goal: string
  level: string
  age: number
  workoutType: string
}

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1800&q=80'

export default function Hero({ goal, level, age, workoutType }: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.photoWrap}>
        <Image
          src={HERO_IMAGE}
          alt="Athlete training"
          fill
          priority
          sizes="100vw"
          className={styles.photo}
        />
        <div className={styles.overlay} />
      </div>

      <div className={styles.inner}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          AI-Powered Fitness Demo
        </div>
        <h1 className={styles.title}>FitTrack AI</h1>
        <p className={styles.subtitle}>
          Personalized workouts, fatigue-aware coaching, and recovery guidance — powered by your data.
        </p>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <strong>{workoutType || 'Workout'}</strong>
            <span>Type</span>
          </div>
          <div className={styles.stat}>
            <strong>{goal}</strong>
            <span>Goal</span>
          </div>
          <div className={styles.stat}>
            <strong>{level}</strong>
            <span>Level</span>
          </div>
          <div className={styles.stat}>
            <strong>{age}</strong>
            <span>Age</span>
          </div>
        </div>
      </div>
    </section>
  )
}
