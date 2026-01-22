'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './speechtotext.module.css';

export default function SpeechToTextPage() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [continuous, setContinuous] = useState(true);
  const [interimResults, setInterimResults] = useState(true);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();

      const recognition = recognitionRef.current;
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = language;

      recognition.onstart = () => {
        setIsListening(true);
        setError('');
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(prev => prev + finalTranscript);
        setInterimTranscript(interimTranscript);
      };

      recognition.onerror = (event: any) => {
        setError(`Error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };
    } else {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, continuous, interimResults]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        setError('Failed to start speech recognition');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
  };

  const copyToClipboard = async () => {
    const fullText = transcript + interimTranscript;
    try {
      await navigator.clipboard.writeText(fullText);
      alert('Transcript copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadTranscript = () => {
    const fullText = transcript + interimTranscript;
    const blob = new Blob([fullText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'speech-transcript.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'es-ES', name: 'Spanish (Spain)' },
    { code: 'fr-FR', name: 'French (France)' },
    { code: 'de-DE', name: 'German (Germany)' },
    { code: 'it-IT', name: 'Italian (Italy)' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)' },
    { code: 'ja-JP', name: 'Japanese (Japan)' },
    { code: 'ko-KR', name: 'Korean (Korea)' },
    { code: 'zh-CN', name: 'Chinese (Mandarin)' },
  ];

  if (!isSupported) {
    return (
      <div className={styles.container}>
        <div className={styles.tool}>
          <div className={styles.unsupported}>
            <h2>Browser Not Supported</h2>
            <p>Speech recognition is not supported in this browser.</p>
            <p>Please use a modern browser like Chrome, Edge, or Safari for the best experience.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.tool}>
        <div className={styles.controlsSection}>
          <div className={styles.controlsGrid}>
            <div className={styles.controlGroup}>
              <label className={styles.label}>Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={styles.select}
                disabled={isListening}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.label}>Mode</label>
              <div className={styles.modeButtons}>
                <button
                  onClick={() => setContinuous(true)}
                  className={`${styles.modeBtn} ${continuous ? styles.active : ''}`}
                  disabled={isListening}
                >
                  Continuous
                </button>
                <button
                  onClick={() => setContinuous(false)}
                  className={`${styles.modeBtn} ${!continuous ? styles.active : ''}`}
                  disabled={isListening}
                >
                  Single Phrase
                </button>
              </div>
            </div>
          </div>

          <div className={styles.options}>
            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={interimResults}
                onChange={(e) => setInterimResults(e.target.checked)}
                disabled={isListening}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>Show interim results</span>
            </label>
          </div>
        </div>

        <div className={styles.recordingSection}>
          <div className={styles.recordingStatus}>
            <div className={`${styles.statusIndicator} ${isListening ? styles.listening : ''}`}>
              {isListening ? '🔴' : '⚪'}
            </div>
            <span className={styles.statusText}>
              {isListening ? 'Listening...' : 'Not listening'}
            </span>
          </div>

          <div className={styles.recordingControls}>
            {!isListening ? (
              <button onClick={startListening} className={styles.startBtn}>
                🎤 Start Listening
              </button>
            ) : (
              <button onClick={stopListening} className={styles.stopBtn}>
                ⏹️ Stop Listening
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <div className={styles.transcriptSection}>
          <div className={styles.transcriptHeader}>
            <h3>Transcript</h3>
            <div className={styles.transcriptActions}>
              <button onClick={clearTranscript} className={styles.clearBtn}>
                Clear
              </button>
              <button onClick={copyToClipboard} className={styles.copyBtn}>
                Copy
              </button>
              <button onClick={downloadTranscript} className={styles.downloadBtn}>
                Download
              </button>
            </div>
          </div>

          <div className={styles.transcriptArea}>
            <div className={styles.finalTranscript}>
              {transcript}
            </div>
            {interimTranscript && (
              <div className={styles.interimTranscript}>
                {interimTranscript}
              </div>
            )}
            {!transcript && !interimTranscript && (
              <div className={styles.placeholder}>
                Click "Start Listening" and begin speaking. Your speech will appear here...
              </div>
            )}
          </div>
        </div>

        <div className={styles.infoSection}>
          <h4>How to use:</h4>
          <ul>
            <li>Select your language from the dropdown</li>
            <li>Choose between continuous listening or single phrase mode</li>
            <li>Click "Start Listening" and grant microphone permission when prompted</li>
            <li>Speak clearly into your microphone</li>
            <li>Your speech will be converted to text in real-time</li>
            <li>Use "Stop Listening" to end the session</li>
          </ul>
        </div>
      </div>
    </div>
  );
}