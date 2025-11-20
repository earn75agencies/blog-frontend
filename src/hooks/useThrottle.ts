import { useEffect, useState, useRef } from 'react';

/**
 * Hook to throttle value updates
 * @param value - Value to throttle
 * @param delay - Throttle delay in milliseconds
 * @returns Throttled value
 */
export const useThrottle = <T>(value: T, delay: number = 300): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= delay) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, delay - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return throttledValue;
};

