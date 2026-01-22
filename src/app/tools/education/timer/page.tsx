"use client";

import { useState, useEffect } from "react";
import styles from "./timer.module.css";
import ToolInfo from "@/components/ToolInfo";

export default function TimerTool() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [inputMinutes, setInputMinutes] = useState("");
  const [inputSeconds, setInputSeconds] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0 && isRunning) {
      setIsRunning(false);
      // Play sound or show notification
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification('Timer Finished!', {
            body: 'Your timer has reached zero.',
            icon: '/favicon.ico'
          });
        }
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const startTimer = () => {
    const minutes = parseInt(inputMinutes) || 0;
    const seconds = parseInt(inputSeconds) || 0;
    const totalSeconds = minutes * 60 + seconds;
    if (totalSeconds > 0) {
      setTime(totalSeconds);
      setIsRunning(true);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
    setInputMinutes("");
    setInputSeconds("");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const requestNotificationPermission = () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission();
    }
  };

  return (
    <main className={styles.container}>
      <section className={styles.tool}>
        <h1 className={styles.title}>
          <span className={styles.icon}>⏱️</span>
          Timer Tool
        </h1>
        <p>Set a countdown timer for your study sessions or tasks.</p>

        <div className={styles.timerDisplay}>
          <div className={styles.timeCircle}>
            <span className={styles.timeText}>{formatTime(time)}</span>
          </div>
        </div>

        <div className={styles.inputSection}>
          <div className={styles.inputGroup}>
            <label htmlFor="minutes">Minutes:</label>
            <input
              id="minutes"
              type="number"
              min="0"
              max="59"
              value={inputMinutes}
              onChange={(e) => setInputMinutes(e.target.value)}
              placeholder="0"
              disabled={isRunning}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="seconds">Seconds:</label>
            <input
              id="seconds"
              type="number"
              min="0"
              max="59"
              value={inputSeconds}
              onChange={(e) => setInputSeconds(e.target.value)}
              placeholder="0"
              disabled={isRunning}
            />
          </div>
        </div>

        <div className={styles.controls}>
          {!isRunning ? (
            <button
              className={styles.startBtn}
              onClick={startTimer}
              disabled={!inputMinutes && !inputSeconds}
            >
              Start Timer
            </button>
          ) : (
            <button className={styles.pauseBtn} onClick={pauseTimer}>
              Pause
            </button>
          )}
          <button className={styles.resetBtn} onClick={resetTimer}>
            Reset
          </button>
        </div>

        <div className={styles.notificationSection}>
          <button
            className={styles.notificationBtn}
            onClick={requestNotificationPermission}
          >
            Enable Notifications
          </button>
          <p className={styles.notificationText}>
            Get notified when your timer finishes
          </p>
        </div>
      </section>

      <ToolInfo
        howItWorks="1. Set minutes and seconds for your timer.<br>2. Click 'Start Timer' to begin countdown.<br>3. Use 'Pause' to temporarily stop the timer.<br>4. Click 'Reset' to clear and start over.<br>5. Enable notifications to get alerts when time runs out."
        faqs={[
          {
            title: "Can I use this for study sessions?",
            content: "Yes! Set timers for Pomodoro technique (25 minutes work + 5 minutes break) or any study duration you need."
          },
          {
            title: "Do notifications work on mobile?",
            content: "Yes, browser notifications work on both desktop and mobile devices when permission is granted."
          },
          {
            title: "What's the maximum time I can set?",
            content: "You can set up to 59 minutes and 59 seconds. For longer durations, consider using multiple timers."
          }
        ]}
        tips={[
          "Use the Pomodoro Technique: 25 minutes focused work followed by a 5-minute break",
          "Set shorter timers for difficult tasks to maintain focus",
          "Enable notifications to stay on track even when working in other tabs",
          "Combine with our Notes Organizer for structured study sessions"
        ]}
      />
    </main>
  );
}