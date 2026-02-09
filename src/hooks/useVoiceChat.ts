import { useState, useCallback, useRef, useEffect } from 'react';

type SpeechRecognitionEvent = Event & { results: SpeechRecognitionResultList };

export function useVoiceChat() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);

  const supportsRecognition = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  const supportsSynthesis = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const startListening = useCallback((onResult: (text: string) => void) => {
    if (!supportsRecognition) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const results = Array.from(event.results);
      const text = results.map(r => r[0].transcript).join('');
      setTranscript(text);

      const lastResult = results[results.length - 1];
      if (lastResult.isFinal) {
        onResult(text);
        setTranscript('');
        setIsListening(false);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      setTranscript('');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [supportsRecognition]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setTranscript('');
  }, []);

  const speak = useCallback((text: string) => {
    if (!supportsSynthesis || !synthRef.current) return;

    // Strip markdown
    const clean = text
      .replace(/[#*_`~\[\]()>!-]/g, '')
      .replace(/\n+/g, '. ')
      .trim();

    if (!clean) return;

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'pt-BR';
    utterance.rate = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    synthRef.current.speak(utterance);
  }, [supportsSynthesis]);

  const stopSpeaking = useCallback(() => {
    synthRef.current?.cancel();
    setIsSpeaking(false);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      synthRef.current?.cancel();
    };
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    supportsRecognition,
    supportsSynthesis,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}
