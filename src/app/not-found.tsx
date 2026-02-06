import Link from 'next/link'
import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.description}>
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className={styles.actions}>
          <Link href="/" className={styles.primaryButton}>
            Go Home
          </Link>
          <Link href="/tools" className={styles.secondaryButton}>
            Browse Tools
          </Link>
        </div>
      </div>
    </div>
  )
}
