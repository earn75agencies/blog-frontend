import { useEffect, useRef } from 'react';

/**
 * Hook to run callback after timeout
 * @param callback - Callback function
 * @param delay - Delay in milliseconds
 */
export const useTimeout = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setTimeout(() => {
        savedCallback.current?.();
      }, delay);

      return () => clearTimeout(id);
    }
  }, [delay]);
};

