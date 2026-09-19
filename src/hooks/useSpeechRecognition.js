import { useState, useEffect, useCallback } from 'react';

export const useSpeechRecognition = (language = 'en-US') => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = language;

      rec.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      rec.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
      };

      rec.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setError(event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognition(rec);
    } else {
      setError('Browser does not support speech recognition.');
    }
  }, [language]);

  const startListening = useCallback(() => {
    if (recognition) {
      setTranscript('');
      try {
        recognition.start();
      } catch (e) {
        // Already started
      }
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
    }
  }, [recognition]);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    hasSupport: !!recognition
  };
};
