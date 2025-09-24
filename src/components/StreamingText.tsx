"use client";

import { useEffect, useState, useRef } from "react";

interface StreamingTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
  showCursor?: boolean;
  cursorColor?: string;
  highlightWords?: string[];
  streamType?: 'typewriter' | 'fade-in' | 'slide-in';
}

export default function StreamingText({
  text,
  speed = 50,
  delay = 0,
  className = "",
  onComplete,
  showCursor = true,
  cursorColor = "#ba160a",
  highlightWords = [],
  streamType = 'typewriter'
}: StreamingTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showCursorBlink, setShowCursorBlink] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Reset state when text changes
    setDisplayText("");
    setCurrentIndex(0);
    setIsComplete(false);
    setShowCursorBlink(true);

    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        startStreaming();
      }, delay);
    } else {
      startStreaming();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [text, speed, delay]);

  const startStreaming = () => {
    if (streamType === 'typewriter') {
      typewriterEffect();
    } else if (streamType === 'fade-in') {
      fadeInEffect();
    } else if (streamType === 'slide-in') {
      slideInEffect();
    }
  };

  const typewriterEffect = () => {
    if (currentIndex < text.length) {
      timeoutRef.current = setTimeout(() => {
        setDisplayText(text.substring(0, currentIndex + 1));
        setCurrentIndex(prev => prev + 1);
      }, speed);
    } else if (!isComplete) {
      setIsComplete(true);
      if (showCursor) {
        setTimeout(() => setShowCursorBlink(false), 2000);
      }
      if (onComplete) {
        onComplete();
      }
    }
  };

  const fadeInEffect = () => {
    setDisplayText(text);
    setIsComplete(true);
    if (onComplete) {
      setTimeout(onComplete, 500);
    }
  };

  const slideInEffect = () => {
    setDisplayText(text);
    setIsComplete(true);
    if (onComplete) {
      setTimeout(onComplete, 300);
    }
  };

  useEffect(() => {
    if (streamType === 'typewriter' && currentIndex < text.length) {
      typewriterEffect();
    }
  }, [currentIndex, text, speed, streamType]);

  const renderHighlightedText = (text: string) => {
    if (highlightWords.length === 0) {
      return text;
    }

    let highlightedText = text;
    highlightWords.forEach(word => {
      const regex = new RegExp(`(${word})`, 'gi');
      highlightedText = highlightedText.replace(regex, `<mark class="bg-red-100 text-red-700 px-1 rounded font-semibold">$1</mark>`);
    });

    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  const getCursorStyles = () => ({
    color: cursorColor,
    animation: showCursorBlink ? 'blink 1s infinite' : 'none',
    opacity: showCursorBlink ? 1 : 0,
    transition: 'opacity 0.5s ease-out'
  });

  const getContainerStyles = () => {
    const baseStyles = className;
    
    if (streamType === 'fade-in') {
      return `${baseStyles} animate-in fade-in duration-500`;
    } else if (streamType === 'slide-in') {
      return `${baseStyles} animate-in slide-in-from-left-4 duration-300`;
    }
    
    return baseStyles;
  };

  return (
    <span className={getContainerStyles()}>
      {renderHighlightedText(displayText)}
      {showCursor && streamType === 'typewriter' && (
        <span 
          style={getCursorStyles()}
          className="inline-block ml-0.5 font-bold"
        >
          |
        </span>
      )}
    </span>
  );
}

// Enhanced streaming component for numbers with counting effect
interface StreamingNumberProps {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  formatNumber?: boolean;
  onComplete?: () => void;
}

export function StreamingNumber({
  value,
  duration = 1000,
  delay = 0,
  className = "",
  prefix = "",
  suffix = "",
  formatNumber = true,
  onComplete
}: StreamingNumberProps) {
  const [currentValue, setCurrentValue] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const startTime = Date.now() + delay;
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      
      if (elapsed < 0) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      
      setCurrentValue(Math.floor(value * easeOutQuad));
      
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentValue(value);
        setIsComplete(true);
        if (onComplete) {
          onComplete();
        }
      }
    };
    
    frameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [value, duration, delay]);

  const formatValue = (num: number) => {
    if (!formatNumber) return num.toString();
    return num.toLocaleString();
  };

  return (
    <span className={`${className} ${isComplete ? 'count-up' : ''}`}>
      {prefix}
      {formatValue(currentValue)}
      {suffix}
    </span>
  );
}
