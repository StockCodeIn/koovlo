'use client'

import { useEffect } from 'react'
import styles from './error.module.css'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error boundary caught:', error)
  }, [error])

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <svg
            className={styles.icon}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className={styles.title}>Something went wrong!</h1>
        <p className={styles.description}>
          We&apos;re sorry for the inconvenience. An unexpected error has occurred.
        </p>
        {error.message && (
          <div className={styles.errorMessage}>
            <p className={styles.errorText}>{error.message}</p>
          </div>
        )}
        <div className={styles.actions}>
          <button onClick={reset} className={styles.primaryButton}>
            Try Again
          </button>
          <a href="/" className={styles.secondaryButton}>
            Go Home
          </a>
        </div>
      </div>
    </div>
  )
}
