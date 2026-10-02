import { useCallback, useEffect, useRef, useState } from 'react';

export type VoiceState = 'idle' | 'listening' | 'processing' | 'understanding' | 'completed' | 'error';

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
    length: number;
  };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: { error: string }) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export function useVoiceInput(onFinalTranscript?: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState<VoiceState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSupport, setHasSupport] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      setHasSupport(false);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'hi-IN'; // Default to Indian Hindi; speech engine auto-detects Hinglish/English terms

      recognition.onstart = () => {
        setIsListening(true);
        setStatus('listening');
        setErrorMessage(null);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);

        if (event.results[event.results.length - 1].isFinal) {
          setStatus('understanding');
          if (onFinalTranscript) {
            onFinalTranscript(currentTranscript);
          }
        }
      };

      recognition.onerror = (event: { error: string }) => {
        setIsListening(false);
        setStatus('error');
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access was denied. Please allow microphone permissions.');
        } else if (event.error === 'no-speech') {
          setErrorMessage('No speech was detected. Please try speaking again.');
        } else {
          setErrorMessage(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (status === 'listening') {
          setStatus('processing');
        }
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Speech recognition initialization error', e);
      setHasSupport(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onFinalTranscript, status]);

  const startListening = useCallback((langCode: string = 'hi-IN') => {
    if (!recognitionRef.current) {
      setErrorMessage('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }
    try {
      setTranscript('');
      setErrorMessage(null);
      recognitionRef.current.lang = langCode;
      recognitionRef.current.start();
    } catch {
      // In case already started
      try {
        recognitionRef.current.stop();
        setTimeout(() => {
          recognitionRef.current?.start();
        }, 100);
      } catch {
        // no-op
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setStatus('processing');
    }
  }, [isListening]);

  return {
    isListening,
    transcript,
    status,
    errorMessage,
    hasSupport,
    startListening,
    stopListening,
    setStatus,
    setTranscript
  };
}
