"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Volume2, VolumeX, RotateCcw, Check, X, AlertCircle } from "lucide-react";

interface VoiceSearchProps {
  onTranscript: (transcript: string) => void;
  onError?: (error: string) => void;
  isListening?: boolean;
  onListeningChange?: (listening: boolean) => void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export default function VoiceSearch({ 
  onTranscript, 
  onError, 
  isListening = false, 
  onListeningChange 
}: VoiceSearchProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isIntentionallyStopping = useRef<boolean>(false);

  // Check browser support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const isSupported = !!SpeechRecognition;
    
    // Additional checks for required APIs
    if (isSupported) {
      // Check if getUserMedia is supported for audio analysis
      const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      setIsSupported(hasGetUserMedia);
    } else {
      setIsSupported(false);
    }
  }, []);

  // Initialize speech recognition
  const initializeRecognition = useCallback(() => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      setIsProcessing(false);
      setError(null);
      onListeningChange?.(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';
      let maxConfidence = 0;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const confidence = result[0]?.confidence || 0;
        maxConfidence = Math.max(maxConfidence, confidence);

        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(finalTranscript);
        setInterimTranscript('');
        setConfidence(maxConfidence);
        onTranscript(finalTranscript);
        setIsProcessing(true);
      } else {
        setInterimTranscript(interimTranscript);
        setConfidence(maxConfidence);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // Don't treat "aborted" as an error if we're intentionally stopping
      if (event.error === 'aborted' && isIntentionallyStopping.current) {
        console.log('Speech recognition was intentionally stopped');
        setIsRecording(false);
        onListeningChange?.(false);
        isIntentionallyStopping.current = false;
        return;
      }
      
      // Don't treat "aborted" as an error - it's normal when stopping recognition
      if (event.error === 'aborted') {
        console.log('Speech recognition was stopped');
        setIsRecording(false);
        onListeningChange?.(false);
        return;
      }
      
      console.error('Speech recognition error:', event.error);
      let errorMessage = 'Speech recognition failed';
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'Microphone not accessible. Please check permissions.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission denied. Please allow microphone access.';
          break;
        case 'network':
          errorMessage = 'Network error. Please check your connection.';
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }
      
      setError(errorMessage);
      onError?.(errorMessage);
      setIsRecording(false);
      onListeningChange?.(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      onListeningChange?.(false);
      stopAudioAnalysis();
    };

    recognitionRef.current = recognition;
  }, [isSupported, onTranscript, onError, onListeningChange]);

  // Audio level analysis
  const startAudioAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateAudioLevel = () => {
        if (!analyserRef.current || !isRecording) return;
        
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;
        setAudioLevel(average / 255);
        
        animationRef.current = requestAnimationFrame(updateAudioLevel);
      };
      
      updateAudioLevel();
    } catch (err) {
      console.error('Failed to start audio analysis:', err);
    }
  };

  const stopAudioAnalysis = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    analyserRef.current = null;
    setAudioLevel(0);
  };

  // Start voice search
  const startVoiceSearch = async () => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser');
      return;
    }

    try {
      setError(null);
      setTranscript('');
      setInterimTranscript('');
      setConfidence(0);
      
      // Check microphone permissions first
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (permissionError) {
        if (permissionError instanceof Error) {
          if (permissionError.name === 'NotAllowedError') {
            setError('Microphone permission denied. Please allow microphone access and try again.');
            return;
          } else if (permissionError.name === 'NotFoundError') {
            setError('No microphone found. Please connect a microphone and try again.');
            return;
          } else {
            setError('Microphone access failed. Please check your microphone and try again.');
            return;
          }
        } else {
          setError('Microphone access failed. Please check your microphone and try again.');
          return;
        }
      }
      
      await startAudioAnalysis();
      initializeRecognition();
      recognitionRef.current?.start();
    } catch (err) {
      console.error('Failed to start voice search:', err);
      if (err instanceof Error) {
        setError(`Failed to start voice search: ${err.message}`);
      } else {
        setError('Failed to start voice search. Please try again.');
      }
    }
  };

  // Stop voice search
  const stopVoiceSearch = () => {
    isIntentionallyStopping.current = true;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    stopAudioAnalysis();
  };

  // Clear transcript
  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
    setConfidence(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isIntentionallyStopping.current = true;
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      stopAudioAnalysis();
    };
  }, []);

  if (!isSupported) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <h3 className="text-sm font-medium text-gray-800 mb-1">Voice Search Not Available</h3>
          <p className="text-sm text-gray-600 mb-3">
            Voice search requires a modern browser with microphone access.
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Try using Chrome, Firefox, or Safari</p>
            <p>• Make sure your browser supports Web Speech API</p>
            <p>• Check that microphone permissions are enabled</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      {/* Voice Search Button */}
      <div className="relative">
        <button
          onClick={isRecording ? stopVoiceSearch : startVoiceSearch}
          disabled={isProcessing}
          className={`relative w-20 h-20 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 voice-button-hover ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 voice-pulse'
              : 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30'
          } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {/* Animated rings for recording state */}
          {isRecording && (
            <>
              <div 
                className="absolute inset-0 rounded-full border-4 border-red-400 voice-wave"
                style={{ animationDuration: '1s' }}
              />
              <div 
                className="absolute inset-0 rounded-full border-4 border-red-300 voice-wave"
                style={{ animationDuration: '1.5s', animationDelay: '0.2s' }}
              />
              <div 
                className="absolute inset-0 rounded-full border-4 border-red-200 voice-wave"
                style={{ animationDuration: '2s', animationDelay: '0.4s' }}
              />
            </>
          )}
          
          {/* Audio level visualization */}
          {isRecording && (
            <div 
              className="absolute inset-0 rounded-full bg-red-400 opacity-30 transition-all duration-100 voice-listening"
              style={{ 
                transform: `scale(${1 + audioLevel * 0.5})`,
                opacity: 0.3 + audioLevel * 0.4
              }}
            />
          )}
          
          {/* Processing state */}
          {isProcessing && (
            <div className="absolute inset-0 rounded-full bg-blue-400 opacity-50 animate-pulse" />
          )}
          
          {/* Icon */}
          <div className="relative z-10 flex items-center justify-center w-full h-full">
            {isRecording ? (
              <MicOff className="w-8 h-8 text-white animate-pulse" />
            ) : isProcessing ? (
              <div className="processing-dots flex space-x-1">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                <span className="w-2 h-2 bg-white rounded-full"></span>
                <span className="w-2 h-2 bg-white rounded-full"></span>
              </div>
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </div>
        </button>
      </div>

      {/* Status Text */}
      <div className="text-center">
        {isRecording && (
          <p className="text-sm text-gray-600 animate-pulse">
            Listening... Speak now
          </p>
        )}
        {isProcessing && (
          <p className="text-sm text-blue-600 animate-pulse">
            Processing your speech...
          </p>
        )}
        {!isRecording && !isProcessing && !transcript && (
          <p className="text-sm text-gray-500">
            Click to start voice search
          </p>
        )}
      </div>

      {/* Transcript Display */}
      {(transcript || interimTranscript) && (
        <div className="w-full max-w-md transcript-slide-in">
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Transcript</h3>
              <div className="flex items-center space-x-2">
                {confidence > 0 && (
                  <span className="text-xs text-gray-500">
                    {Math.round(confidence * 100)}% confidence
                  </span>
                )}
                <button
                  onClick={clearTranscript}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              {transcript && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg success-check">
                  <div className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-green-800 font-medium">{transcript}</p>
                  </div>
                </div>
              )}
              
              {interimTranscript && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <div className="w-4 h-4 bg-blue-600 rounded-full mt-0.5 flex-shrink-0 animate-pulse" />
                    <p className="text-sm text-blue-800 italic">{interimTranscript}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="w-full max-w-md error-shake">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!isRecording && !transcript && !error && (
        <div className="text-center max-w-md">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Voice Search Tips</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Speak clearly and at a normal pace</li>
              <li>• Make sure your microphone is working</li>
              <li>• Try to minimize background noise</li>
              <li>• Click the microphone to start/stop</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
