'use client';

import { useState } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './unitconverter.module.css';

interface UnitConversion {
  [key: string]: {
    [key: string]: number;
  };
}

const conversions: UnitConversion = {
  length: {
    'mm': 1,
    'cm': 10,
    'm': 1000,
    'km': 1000000,
    'in': 25.4,
    'ft': 304.8,
    'yd': 914.4,
    'mi': 1609344
  },
  weight: {
    'mg': 1,
    'g': 1000,
    'kg': 1000000,
    'oz': 28349.5,
    'lb': 453592,
    'ton': 907184740
  },
  temperature: {
    'C': 1,
    'F': 1,
    'K': 1
  },
  area: {
    'mm²': 1,
    'cm²': 100,
    'm²': 1000000,
    'km²': 1000000000000,
    'in²': 645.16,
    'ft²': 92903,
    'yd²': 836127,
    'ac': 4046856422.4,
    'ha': 10000000000
  },
  volume: {
    'ml': 1,
    'l': 1000,
    'm³': 1000000,
    'in³': 16.387,
    'ft³': 28316.8,
    'yd³': 764554.9,
    'gal': 3785.41,
    'qt': 946.353,
    'pt': 473.176,
    'cup': 236.588
  },
  time: {
    'ms': 1,
    's': 1000,
    'min': 60000,
    'h': 3600000,
    'day': 86400000,
    'week': 604800000,
    'month': 2629746000,
    'year': 31556952000
  }
};

const unitNames: { [key: string]: string } = {
  length: 'Length',
  weight: 'Weight/Mass',
  temperature: 'Temperature',
  area: 'Area',
  volume: 'Volume',
  time: 'Time'
};

export default function UnitConverter() {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');

  const convert = (value: string, from: string, to: string, cat: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';

    if (cat === 'temperature') {
      return convertTemperature(numValue, from, to);
    }

    const baseValue = numValue * conversions[cat][from];
    const result = baseValue / conversions[cat][to];
    return result.toFixed(6).replace(/\.?0+$/, '');
  };

  const convertTemperature = (value: number, from: string, to: string) => {
    let celsius: number;

    // Convert to Celsius first
    switch (from) {
      case 'F':
        celsius = (value - 32) * 5/9;
        break;
      case 'K':
        celsius = value - 273.15;
        break;
      default:
        celsius = value;
    }

    // Convert from Celsius to target unit
    switch (to) {
      case 'F':
        return ((celsius * 9/5) + 32).toFixed(2);
      case 'K':
        return (celsius + 273.15).toFixed(2);
      default:
        return celsius.toFixed(2);
    }
  };

  const handleFromValueChange = (value: string) => {
    setFromValue(value);
    if (value) {
      const result = convert(value, fromUnit, toUnit, category);
      setToValue(result);
    } else {
      setToValue('');
    }
  };

  const handleToValueChange = (value: string) => {
    setToValue(value);
    if (value) {
      const result = convert(value, toUnit, fromUnit, category);
      setFromValue(result);
    } else {
      setFromValue('');
    }
  };

  const swapUnits = () => {
    const tempUnit = fromUnit;
    const tempValue = fromValue;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    setFromValue(toValue);
    setToValue(tempValue);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    const units = Object.keys(conversions[newCategory]);
    setFromUnit(units[0]);
    setToUnit(units[1]);
    setFromValue('');
    setToValue('');
  };

  return (
    <main className={styles.container}>
      <h1>Unit Converter</h1>

      <div className={styles.calculator}>
        <div className={styles.categorySelector}>
          <h2>Select Category</h2>
          <div className={styles.categoryButtons}>
            {Object.entries(unitNames).map(([key, name]) => (
              <button
                key={key}
                onClick={() => handleCategoryChange(key)}
                className={`${styles.categoryBtn} ${category === key ? styles.active : ''}`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.converter}>
          <div className={styles.inputGroup}>
            <label>From:</label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className={styles.unitSelect}
            >
              {Object.keys(conversions[category]).map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
            <input
              type="number"
              value={fromValue}
              onChange={(e) => handleFromValueChange(e.target.value)}
              placeholder="Enter value"
              className={styles.valueInput}
            />
          </div>

          <button onClick={swapUnits} className={styles.swapBtn} title="Swap units">
            ⇄
          </button>

          <div className={styles.inputGroup}>
            <label>To:</label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className={styles.unitSelect}
            >
              {Object.keys(conversions[category]).map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
            <input
              type="number"
              value={toValue}
              onChange={(e) => handleToValueChange(e.target.value)}
              placeholder="Result"
              className={styles.valueInput}
            />
          </div>
        </div>
      </div>

      <ToolInfo
        howItWorks="Select a category (Length, Weight, Temperature, etc.)<br>Choose units to convert from and to<br>Enter a value in either input field<br>The conversion happens automatically<br>Use swap button to reverse conversion direction"
        faqs={[
          { title: "How accurate are the conversions?", content: "Conversions use standard conversion factors and are accurate for most practical purposes." },
          { title: "What temperature scales are supported?", content: "Celsius (°C), Fahrenheit (°F), and Kelvin (K)." },
          { title: "Can I convert between any units?", content: "Yes, as long as they're in the same category (length, weight, etc.)." },
          { title: "Are imperial and metric units supported?", content: "Yes, both metric and imperial/US customary units are included." }
        ]}
        tips={["Double-check unit selections before important conversions", "Temperature conversions use exact formulas", "Results show up to 6 decimal places for precision", "Swap button quickly reverses conversion direction"]}
      />
    </main>
  );
}