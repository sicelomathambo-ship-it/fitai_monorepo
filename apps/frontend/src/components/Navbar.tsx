import React from 'react'
import styles from './Navbar.module.css'

interface NavbarProps {
  activeTab: 'dashboard' | 'history' | 'profile'
  onTabChange: (tab: 'dashboard' | 'history' | 'profile') => void
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <div className={styles.logoMark}>F</div>
        <span>Fit<span className={styles.logoAccent}>Track</span> AI</span>
      </div>

      <div className={styles.tabs}>
        {(['dashboard', 'history', 'profile'] as const).map(tab => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
            onClick={() => onTabChange(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.pill}>
        <span className={styles.pillDot} />
        AI-Powered
      </div>
    </nav>
  )
}
