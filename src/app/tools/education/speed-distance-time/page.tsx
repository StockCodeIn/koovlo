"use client";

import { useState } from "react";
import styles from "./speed-distance-time.module.css";
import ToolInfo from "@/components/ToolInfo";

export default function SpeedDistanceTimeCalculator() {
  const [speed, setSpeed] = useState("");
  const [distance, setDistance] = useState("");
  const [time, setTime] = useState("");
  const [speedUnit, setSpeedUnit] = useState("km/h");
  const [distanceUnit, setDistanceUnit] = useState("km");
  const [timeUnit, setTimeUnit] = useState("hours");

  const calculateMissingValue = () => {
    const s = parseFloat(speed);
    const d = parseFloat(distance);
    const t = parseFloat(time);

    // Convert all to consistent units for calculation
    let speedMps = 0; // meters per second
    let distanceM = 0; // meters
    let timeS = 0; // seconds

    // Convert speed to m/s
    if (!isNaN(s)) {
      switch (speedUnit) {
        case "km/h":
          speedMps = s / 3.6;
          break;
        case "m/s":
          speedMps = s;
          break;
        case "mph":
          speedMps = s / 2.237;
          break;
      }
    }

    // Convert distance to meters
    if (!isNaN(d)) {
      switch (distanceUnit) {
        case "km":
          distanceM = d * 1000;
          break;
        case "m":
          distanceM = d;
          break;
        case "miles":
          distanceM = d * 1609.34;
          break;
      }
    }

    // Convert time to seconds
    if (!isNaN(t)) {
      switch (timeUnit) {
        case "hours":
          timeS = t * 3600;
          break;
        case "minutes":
          timeS = t * 60;
          break;
        case "seconds":
          timeS = t;
          break;
      }
    }

    // Calculate missing value
    if (speed === "" && distance !== "" && time !== "") {
      // Calculate speed
      const calculatedSpeed = distanceM / timeS;
      return formatSpeed(calculatedSpeed);
    } else if (distance === "" && speed !== "" && time !== "") {
      // Calculate distance
      const calculatedDistance = speedMps * timeS;
      return formatDistance(calculatedDistance);
    } else if (time === "" && speed !== "" && distance !== "") {
      // Calculate time
      const calculatedTime = distanceM / speedMps;
      return formatTime(calculatedTime);
    }

    return null;
  };

  const formatSpeed = (speedMps: number) => {
    switch (speedUnit) {
      case "km/h":
        return `${(speedMps * 3.6).toFixed(2)} km/h`;
      case "m/s":
        return `${speedMps.toFixed(2)} m/s`;
      case "mph":
        return `${(speedMps * 2.237).toFixed(2)} mph`;
      default:
        return `${speedMps.toFixed(2)} m/s`;
    }
  };

  const formatDistance = (distanceM: number) => {
    switch (distanceUnit) {
      case "km":
        return `${(distanceM / 1000).toFixed(2)} km`;
      case "m":
        return `${distanceM.toFixed(2)} m`;
      case "miles":
        return `${(distanceM / 1609.34).toFixed(2)} miles`;
      default:
        return `${distanceM.toFixed(2)} m`;
    }
  };

  const formatTime = (timeS: number) => {
    switch (timeUnit) {
      case "hours":
        return `${(timeS / 3600).toFixed(2)} hours`;
      case "minutes":
        return `${(timeS / 60).toFixed(2)} minutes`;
      case "seconds":
        return `${timeS.toFixed(2)} seconds`;
      default:
        return `${timeS.toFixed(2)} seconds`;
    }
  };

  const clearAll = () => {
    setSpeed("");
    setDistance("");
    setTime("");
  };

  const result = calculateMissingValue();

  return (
    <main className={styles.container}>
      <section className={styles.tool}>
        <h1 className={styles.title}>
          <span className={styles.icon}>🏃</span>
          Speed Distance Time Calculator
        </h1>
        <p>Calculate speed, distance, or time using the formula: Speed = Distance ÷ Time</p>

        <div className={styles.calculator}>
          <div className={styles.inputGrid}>
            <div className={styles.inputGroup}>
              <label htmlFor="speed">Speed</label>
              <div className={styles.inputWithUnit}>
                <input
                  id="speed"
                  type="number"
                  value={speed}
                  onChange={(e) => setSpeed(e.target.value)}
                  placeholder="Enter speed"
                  step="0.01"
                />
                <select value={speedUnit} onChange={(e) => setSpeedUnit(e.target.value)}>
                  <option value="km/h">km/h</option>
                  <option value="m/s">m/s</option>
                  <option value="mph">mph</option>
                </select>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="distance">Distance</label>
              <div className={styles.inputWithUnit}>
                <input
                  id="distance"
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="Enter distance"
                  step="0.01"
                />
                <select value={distanceUnit} onChange={(e) => setDistanceUnit(e.target.value)}>
                  <option value="km">km</option>
                  <option value="m">m</option>
                  <option value="miles">miles</option>
                </select>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="time">Time</label>
              <div className={styles.inputWithUnit}>
                <input
                  id="time"
                  type="number"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="Enter time"
                  step="0.01"
                />
                <select value={timeUnit} onChange={(e) => setTimeUnit(e.target.value)}>
                  <option value="hours">hours</option>
                  <option value="minutes">minutes</option>
                  <option value="seconds">seconds</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.controls}>
            <button className={styles.clearBtn} onClick={clearAll}>
              Clear All
            </button>
          </div>

          {result && (
            <div className={styles.result}>
              <h3>Calculated Result:</h3>
              <div className={styles.resultValue}>{result}</div>
              <div className={styles.formula}>
                Formula: Speed = Distance ÷ Time
              </div>
            </div>
          )}
        </div>

        <div className={styles.examples}>
          <h3>Examples</h3>
          <div className={styles.exampleList}>
            <div className={styles.example}>
              <strong>Find Speed:</strong> Distance = 100 km, Time = 2 hours → Speed = 50 km/h
            </div>
            <div className={styles.example}>
              <strong>Find Distance:</strong> Speed = 60 km/h, Time = 3 hours → Distance = 180 km
            </div>
            <div className={styles.example}>
              <strong>Find Time:</strong> Speed = 10 m/s, Distance = 50 m → Time = 5 seconds
            </div>
          </div>
        </div>

        <div className={styles.conversionTable}>
          <h3>Common Speed Conversions</h3>
          <table>
            <thead>
              <tr>
                <th>Speed</th>
                <th>km/h</th>
                <th>m/s</th>
                <th>mph</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Walking</td>
                <td>5</td>
                <td>1.4</td>
                <td>3.1</td>
              </tr>
              <tr>
                <td>Cycling</td>
                <td>15</td>
                <td>4.2</td>
                <td>9.3</td>
              </tr>
              <tr>
                <td>Car</td>
                <td>60</td>
                <td>16.7</td>
                <td>37.3</td>
              </tr>
              <tr>
                <td>Plane</td>
                <td>900</td>
                <td>250</td>
                <td>559</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <ToolInfo
        howItWorks="1. Enter any two values (speed, distance, or time).<br>2. Leave the third field empty - it will be calculated automatically.<br>3. Select appropriate units for each measurement.<br>4. The result will appear instantly using the formula Speed = Distance ÷ Time."
        faqs={[
          {
            title: "What is the speed-distance-time relationship?",
            content: "Speed = Distance ÷ Time. This is the fundamental relationship used in physics and everyday calculations."
          },
          {
            title: "What units should I use?",
            content: "Use consistent units. The calculator handles conversions automatically, but be aware of the context (e.g., km/h for car speeds, m/s for scientific calculations)."
          },
          {
            title: "Can I calculate average speed?",
            content: "Yes! Enter total distance and total time to find average speed."
          }
        ]}
        tips={[
          "For car journeys, use km/h and hours for practical calculations",
          "In physics problems, use m/s and seconds for precise measurements",
          "Remember: speed is a scalar (magnitude only), velocity includes direction",
          "Use this calculator for travel planning, sports timing, or physics homework"
        ]}
      />
    </main>
  );
}